import { useState } from 'react';
import { strengthenName } from '../lib/gemini';

export default function NameCard({ item }) {
  const [strengthened, setStrengthened] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleStrengthen() {
    setLoading(true);
    try {
      const result = await strengthenName({
        name: item.name,
        story: item.story,
        patternName: item.pattern_used,
      });
      setStrengthened(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const riskMap = {
    '낮음': { cls: 'risk-low', icon: '\u2705', label: '상표위험 낮음' },
    '보통': { cls: 'risk-mid', icon: '\u26A0\uFE0F', label: '상표위험 보통' },
    '높음': { cls: 'risk-high', icon: '\uD83D\uDEA8', label: '상표위험 높음' },
  };
  const risk = riskMap[item.risk] || riskMap['보통'];

  return (
    <div className="name-card">
      <div className="name-card-badges">
        <span className="badge pattern-badge">{item.pattern_used}</span>
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
          disabled={loading}
          onClick={handleStrengthen}
        >
          {loading ? <span className="spinner-sm" /> : null} 브랜드명 강화
        </button>
      </div>

      {strengthened && strengthened.options && (
        <div className="strengthened-options">
          {strengthened.options.map((opt, i) => (
            <div key={i} className="strengthened-result">
              <p className="strengthened-name">{opt.name}</p>
              <p className="strengthened-pronunciation">{opt.pronunciation}</p>
              <p className="strengthened-story">{opt.story}</p>
              <p className="strengthened-reason">{opt.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
