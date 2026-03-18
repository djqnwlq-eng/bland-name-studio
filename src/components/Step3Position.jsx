import positions from '../data/positions';

export default function Step3Position({ selected, onSelect, onBack }) {
  return (
    <section className="step-section">
      <h2 className="step-title">브랜드 포지셔닝을 선택하세요</h2>
      <p className="step-desc">브랜드가 지향하는 시장 포지션을 골라주세요.</p>

      <div className="card-grid">
        {positions.map((pos) => (
          <button
            key={pos.id}
            className={`card selectable ${selected?.id === pos.id ? 'selected' : ''}`}
            onClick={() => onSelect(pos)}
          >
            <h3 className="card-name">{pos.name}</h3>
            <p className="card-desc">{pos.desc}</p>
          </button>
        ))}
      </div>

      <div className="nav-row">
        <button className="btn-back" onClick={onBack}>
          &larr; 이전
        </button>
      </div>
    </section>
  );
}
