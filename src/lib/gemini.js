import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateNames({ position, pattern, inputs, syllable, tone }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `당신은 전문 화장품 브랜드 네이머입니다.
100개 브랜드 분석 기반으로 "${pattern.name}" 패턴을 활용해 이름을 생성합니다.

규칙:
- 목표 음절: ${syllable === 0 ? '패턴에 최적화된 음절 AI 선택' : syllable + '음절'}
- 발음 느낌: ${tone}
- 포지셔닝: ${position.name} (${position.desc})
- 이름은 반드시 발음 가능하고 기억에 남아야 함
- 상표 등록 가능성 고려 (일반명사 단독 사용 금지)

입력 재료:
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
