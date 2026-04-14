import { useEffect, useState } from 'react';
import { generateNames } from '../lib/gemini';
import NameCard from './NameCard';

export default function Step4Result({
  position,
  coreValue,
  feeling,
  results,
  setResults,
  error,
  setError,
  apiKey,
  onGoToStep3,
  onGoToStep1,
}) {
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await generateNames({ position, coreValue, feeling, apiKey });
      setResults(data.names);
    } catch (err) {
      console.error(err);
      setError(`이름 생성에 실패했습니다. 다시 시도해주세요.\n(${err?.message ?? 'unknown error'})`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!results && !loading && !error) {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="step-section result-section">
      <h2 className="step-title">생성된 브랜드 이름</h2>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>AI가 브랜드 이름을 만들고 있습니다...</p>
        </div>
      )}

      {error && (
        <div className="error-box">
          <p>{error}</p>
          <button className="btn-next" onClick={generate}>
            다시 시도
          </button>
        </div>
      )}

      {results && (
        <>
          <div className="name-list">
            {results.map((item, i) => (
              <NameCard key={i} item={item} apiKey={apiKey} />
            ))}
          </div>

          <div className="result-actions">
            <button className="btn-back" onClick={onGoToStep1}>
              &larr; 처음부터 다시
            </button>
            <button className="btn-next" onClick={generate}>
              재생성
            </button>
            <button className="btn-back" onClick={onGoToStep3}>
              포지셔닝 변경
            </button>
          </div>
        </>
      )}
    </section>
  );
}
