# setup-dev.ps1
Write-Host "=== Node.js 버전 확인 ==="
$nodeVersion = node -v
Write-Host "현재 Node.js 버전: $nodeVersion"
if ($nodeVersion -ne "v22.15.0") {
    Write-Host "⚠️  Node.js 22.15.0 버전이 아닙니다. nvm-windows로 버전 변경을 권장합니다."
}

Write-Host "=== 패키지 설치 ==="
npm install

Write-Host "=== .env 파일 복사 ==="
if (!(Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host ".env 파일이 생성되었습니다."
    } else {
        Write-Host ".env.example 파일이 없습니다. 직접 생성해 주세요."
    }
} else {
    Write-Host ".env 파일이 이미 존재합니다."
}

Write-Host "=== mock 데이터 및 API 라우트 확인 ==="
if (!(Test-Path "mock")) {
    New-Item -ItemType Directory -Path "mock"
    Write-Host "mock 폴더가 생성되었습니다."
}
if (!(Test-Path "mock\users.json")) {
    Set-Content "mock\users.json" '[{ "id": 1, "name": "김지수", "role": "asset_manager", "department": "무대지원팀" },{ "id": 2, "name": "박민호", "role": "staff", "department": "의상팀" }]'
}
if (!(Test-Path "mock\assets.json")) {
    Set-Content "mock\assets.json" '[{ "id": 101, "assetName": "LED 무대조명 A-12", "assetType": "stage_equipment", "location": "서울본사 창고", "status": "available" },{ "id": 102, "assetName": "블랙 정장 세트 1", "assetType": "costume", "location": "부산 의상보관소", "status": "in_use" }]'
}
if (!(Test-Path "mock\rentals.json")) {
    Set-Content "mock\rentals.json" '[{ "id": 1001, "userId": 1, "assetId": 101, "rentalDate": "2025-05-15", "returnDate": "2025-05-20", "purpose": "5월 콘서트 서울공연" },{ "id": 1002, "userId": 2, "assetId": 102, "rentalDate": "2025-05-10", "returnDate": null, "purpose": "뮤직비디오 촬영" }]'
}

Write-Host "=== 개발 서버 실행 ==="
Write-Host "아래 명령어로 개발 서버를 실행하세요:"
Write-Host "npm run dev"