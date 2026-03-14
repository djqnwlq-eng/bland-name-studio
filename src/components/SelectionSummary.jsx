export default function SelectionSummary({ position, pattern, inputs, syllable, tone, step }) {
  const items = [];

  if (position) {
    items.push({ label: '\uD3EC\uC9C0\uC154\uB2DD', value: position.name });
  }
  if (pattern && step > 2) {
    items.push({ label: '\uD328\uD134', value: `${pattern.num} ${pattern.name}` });
  }
  if (inputs && step > 3) {
    pattern?.questions.forEach((q) => {
      if (inputs[q.key]?.trim()) {
        items.push({ label: q.label, value: inputs[q.key] });
      }
    });
  }
  if (step > 4) {
    items.push({ label: '\uC74C\uC808', value: syllable === 0 ? 'AI \uACB0\uC815' : `${syllable}\uC74C\uC808` });
    items.push({ label: '\uBC1C\uC74C', value: tone });
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
