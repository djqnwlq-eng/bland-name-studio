const SYLLABLE_OPTIONS = [
  { value: 0, label: 'AI 결정', sub: '패턴에 최적화' },
  { value: 1, label: '1음절', sub: 'Dior \xb7 NARS' },
  { value: 2, label: '2음절', sub: 'Rare \xb7 Rhode' },
  { value: 3, label: '3음절', sub: 'Laneige \xb7 Klairs' },
];

const TONE_OPTIONS = ['부드럽게', '중립적으로', '강하게'];

export default function Step4Sound({
  syllable,
  tone,
  onSyllableChange,
  onToneChange,
  onGenerate,
  onBack,
}) {
  return (
    <section className="step-section">
      <h2 className="step-title">발음 설정</h2>
      <p className="step-desc">이름의 음절 수와 발음 느낌을 선택하세요.</p>

      <div className="sound-group">
        <h3 className="group-label">음절 수</h3>
        <div className="chip-row">
          {SYLLABLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`chip ${syllable === opt.value ? 'active' : ''}`}
              onClick={() => onSyllableChange(opt.value)}
            >
              <span className="chip-label">{opt.label}</span>
              <span className="chip-sub">{opt.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sound-group">
        <h3 className="group-label">발음 느낌</h3>
        <div className="chip-row">
          {TONE_OPTIONS.map((t) => (
            <button
              key={t}
              className={`chip ${tone === t ? 'active' : ''}`}
              onClick={() => onToneChange(t)}
            >
              <span className="chip-label">{t}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="nav-row">
        <button className="btn-back" onClick={onBack}>
          &larr; 이전
        </button>
        <button className="btn-next" onClick={onGenerate}>
          이름 생성하기
        </button>
      </div>
    </section>
  );
}
