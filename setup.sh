#!/bin/bash
echo "▶ Node.js 버전 적용 중..."

if command -v nvm > /dev/null; then
  echo "▶ nvm 설치됨. .nvmrc 기반으로 Node.js 설정"
  nvm install
  nvm use
else
  echo "❌ nvm이 설치되지 않았습니다. 설치 후 다시 실행하세요."
fi

echo "▶ 패키지 설치 중..."
npm install

echo "▶ .env 파일 생성 중..."
cp .env.example .env 2>/dev/null || echo ".env.example이 없습니다."

echo "✅ hybe 개발환경 설정 완료"
