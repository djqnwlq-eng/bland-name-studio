import { GoogleGenerativeAI } from '@google/generative-ai';

function getGenAI(apiKey) {
  return new GoogleGenerativeAI(apiKey);
}

// 503(혼잡) 대비로 계열이 다른 모델을 섞어 둠. lite 계열은 혼잡이 덜하고 응답도 빠름.
// thinkingLevel: 3.6과 lite 계열은 minimal 지원, 3.8/flash-latest는 low만 지원.
// lite 계열이 혼잡도 덜하고 응답도 빨라 바로 다음 순서로 둠
const MODEL_FALLBACKS = [
  { name: 'gemini-3.6-flash', thinkingLevel: 'minimal' },
  { name: 'gemini-3.5-flash-lite', thinkingLevel: 'minimal' },
  { name: 'gemini-flash-lite-latest', thinkingLevel: 'minimal' },
  { name: 'gemini-3.8-flash', thinkingLevel: 'low' },
  { name: 'gemini-flash-latest', thinkingLevel: 'low' },
  // 신규 키에서는 404. 기존 키 사용자를 위한 마지막 예비.
  { name: 'gemini-2.5-flash', thinkingBudget: 0 },
];

// 정상 생성은 10초 안쪽. 응답이 늦으면 기다리기보다 다른 모델로 넘어가는 편이 빠름
const REQUEST_TIMEOUT_MS = 20000;
// 모델을 돌아가며 시도하더라도 사용자가 기다리는 총 시간은 제한
const TOTAL_BUDGET_MS = 45000;

function isRetryableError(err) {
  const msg = String(err?.message ?? err);
  return /\b(503|502|504|429|overloaded|high demand|UNAVAILABLE|Service Unavailable|MAX_TOKENS)\b/i.test(msg)
    || isTimeoutOrNetworkError(err);
}

// 시간 초과 / 네트워크 차단 (보안 프로그램, 방화벽, 확장 프로그램 등)
function isTimeoutOrNetworkError(err) {
  const msg = String(err?.message ?? err);
  return /timeout|aborted|AbortError|Failed to fetch|NetworkError|network error|ERR_/i.test(msg);
}

