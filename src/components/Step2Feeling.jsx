export default function Step2Feeling({ value, onChange, onNext, onBack }) {
  return (
    <section className="step-section">
      <h2 className="step-title">소비자가 어떤 느낌을 받았으면 좋겠습니까?</h2>
      <p className="step-desc">
        원하는 느낌이나 감정 키워드를 입력해주세요.
      </p>

      <div className="input-group">
        <div className="field">
          <textarea
            className="field-input field-textarea"
            placeholder="예: 보습, 청량감, 맑음, 신뢰감, 피부가 숨쉬는 느낌"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>

      <div className="nav-row">
        <button className="btn-back" onClick={onBack}>
          &larr; 이전
        </button>
        <button className="btn-next" onClick={onNext} disabled={!value.trim()}>
          다음 &rarr;
        </button>
      </div>
    </section>
  );
}
