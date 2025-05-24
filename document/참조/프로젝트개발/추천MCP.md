## \[개요]

* **문서명**: Next.js용 추천 MCP 및 자동화 도구 목록
* **작성일**: 2025-05-19
* **작성자**: 송영근
* **내용**: Next.js 프로젝트에서 사용할 수 있는 유용한 MCP(GitHub 기반 템플릿, 설정, 자동화 도구 포함) 모듈을 소개하고 그 목적과 사용법을 설명함.

---
Next.js 프로젝트에서 MCP(Machine-Curated Prompt / Model Configuration Prompt 또는 AI 도구 모듈 세트)를 등록하거나 활용하려는 목적이 \*\*"자동화된 개발, 문서화, 디자인 구성 또는 API 연동 등의 생산성 향상"\*\*이라면 다음과 같은 MCP 또는 GitHub 기반 도구를 추천할 수 있어.

---

## \[개요]

* **문서명**: Next.js용 추천 MCP 및 자동화 도구 목록
* **작성일**: 2025-05-19
* **작성자**: 송영근
* **내용**: Next.js 프로젝트에서 사용할 수 있는 유용한 MCP(GitHub 기반 템플릿, 설정, 자동화 도구 포함) 모듈을 소개하고 그 목적과 사용법을 설명함.

---
1. @smithery/toolbox

@smithery/toolbox란?
Smithery는 Context7의 기반이 되는 오픈소스 개발 도구 플랫폼입니다.
@smithery/toolbox는 Smithery에서 제공하는 핵심 유틸리티 함수, API, 도구 모음을 담고 있는 패키지입니다.
Context7, Smithery MCP(모델 컨텍스트 프로토콜) 등과 연동하거나, 자체적으로 개발 자동화, 코드 생성, 문서화 등에 활용할 수 있습니다.

주요 특징
Smithery/Context7과의 연동
Context7에서 외부 도구(MCP 등)를 호출하거나, 개발 환경 자동화, 문서화, 코드 생성 등 다양한 기능을 사용할 때 내부적으로 @smithery/toolbox를 활용합니다.
유틸리티 함수 제공
파일 시스템, 네트워크, 코드 파싱, 명령 실행 등 개발에 필요한 다양한 유틸리티를 제공합니다.
플러그인/확장 개발에 필수
Smithery/Context7용 플러그인, 확장, 커스텀 MCP 서버 등을 개발할 때 필수적으로 사용됩니다.


2. @smithery/context7

예시
“React에서 라우팅은 어떻게 하나요?”
→ Context7이 React와 관련된 공식 문서, 예시, 가이드 등을 자동으로 찾아줍니다.

“use context7”를 명시적으로 쓰는 경우
만약 특정 라이브러리/도구의 문서만 보고 싶을 때
예: “use context7: react-router에서 동적 라우팅 예시 보여줘”
→ 이렇게 쓰면 Context7이 react-router에 집중해서 자료를 찾아줍니다.






## \[1] 추천 MCP / 자동화 도구

| MCP 이름                    | 설명                                                            | GitHub 위치 / 설치                                                                             | 비고                  |
| ------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------- |
| **next-starter-mcp**      | Next.js 기본 프로젝트 자동 생성 (타입스크립트, Tailwind, ESLint, Prettier 포함) | `https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss`                  | Vercel 공식 예시        |
| **next-ai-docs**          | AI 기반 문서화 자동화 도구, 문서 자동 생성                                    | `https://github.com/BuilderIO/ai-docs`                                                     | Builder.io에서 제공     |
| **next-api-auto-gen**     | OpenAPI 기반 API 문서 자동 생성                                       | `https://github.com/kogai/next-api-docs`                                                   | 자동화된 Swagger 문서 포함  |
| **next-auth-mcp**         | 인증 관련 설정 자동화 (OAuth, JWT 등)                                   | `https://github.com/nextauthjs/next-auth`                                                  | 인증 자동화 템플릿          |
| **nextjs-mcp-ai-cursor**  | Cursor + GitHub Copilot과 연동 가능한 AI 워크플로 MCP 구성                | 커스텀 제작 필요 (예: `.cursor`, `.prompt.yaml`)                                                   | 너처럼 커서 사용하는 사람에게 유용 |
| **nextjs-form-generator** | Form 자동 생성 MCP (Zod + React Hook Form 기반)                     | `https://github.com/react-hook-form/react-hook-form` + `https://github.com/colinhacks/zod` | Schema 기반 자동 생성 가능  |
| **vercel-ai-sdk**         | OpenAI 기반 AI 앱 개발용 Next.js MCP                                | `https://github.com/vercel/ai`                                                             | 최신 AI API 연동에 최적화   |

---

## \[2] 추천 설치 방법 (예시: Tailwind MCP)

```bash
npx create-next-app@latest my-app -e with-tailwindcss
cd my-app
npm run dev
```

