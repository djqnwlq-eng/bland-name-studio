import { useState } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import Step1Position from './components/Step1Position';
import Step2Pattern from './components/Step2Pattern';
import Step3Input from './components/Step3Input';
import Step4Sound from './components/Step4Sound';
import Step5Result from './components/Step5Result';

export default function App() {
  const [step, setStep] = useState(1);
  const [position, setPosition] = useState(null);
  const [pattern, setPattern] = useState(null);
  const [inputs, setInputs] = useState({});
  const [syllable, setSyllable] = useState(0);
  const [tone, setTone] = useState('부드럽게');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const apiKeyMissing =
    !import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_GEMINI_API_KEY === 'your_gemini_api_key_here';

  function goTo(s) {
    setError(null);
    setStep(s);
  }

  return (
    <div className="app">
      <Header step={step} />
      <ProgressBar step={step} />

      {apiKeyMissing && (
        <div className="api-warning">
          환경변수 <code>VITE_GEMINI_API_KEY</code>를 설정해주세요.
          <br />
          <span>.env 파일에 Gemini API 키를 입력한 뒤 서버를 재시작하세요.</span>
        </div>
      )}

      <main className="main">
        {step === 1 && (
          <Step1Position
            selected={position}
            onSelect={(p) => {
              setPosition(p);
              goTo(2);
            }}
          />
        )}

        {step === 2 && (
          <Step2Pattern
            position={position}
            selected={pattern}
            onSelect={(p) => {
              setPattern(p);
              setInputs({});
              goTo(3);
            }}
            onBack={() => goTo(1)}
          />
        )}

        {step === 3 && (
          <Step3Input
            pattern={pattern}
            inputs={inputs}
            onChange={(key, val) => setInputs((prev) => ({ ...prev, [key]: val }))}
            onNext={() => goTo(4)}
            onBack={() => goTo(2)}
          />
        )}

        {step === 4 && (
          <Step4Sound
            syllable={syllable}
            tone={tone}
            onSyllableChange={setSyllable}
            onToneChange={setTone}
            onGenerate={() => goTo(5)}
            onBack={() => goTo(3)}
          />
        )}

        {step === 5 && (
          <Step5Result
            position={position}
            pattern={pattern}
            inputs={inputs}
            syllable={syllable}
            tone={tone}
            results={results}
            setResults={setResults}
            error={error}
            setError={setError}
            onGoToStep4={() => goTo(4)}
            onGoToStep2={() => goTo(2)}
          />
        )}
      </main>
    </div>
  );
}
