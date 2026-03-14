import { useState } from 'react';
import { strengthenName } from '../lib/gemini';

export default function NameCard({ item, pattern }) {
  const [strengthened, setStrengthened] = useState(null);
  const [loading, setLoading] = useState(null); // 'sound' | 'meaning' | 'visual' | null

  async function handleStrengthen(mode) {
    setLoading(mode);
    try {
      const result = await strengthenName({
        name: item.name,
        story: item.story,
        pattern,
        mode,
      });
      setStrengthened(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  }

  const riskMap = {
    '낮음': { cls: 'risk-low', icon: '\u2705', label: '\uC0C1\uD45C\uC704\uD5D8 \uB0AE\uC74C' },
    '보통': { cls: 'risk-mid', icon: '\u26A0\uFE0F', label: '\uC0C1\uD45C\uC704\uD5D8 \uBCF4\uD1B5' },
    '높음': { cls: 'risk-high', icon: '\uD83D\uDEA8', label: '\uC0C1\uD45C\uC704\uD5D8 \uB192\uC74C' },
  };
  const risk = riskMap[item.risk] || riskMap['보통'];

  return (
    <div className="name-card">
      <div className="name-card-badges">
        <span className="badge pattern-badge">{pattern.name}</span>
        <span className={`badge ${risk.cls}`}>{risk.icon} {risk.label}</span>
      </div>

      <h3 className="name-card-name">{item.name}</h3>
      <p className="name-card-pronunciation">{item.pronunciation}</p>
      <p className="name-card-basis">{item.pattern_basis}</p>
      <p className="name-card-story">{item.story}</p>

      {item.risk === '높음' && (
        <p className="name-card-risk-reason">{item.risk_reason}</p>
      )}

      <div className="strengthen-row">
        <button
          className="strengthen-btn"
          disabled={loading !== null}
          onClick={() => handleStrengthen('sound')}
        >
          {loading === 'sound' ? <span className="spinner-sm" /> : '🔊'} 소리 강화
        </button>
        <button
          className="strengthen-btn"
          disabled={loading !== null}
          onClick={() => handleStrengthen('meaning')}
        >
          {loading === 'meaning' ? <span className="spinner-sm" /> : '💡'} 의미 강화
        </button>
        <button
          className="strengthen-btn"
          disabled={loading !== null}
          onClick={() => handleStrengthen('visual')}
        >
          {loading === 'visual' ? <span className="spinner-sm" /> : '👁'} 시각 강화
        </button>
      </div>

      {strengthened && (
        <div className="strengthened-result">
          <p className="strengthened-name">{strengthened.name}</p>
          <p className="strengthened-pronunciation">{strengthened.pronunciation}</p>
          <p className="strengthened-story">{strengthened.story}</p>
          <p className="strengthened-reason">{strengthened.reason}</p>
        </div>
      )}
    </div>
  );
}
