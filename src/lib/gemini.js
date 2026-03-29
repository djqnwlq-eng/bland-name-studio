import { GoogleGenerativeAI } from '@google/generative-ai';

function getGenAI(apiKey) {
  return new GoogleGenerativeAI(apiKey);
}

export async function generateNames({ position, coreValue, feeling, apiKey }) {
  const genAI = getGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `당신은 전문 화장품 브랜드 네이머입니다.

[참고 브랜드 네이밍 구조 100선]
- 조어/신조어: Laneige(lait+neige), CeraVe(ceramide+ve), COSRX(COS+RX), Innisfree(Yeats 시에서 차용), Aesop(이솝 우화), Glossier(glossy 변형)
- 감각/감정: Rare Beauty(희소성), Too Faced(대담함), Fresh(신선함), Glow Recipe(빛남+레시피), Drunk Elephant(자연발효 은유)
- 자연/성분: Innisfree(자연의 섬), Anua(자연 어원), Isntree(is+n+tree), Herbivore(초식동물=순수 식물성), Tatcha(일본 다도)
- 창업자명: Chanel, Estée Lauder, Bobbi Brown, Charlotte Tilbury, Huda Beauty, Jo Malone, Tom Ford
- 역사/지명: Beauty of Joseon(조선), Sol de Janeiro(리우의 태양), Sulwhasoo(설화수=눈꽃빛 秀), Laneige(프랑스어 눈)
- 두문자/약어: MAC, NYX, AHC(Aesthetic Hydration Cosmetics), NARS, SK-II
- 숫자/코드: 23yearsold, AGE20's, No7, Chanel N°5
- 추상적 전환 사례: "덜어냄"→비움→공(空)→고요→"한율(한가위의 율동)", "순수"→이슬→새벽→"설화(雪花)", "빛남"→광채→달빛→"달빛뜰"

위 브랜드들이 사용한 네이밍 기법(언어유희, 외국어 차용, 한자 뜻 조합, 자연 은유, 개념 압축)을 구조적으로 참고하세요.

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
${position.id === 'kbeauty' ? '7. 반드시 순수 한글 이름으로 생성 (예: 설화수, 아리따움, 한율, 달빛뜰)\n8. 한글 이름의 경우 pronunciation 필드에 영문 로마자 표기를 넣으세요 (예: "Sulwhasoo", "Aritaum", "Hanyul")' : ''}

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

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

export async function strengthenName({ name, story, patternName, apiKey }) {
  const genAI = getGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}
