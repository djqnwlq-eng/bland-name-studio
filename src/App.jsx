import { useState } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import Step1CoreValue from './components/Step1CoreValue';
import Step2Feeling from './components/Step2Feeling';
import Step3Position from './components/Step3Position';
import Step4Result from './components/Step4Result';
import SelectionSummary from './components/SelectionSummary';
import LandingPage from './components/LandingPage';

const STORAGE_KEY = 'gemini_api_key';

function getStoredKey() {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export default function App() {
  const [step, setStep] = useState(1);
  const [coreValue, setCoreValue] = useState('');
  const [feeling, setFeeling] = useState('');
  const [position, setPosition] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(getStoredKey);

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

  function handleStart(key) {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    handleReset();
  }

  if (!apiKey) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="app">
      <Header step={step} onReset={handleReset} onLogout={handleLogout} />
      <ProgressBar step={step} />

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
            apiKey={apiKey}
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