---

## \[3] 커서용 MCP 설정 예시 (.cursor/config.json)

```json
{
  "projectType": "nextjs",
  "mcp": [
    "tailwindcss",
    "eslint-prettier",
    "openai-integration",
    "auto-form-generator"
  ]
}
```

> 위와 같이 커서(Cursor)에 `.cursor/config.json` 파일로 MCP 역할의 설정을 지정하면 자동화된 세팅, 컴포넌트 스캐폴딩, 문서화 등을 빠르게 사용할 수 있어.

---

## \[4] 사용자별 추천 전략

* **디자인 중심**: `with-shadcn`, `with-tailwind`, `figma-to-react`
* **API 중심**: `next-api-routes`, `openapi-next`, `vercel-ai`
* **AI 연동**: `vercel/ai`, `Builder.io/ai-docs`, `LangChain.js + Next`
* **DevOps 연동**: `turbo`, `nx`, `monorepo-ready` MCP

---

원하는 MCP를 바로 `.cursor`, GitHub, 또는 `create-next-app` 커맨드로 연결할 수 있도록 `.yaml` 기반 템플릿도 제공 가능해.
필요하면 **Next.js 자동화 프로젝트 템플릿 전체 구조**도 만들어줄게.

추가로 “팀 협업용 MCP”, “B2B 웹앱 MCP”, “Fast MVP MCP” 등 목적별로도 정리해줄 수 있어.
필요한 유형 있으면 말해줘.

## \[1] 추천 MCP / 자동화 도구

| MCP 이름                    | 설명                                                            | GitHub 위치 / 설치                                                                             | 비고                  |
| ------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------- |
| **next-starter-mcp**      | Next.js 기본 프로젝트 자동 생성 (타입스크립트, Tailwind, ESLint, Prettier 포함) | `https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss`                  | Vercel 공식 예시        |
| **next-ai-docs**          | AI 기반 문서화 자동화 도구, 문서 자동 생성                                    | `https://github.com/BuilderIO/ai-docs`                                                     | Builder.io에서 제공     |
| **next-api-auto-gen**     | OpenAPI 기반 API 문서 자동 생성                                       | `https://github.com/kogai/next-api-docs`                                                   | 자동화된 Swagger 문서 포함  |
| **next-auth-mcp**         | 인증 관련 설정 자동화 (OAuth, JWT 등)                                   | `https://github.com/nextauthjs/next-auth`                                                  | 인증 자동화 템플릿          |
| **nextjs-mcp-ai-cursor**  | Cursor + GitHub Copilot과 연동 가능한 AI 워크플로 MCP 구성                | 커스텀 제작 필요 (예: `.cursor`, `.prompt.yaml`)                                                   | 너처럼 커서 사용하는 사람에게 유용 |
| **nextjs-form-generator** | Form 자동 생성 MCP (Zod + React Hook Form 기반)                     | `https://github.com/react-hook-form/react-hook-form` + `https://github.com/colinhacks/zod` | Schema 기반 자동 생성 가능  |
| **vercel-ai-sdk**         | OpenAI 기반 AI 앱 개발용 Next.js MCP                                | `https://github.com/vercel/ai`                                                             | 최신 AI API 연동에 최적화   |

---

## \[2] 추천 설치 방법 (예시: Tailwind MCP)

```bash
npx create-next-app@latest my-app -e with-tailwindcss
cd my-app
npm run dev
```

---

## \[3] 커서용 MCP 설정 예시 (.cursor/config.json)

```json
{
  "projectType": "nextjs",
  "mcp": [
    "tailwindcss",
    "eslint-prettier",
    "openai-integration",
    "auto-form-generator"
  ]
}
```

> 위와 같이 커서(Cursor)에 `.cursor/config.json` 파일로 MCP 역할의 설정을 지정하면 자동화된 세팅, 컴포넌트 스캐폴딩, 문서화 등을 빠르게 사용할 수 있어.

---

## \[4] 사용자별 추천 전략

* **디자인 중심**: `with-shadcn`, `with-tailwind`, `figma-to-react`
* **API 중심**: `next-api-routes`, `openapi-next`, `vercel-ai`
* **AI 연동**: `vercel/ai`, `Builder.io/ai-docs`, `LangChain.js + Next`
* **DevOps 연동**: `turbo`, `nx`, `monorepo-ready` MCP

---

원하는 MCP를 바로 `.cursor`, GitHub, 또는 `create-next-app` 커맨드로 연결할 수 있도록 `.yaml` 기반 템플릿도 제공 가능해.
필요하면 **Next.js 자동화 프로젝트 템플릿 전체 구조**도 만들어줄게.

추가로 “팀 협업용 MCP”, “B2B 웹앱 MCP”, “Fast MVP MCP” 등 목적별로도 정리해줄 수 있어.
필요한 유형 있으면 말해줘.
