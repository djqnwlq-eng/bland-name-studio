import { useState } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import Step1CoreValue from './components/Step1CoreValue';
import Step2Feeling from './components/Step2Feeling';
import Step3Position from './components/Step3Position';
import Step4Result from './components/Step4Result';
import SelectionSummary from './components/SelectionSummary';

export default function App() {
  const [step, setStep] = useState(1);
  const [coreValue, setCoreValue] = useState('');
  const [feeling, setFeeling] = useState('');
  const [position, setPosition] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const apiKeyMissing =
    !import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_GEMINI_API_KEY === 'your_gemini_api_key_here';

  function goTo(s) {
    setError(null);
    setStep(s);
  }

  function handleReset() {
    setStep(1);
    setCoreValue('');
    setFeeling('');
    setPosition(null);
    setResults(null);
    setError(null);
  }

  return (
    <div className="app">
      <Header step={step} onReset={handleReset} />
      <ProgressBar step={step} />

      {apiKeyMissing && (
        <div className="api-warning">
          환경변수 <code>VITE_GEMINI_API_KEY</code>를 설정해주세요.
          <br />
          <span>.env 파일에 Gemini API 키를 입력한 뒤 서버를 재시작하세요.</span>
        </div>
      )}

      {step > 1 && (
        <SelectionSummary
          coreValue={coreValue}
          feeling={feeling}
          position={position}
          step={step}
        />
      )}

      <main className="main">
        {step === 1 && (
          <Step1CoreValue
            value={coreValue}
            onChange={setCoreValue}
            onNext={() => goTo(2)}
          />
        )}

        {step === 2 && (
          <Step2Feeling
            value={feeling}
            onChange={setFeeling}
            onNext={() => goTo(3)}
            onBack={() => goTo(1)}
          />
        )}

        {step === 3 && (
          <Step3Position
            selected={position}
            onSelect={(p) => {
              setPosition(p);
              goTo(4);
            }}
            onBack={() => goTo(2)}
          />
        )}

        {step === 4 && (
          <Step4Result
            position={position}
            coreValue={coreValue}
            feeling={feeling}
            results={results}
            setResults={setResults}
            error={error}
            setError={setError}
            onGoToStep3={() => goTo(3)}
            onGoToStep1={() => {
              setResults(null);
              goTo(1);
            }}
          />
        )}
      </main>
    </div>
  );
}
