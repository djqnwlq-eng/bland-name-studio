import { useState } from 'react';

export default function LandingPage({ onStart }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  function handleStart() {
    if (apiKey.trim()) {
      onStart(apiKey.trim());
    }
  }

  return (
    <div className="landing">
      <div className="landing-card">
        <h1 className="landing-title">Brand Naming Studio</h1>
        <p className="landing-subtitle">AI 기반 화장품 브랜드 네이밍 도구</p>

        <div className="landing-section">
          <label className="modal-label">Gemini API Key</label>
          <div className="api-input-row">
            <input
              type={showKey ? 'text' : 'password'}
              className="field-input"
              placeholder="AIza..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
            <button
              className="toggle-visibility"
              onClick={() => setShowKey(!showKey)}
              title={showKey ? '숨기기' : '보기'}
            >
              {showKey ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <button
            className="btn-start"
            onClick={handleStart}
            disabled={!apiKey.trim()}
          >
            시작하기
          </button>
        </div>

        <div className="api-guide">
          <button
            className="guide-toggle"
            onClick={() => setGuideOpen(!guideOpen)}
          >
            <span>API 키 발급 방법</span>
            <span className={`guide-arrow ${guideOpen ? 'open' : ''}`}>&#8963;</span>
          </button>

          {guideOpen && (
            <div className="guide-content">
              <h4>1. API 키 발급 (무료)</h4>
              <ol>
                <li>
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                    Google AI Studio
                  </a>{' '}
                  접속 후 구글 로그인
                </li>
                <li>"API 키 만들기" 버튼 클릭</li>
                <li>생성된 키를 복사하여 위 입력란에 붙여넣기</li>
              </ol>

              <hr />

              <h4>2. 유료 플랜 전환 (선택)</h4>
              <p className="guide-note">
                무료 플랜으로 브랜드 네이밍은 제약 없이 충분히 사용 가능합니다.
                <br />
                단, <strong>대량 생성</strong>은 무료 플랜의 요청 제한으로 인해{' '}
                <strong>유료 플랜을 권장</strong>합니다.
              </p>
              <ol>
                <li>
                  <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">
                    Google AI Studio
                  </a>{' '}
                  접속
                </li>
                <li>좌측 메뉴 "설정" &rarr; "결제" 클릭</li>
                <li>유료 플랜 활성화 후 결제 정보 입력</li>
              </ol>
            </div>
          )}
        </div>

        <p className="api-privacy">
          API 키는 브라우저에만 저장되며 서버로 전송되지 않습니다. (요청 시에만 사용)
        </p>
      </div>
    </div>
  );
}