// 모델이 종료됐거나 해당 키에서 사용할 수 없는 경우 → 재시도 없이 다음 모델로
function isModelUnavailableError(err) {
  const msg = String(err?.message ?? err);
  return /\[404\b|NOT_FOUND|no longer available|is not found|not supported for generateContent/i.test(msg);
}

function getThinkingConfig(model) {
  return model.thinkingLevel ? { thinkingLevel: model.thinkingLevel } : { thinkingBudget: model.thinkingBudget };
}

// 결제 크레딧 소진(402): 결제 계정 단위 문제라 다른 모델로 바꿔도 동일 → 즉시 안내
function isBillingError(err) {
  return /\[402\b|Payment Required|prepayment credits are depleted/i.test(String(err?.message ?? err));
}

// 키 자체가 잘못된 경우 (앞뒤 공백/줄바꿈이 섞여 들어오는 경우가 많음)
function isInvalidKeyError(err) {
  return /API_KEY_INVALID|API key not valid|API key expired/i.test(String(err?.message ?? err));
}

const INVALID_KEY_GUIDE =
  '입력한 API 키가 올바르지 않습니다.\n' +
  '키 전체를 다시 복사해서 오른쪽 위 "API 키 변경"에 붙여넣어 주세요. (키는 보통 AIza로 시작합니다)';

// 무료 사용량 한도 초과
function isQuotaError(err) {
  return /\[429\b|RESOURCE_EXHAUSTED|quota|rate limit/i.test(String(err?.message ?? err));
}

const BILLING_GUIDE =
  '구글 AI 결제 크레딧이 모두 소진되어 생성할 수 없습니다.\n' +
  '해결 방법은 두 가지입니다.\n' +
  '1) AI Studio 결제 페이지(https://aistudio.google.com/usage)에서 크레딧을 충전\n' +
  '2) 결제가 연결되지 않은 새 프로젝트에서 API 키를 새로 발급받아 "API 키 변경"에 입력 (무료 사용량으로 이용)';

function isOverloadedError(err) {
  return /\b(503|502|504|overloaded|high demand|UNAVAILABLE|Service Unavailable)\b/i.test(String(err?.message ?? err));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generateWithRetry({ genAI, generationConfig, prompt }) {
  let lastErr;
  // 모델별 실패 사유를 모아 두어야 원인 파악이 가능 (마지막 오류만 보면 오해하기 쉬움)
  const failures = [];
  const startedAt = Date.now();
  for (let modelIdx = 0; modelIdx < MODEL_FALLBACKS.length; modelIdx++) {
    // 남은 시간이 거의 없으면 더 시도하지 않고 안내 메시지로 종료
    if (Date.now() - startedAt > TOTAL_BUDGET_MS) break;
    const modelName = MODEL_FALLBACKS[modelIdx].name;
    const modelConfig = { ...generationConfig, thinkingConfig: getThinkingConfig(MODEL_FALLBACKS[modelIdx]) };
    const model = genAI.getGenerativeModel(
      { model: modelName, generationConfig: modelConfig },
      { timeout: REQUEST_TIMEOUT_MS }
    );
    // 혼잡(503)은 모델을 바꾸면 해결되는 경우가 많아 같은 모델에 오래 매달리지 않음
    const maxAttempts = 2;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (Date.now() - startedAt > TOTAL_BUDGET_MS) break;
      try {
        const result = await model.generateContent(prompt);
        const finishReason = result.response?.candidates?.[0]?.finishReason;
        if (finishReason === 'MAX_TOKENS') {
          throw new Error('MAX_TOKENS: 응답이 길이 제한으로 잘림');
        }
        return result.response;
      } catch (err) {
        lastErr = err;
        const brief = String(err?.message ?? err).replace(/Error fetching from \S+: /, '').slice(0, 100);
        failures.push(`${modelName} → ${brief}`);
        if (isBillingError(err)) throw new Error(BILLING_GUIDE);
        if (isInvalidKeyError(err)) throw new Error(INVALID_KEY_GUIDE);
        if (isModelUnavailableError(err)) break;
        if (!isRetryableError(err)) {
          err.message = `${err.message}\n\n(자세한 내용)\n- ${failures.join('\n- ')}\n[앱 버전 v3]`;
          throw err;
        }
        if (attempt < maxAttempts - 1) {
          await sleep(700 * Math.pow(2, attempt) + Math.random() * 400);
        }
      }
    }
  }
  const trail = `\n\n(자세한 내용)\n- ${failures.join('\n- ')}\n[앱 버전 v3]`;
  if (isBillingError(lastErr)) throw new Error(BILLING_GUIDE);
  if (isQuotaError(lastErr)) {
    throw new Error(
      `오늘 사용할 수 있는 무료 사용량을 모두 쓴 것으로 보입니다.\n` +
        `잠시 뒤에 다시 시도하시거나, 사용량이 초기화된 뒤 이용해 주세요.${trail}`
    );
  }
  if (isOverloadedError(lastErr)) {
    throw new Error(
      `지금 구글 AI 서버가 혼잡합니다. 30초~1분 뒤에 "다시 시도"를 눌러 주세요.\n` +
        `무료 사용량으로 이용할 때 이용자가 몰리면 일시적으로 나타나는 현상이며, 잠시 뒤에는 대부분 정상 생성됩니다.${trail}`
    );
  }
  if (isTimeoutOrNetworkError(lastErr)) {
    throw new Error(
      `구글 AI 서버에서 응답이 오지 않았습니다. ` +
        `다른 네트워크(휴대폰 테더링 등)나 시크릿 창에서 시도해 보세요.${trail}`
    );
  }
  lastErr.message = `${lastErr.message}${trail}`;
  throw lastErr;
}

function parseJsonResponse(response) {
  const text = response?.text?.() ?? '';
  if (!text) {
    const blockReason = response?.promptFeedback?.blockReason;
    const finishReason = response?.candidates?.[0]?.finishReason;
    throw new Error(
      `Gemini 응답이 비어 있습니다 (blockReason=${blockReason ?? 'none'}, finishReason=${finishReason ?? 'none'})`
    );
  }
  const cleaned = text.trim().replace(/^```json\s*|\s*```$/g, '');
  const match = cleaned.match(/\{[\s\S]*\}/);
  const jsonStr = match ? match[0] : cleaned;
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`JSON 파싱 실패: ${e.message} | 응답 일부: ${text.slice(0, 200)}`);
  }
}

// 3.x 모델이 배열 항목을 객체 대신 JSON 문자열로 주는 경우가 있어 객체로 풀어줌
function normalizeItems(items) {
  if (!Array.isArray(items)) return items;
  return items
    .map((item) => {
      if (typeof item !== 'string') return item;
      try {
        return JSON.parse(item);
      } catch {
        return null;
      }
    })
    .filter((item) => item && item.name);
}

export async function generateNames({ position, coreValue, feeling, apiKey }) {
  const genAI = getGenAI(apiKey);
  const generationConfig = {
    responseMimeType: 'application/json',
    maxOutputTokens: 8192,
    temperature: 0.9,
  };

  const prompt = `당신은 전문 화장품 브랜드 네이머입니다.

[참고 브랜드 네이밍 구조 100선]
- 조어/신조어: Laneige(lait+neige), CeraVe(ceramide+ve), COSRX(COS+RX), Innisfree(Yeats 시에서 차용), Aesop(이솝 우화), Glossier(glossy 변형)
- 감각/감정: Rare Beauty(희소성), Too Faced(대담함), Fresh(신선함), Glow Recipe(빛남+레시피), Drunk Elephant(자연발효 은유)
- 자연/성분: Innisfree(자연의 섬), Anua(자연 어원), Isntree(is+n+tree), Herbivore(초식동물=순수 식물성), Tatcha(일본 다도)
- 창업자명: Chanel, Estée Lauder, Bobbi Brown, Charlotte Tilbury, Huda Beauty, Jo Malone, Tom Ford
- 역사/지명: Beauty of Joseon(조선), Sol de Janeiro(리우의 태양), Sulwhasoo(설화수=눈꽃빛 秀), Laneige(프랑스어 눈)
- 두문자/약어: MAC, NYX, AHC(Aesthetic Hydration Cosmetics), NARS, SK-II
- 숫자/코드: 23yearsold, AGE20's, No7, Chanel N°5
- 추상적 전환 사례: "덜어냄"→비움→공(空)→고요→(고요를 담은 새 이름), "순수"→이슬→새벽→(새벽 이슬을 압축한 새 이름)

위 브랜드들이 사용한 네이밍 기법(언어유희, 외국어 차용, 한자 뜻 조합, 자연 은유, 개념 압축)을 구조적으로 참고하세요.
⚠️ 위 목록과 이 안내문에 나온 모든 이름(실제 브랜드명·예시명)은 기법 참고용일 뿐입니다. 그대로 쓰거나, 한두 글자만 바꾸거나, 일부로 포함한 이름은 절대 출력하지 마세요.

[사용 가능한 네이밍 패턴]
① 창업자/인물명 - Chanel, Charlotte Tilbury, Huda Beauty
② 감각/감정 단어 - Rare Beauty, Glossier, Too Faced
③ 자연/성분/원료 - Innisfree, Anua, Isntree
④ 조어/신조어 - COSRX, Laneige, CeraVe
⑤ 두문자어/약어 - MAC, NYX, AHC
⑥ 역사/지명/시대 - Beauty of Joseon, Sol de Janeiro
⑦ 숫자/코드형 - 23yearsold, AGE20's, No7

[포지셔닝별 추천 패턴]
${position.name}: ${position.recommendPatterns.join(', ')} 패턴 추천

[★ 가장 중요한 규칙: 키워드 확장]
이름을 만들기 전에 반드시 아래 과정을 거치세요:

STEP 1. 핵심가치 키워드에서 연상되는 상황, 감각, 이미지, 분위기를 5개 이상 펼치세요.
STEP 2. 소비자 느낌 키워드에서 연상되는 상황, 감각, 이미지, 분위기를 5개 이상 펼치세요.
STEP 3. STEP 1과 STEP 2의 연상 결과를 교차 조합하여 브랜드명을 도출하세요.

확장 예시:
- "문제성 피부 해결" → 근원 치료, 피부 재생, 세포 리셋, 정밀 처방, 피부 과학, 클리닉의 하얀 빛
- "약국" → 처방전, 하얀 가운, 유리병, 정밀한 조제, 투명한 액체, 신뢰의 공간, 연구실, 약사의 손길
- "보습" → 이슬, 새벽 물안개, 촉촉한 꽃잎, 오아시스, 샘물, 젖은 유리
- "청량감" → 민트바람, 빙하, 첫 숨, 얼음 위 물방울, 고산지대 공기

입력된 단어를 그대로 쓰거나 단순 결합(약+결, 보+습)하는 것은 절대 금지입니다.
반드시 확장된 연상에서 브랜드명을 도출하세요.

[핵심 규칙]
1. 위 7개 패턴 중 포지셔닝에 맞는 패턴을 자동 선택하세요. 5개 이름은 반드시 서로 다른 패턴을 사용하세요.
2. 음절 수(2~4음절)와 발음 느낌도 각 이름에 최적화하여 AI가 자동 결정하세요.
3. 다양성 필수: 5개 이름은 끝 글자, 접미사, 어감, 구조가 모두 달라야 합니다. 같은 글자로 끝나거나 비슷한 형태가 2개 이상 나오면 안 됩니다.
4. 포지셔닝: ${position.name} (${position.desc})
5. 이름은 반드시 발음 가능하고 기억에 남아야 함
6. 상표 등록 가능성 고려 (일반명사 단독 사용 금지)
${position.id === 'kbeauty' ? '7. 반드시 순수 한글 이름으로 생성 (설화수·아리따움·한율 같은 한글 브랜드의 감각은 참고하되, 이 이름들은 쓰지 말 것)\n8. 한글 이름의 경우 pronunciation 필드에 영문 로마자 표기를 넣으세요 (예: 이름이 "솔바람"이면 "Solbaram")' : ''}

[사용자 입력 - 두 가지 모두 반드시 확장 후 반영]
핵심가치: ${coreValue}
소비자 느낌: ${feeling}

아래 JSON 형식으로 정확히 5개 생성. JSON 외 다른 텍스트 출력 금지:
{
  "names": [
    {
      "name": "브랜드이름",
      "pronunciation": "한글발음",
      "pattern_used": "사용한 패턴명",
      "pattern_basis": "패턴 적용 근거 1줄",
      "story": "네이밍 스토리 1줄",
      "risk": "낮음 또는 보통 또는 높음",
      "risk_reason": "상표 위험 이유 간단히"
    }
  ]
}`;

  const response = await generateWithRetry({ genAI, generationConfig, prompt });
  const data = parseJsonResponse(response);
  data.names = normalizeItems(data.names);
  return data;
}

export async function strengthenName({ name, story, patternName, apiKey }) {
  const genAI = getGenAI(apiKey);
  const generationConfig = {
    responseMimeType: 'application/json',
    maxOutputTokens: 4096,
    temperature: 0.9,
  };

  const prompt = `당신은 화장품 브랜드 네이밍 전문가입니다.

기존 이름을 기반으로 살짝 변형하여 더 세련된 브랜드명으로 강화하세요.

[강화 규칙]
1. 원래 이름의 핵심 단어나 음절을 반드시 유지하세요. 완전히 새로운 이름을 만들지 마세요.
2. 먼저 원래 이름의 핵심 의미에서 연상을 확장하세요:
   예: "맑은결" → 맑음(투명, 유리, 이슬), 결(피부결, 결실, 무늬) → 확장된 연상을 활용하여 강화
3. 다음 중 하나의 방법으로 강화하세요:
   - 연상에서 나온 단어를 하나 추가 (예: 맑은결 → 맑은결로, 이슬결)
   - 핵심 음절을 유지하며 유사어로 교체 (예: 맑은결 → 맑은빛, 청윤결)
   - 접두/접미 변형 (예: 맑은결 → 결맑음, 맑결)
   - 한글을 로마자로 세련되게 표기 (예: 맑은결 → Malgyeol, MalQ)
4. 원래 이름과의 연결이 바로 느껴져야 합니다. 뜻이 크게 바뀌면 안 됩니다.
5. 실제 출시된 화장품 브랜드(설화수, 한율, 라네즈, 이니스프리)의 네이밍 감각을 참고하세요.

패턴: ${patternName}
원래 이름: ${name}
원래 스토리: ${story}

강화된 이름 3개를 JSON으로 출력하세요. JSON 외 다른 텍스트 출력 금지:
{
  "options": [
    {
      "name": "강화된 이름",
      "pronunciation": "한글 또는 영문 발음",
      "story": "강화 배경 1줄",
      "reason": "강화 이유 1줄"
    }
  ]
}`;

  const response = await generateWithRetry({ genAI, generationConfig, prompt });
  const data = parseJsonResponse(response);
  data.options = normalizeItems(data.options);
  return data;
}
