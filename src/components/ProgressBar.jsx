const STEP_PERCENT = { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 };

export default function ProgressBar({ step }) {
  const pct = STEP_PERCENT[step] || 0;

  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
