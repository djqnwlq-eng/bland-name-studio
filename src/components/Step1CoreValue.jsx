export default function Step1CoreValue({ value, onChange, onNext }) {
  return (
    <section className="step-section">
      <h2 className="step-title">당신의 화장품의 핵심가치는 무엇입니까?</h2>
      <p className="step-desc">
        브랜드가 추구하는 핵심 가치를 자유롭게 작성해주세요.
      </p>

      <div className="input-group">
        <div className="field">
          <textarea
            className="field-input field-textarea"
            placeholder="예: 문제성 피부를 근본적으로 해결하는 브랜드가 되고 싶습니다"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>

      <div className="nav-row">
        <span />
        <button className="btn-next" onClick={onNext} disabled={!value.trim()}>
          다음 &rarr;
        </button>
      </div>
    </section>
  );
}
