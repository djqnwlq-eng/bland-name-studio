export default function SelectionSummary({ coreValue, feeling, position, step }) {
  const items = [];

  if (coreValue && step > 1) {
    const display = coreValue.length > 30 ? coreValue.slice(0, 30) + '...' : coreValue;
    items.push({ label: '핵심가치', value: display });
  }
  if (feeling && step > 2) {
    const display = feeling.length > 30 ? feeling.slice(0, 30) + '...' : feeling;
    items.push({ label: '소비자 느낌', value: display });
  }
  if (position && step > 3) {
    items.push({ label: '포지셔닝', value: position.name });
  }

  if (items.length === 0) return null;

  return (
    <div className="selection-summary">
      {items.map((item, i) => (
        <span key={i} className="summary-chip">
          <span className="summary-label">{item.label}</span>
          <span className="summary-value">{item.value}</span>
        </span>
      ))}
    </div>
  );
}
