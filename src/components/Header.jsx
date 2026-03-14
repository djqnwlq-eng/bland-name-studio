export default function Header({ step, onReset }) {
  return (
    <header className="header">
      <h1 className="logo" onClick={onReset} style={{ cursor: 'pointer' }}>
        Brand Naming Studio
      </h1>
      <span className="step-pill">STEP {step} / 5</span>
    </header>
  );
}
