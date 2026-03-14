# Brand Naming Studio

화장품 브랜드 네이밍 웹앱 — 7가지 네이밍 패턴 기반 AI 브랜드 이름 생성기

## 실행 방법

1. 의존성 설치
   ```bash
   npm install
   ```

2. 환경변수 설정
   ```bash
   cp .env.example .env
   ```
   `.env` 파일을 열어 Gemini API 키를 입력합니다.

3. Gemini API 키 발급
   https://aistudio.google.com/apikey 에서 무료 발급 가능

4. 개발 서버 실행
   ```bash
   npm run dev
   ```

## 기술 스택

- React 18 + Vite
- Gemini API (gemini-2.0-flash)
- CSS (단일 파일)
