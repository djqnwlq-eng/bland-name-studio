export default function Step3Input({ pattern, inputs, onChange, onNext, onBack }) {
  const allFilled = pattern.questions.every((q) => inputs[q.key]?.trim());

  return (
    <section className="step-section">
      <h2 className="step-title">
        {pattern.num} {pattern.name}
      </h2>
      <p className="step-desc">패턴에 맞는 재료를 입력해주세요.</p>

      <div className="input-group">
        {pattern.questions.map((q) => (
          <div key={q.key} className="field">
            <label className="field-label">{q.label}</label>
            <input
              className="field-input"
              type="text"
              placeholder={q.hint}
              value={inputs[q.key] || ''}
              onChange={(e) => onChange(q.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="nav-row">
        <button className="btn-back" onClick={onBack}>
          &larr; 이전
        </button>
        <button className="btn-next" onClick={onNext} disabled={!allFilled}>
          다음 &rarr;
        </button>
      </div>
    </section>
  );
}
