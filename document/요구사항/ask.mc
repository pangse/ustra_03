현재 모든 임시 데이타를 

## 📄 `커서 작업 지침서`: Next.js용 Mock Data 자동 구성

### \[요구사항 개요]

```
프로젝트 이름: hybe
기술스택: Next.js + TypeScript
목표: mock 데이터 디렉토리 구성 및 API 라우트 연동 자동화
```

---

### \[Cursor에게 줄 명령]

```markdown
# Cursor 작업 지시서

1. 다음 구조를 생성해주세요:

```
prisma/schema.prisma 를 참조해서  다음과 같이 구성해죠. 

mock/
├── users.json
├── assets.json
└── rentals.json

pages/api/
├── users.ts
├── assets.ts
└── rentals.ts

````

2. 각 JSON 파일에는 엔터테이먼스에서 자산을 관리(등록,수정,삭제)하고 자산대여, 수선 등 모든 페이지에서 임시로 사용된 mook data를 참조해서

모든 키 값이 연결이 되어야 해. 
예:
- `users.json` → id, name, role
- `assets.json` → id, assetName, assetType
- `rentals.json` → id, userId, assetId, rentalDate

3. `pages/api/*.ts`에서 각각 해당 JSON 파일을 import해서 다음과 같은 API 핸들러를 구성해주세요.

```ts
// 예시: pages/api/users.ts
import users from '../../mock/users.json';

export default function handler(req, res) {
  res.status(200).json(users);
}
````

4. API 테스트용 가이드 파일도 하나 생성해주세요:

파일명: `API_TEST_GUIDE.md`

내용:

```md
# API 테스트 가이드

- GET /api/users → mock 사용자 목록 응답
- GET /api/assets → mock 자산 목록 응답
- GET /api/rentals → mock 대여 이력 목록 응답

```

종합적으로 json 데이터를 curd 할수 있는 페이지도 하나 생성해죠. 

---
