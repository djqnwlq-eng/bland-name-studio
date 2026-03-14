export default function Header({ step }) {
  return (
    <header className="header">
      <h1 className="logo">Brand Naming Studio</h1>
      <span className="step-pill">STEP {step} / 5</span>
    </header>
  );
}
