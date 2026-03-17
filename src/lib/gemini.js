import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateNames({ position, pattern, inputs, syllable, tone }) {
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

[핵심 규칙]
1. 사용자가 입력한 키워드를 절대 그대로 쓰지 마세요. 반드시 추상적으로 확장하세요.
   - "덜어냄" → 비움, 공(空), 여백, 고요, 미니멀, 정제, 본질 등으로 연상을 넓힌 뒤 브랜드명 도출
   - "빛남" → 광채, 오로라, 달빛, 새벽, 이슬 등으로 연상을 넓힌 뒤 브랜드명 도출
2. "${pattern.name}" 패턴을 활용하되, 위 100개 브랜드의 구조(합성, 음운 변형, 은유적 전환)를 적용하세요.
3. 목표 음절: ${syllable === 0 ? '패턴에 최적화된 음절 AI 선택' : syllable + '음절'}
4. 발음 느낌: ${tone}
5. 포지셔닝: ${position.name} (${position.desc})
6. 이름은 반드시 발음 가능하고 기억에 남아야 함
7. 상표 등록 가능성 고려 (일반명사 단독 사용 금지)
${position.id === 'kbeauty' ? '8. 반드시 순수 한글 이름으로 생성 (예: 설화수, 아리따움, 한율, 달빛뜰)' : ''}

입력 재료 (이 키워드를 추상적으로 확장해서 활용하세요):
${pattern.questions.map((q) => `${q.label}: ${inputs[q.key] || '(미입력)'}`).join('\n')}

아래 JSON 형식으로 정확히 5개 생성. JSON 외 다른 텍스트 출력 금지:
{
  "names": [
    {
      "name": "브랜드이름",
      "pronunciation": "한글발음",
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

export async function strengthenName({ name, story, pattern, mode }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const modeMap = {
    sound: '음감과 두운·모음 반복으로 발음할 때 리듬감이 생기도록',
    meaning: '이름 안에 숨겨진 의미나 중의적 해석, 스토리텔링 요소를 강화하도록',
    visual: '타이포그래피·로고로 표현하기 좋고 시각적으로 강한 인상을 주도록',
  };

  const prompt = `화장품 브랜드 네이머입니다.
기존 이름을 ${modeMap[mode]} 변형하세요.
패턴: ${pattern.name}
원래 이름: ${name}
원래 스토리: ${story}

JSON만 출력:
{
  "name": "변형된이름",
  "pronunciation": "한글발음",
  "story": "변형된 배경 1줄",
  "reason": "변형 이유 1줄"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}
