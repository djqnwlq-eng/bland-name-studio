import patterns from '../data/patterns';

export default function Step2Pattern({ position, selected, onSelect, onBack }) {
  const recommended = position?.recommendPatterns || [];

  return (
    <section className="step-section">
      <h2 className="step-title">네이밍 패턴을 선택하세요</h2>
      <p className="step-desc">7가지 패턴 중 하나를 선택하세요. 추천 패턴에는 표시가 있습니다.</p>

      <div className="card-grid patterns">
        {patterns.map((pat) => {
          const isRec = recommended.includes(pat.id);
          return (
            <button
              key={pat.id}
              className={`card selectable ${selected?.id === pat.id ? 'selected' : ''}`}
              onClick={() => onSelect(pat)}
            >
              {isRec && <span className="badge recommend">추천</span>}
              <span className="pattern-num">{pat.num}</span>
              <h3 className="card-name">{pat.name}</h3>
              <p className="card-examples">{pat.examples}</p>
            </button>
          );
        })}
      </div>

      <div className="nav-row">
        <button className="btn-back" onClick={onBack}>
          &larr; 이전
        </button>
      </div>
    </section>
  );
}
