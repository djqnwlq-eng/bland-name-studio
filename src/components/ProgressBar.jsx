const STEP_PERCENT = { 1: 25, 2: 50, 3: 75, 4: 100 };

export default function ProgressBar({ step }) {
  const pct = STEP_PERCENT[step] || 0;

  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
