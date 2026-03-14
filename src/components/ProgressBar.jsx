const STEP_PERCENT = { 1: 14, 2: 28, 3: 42, 4: 57, 5: 85 };

export default function ProgressBar({ step }) {
  const pct = STEP_PERCENT[step] || 0;

  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
