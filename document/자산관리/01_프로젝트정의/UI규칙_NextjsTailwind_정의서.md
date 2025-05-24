# 문서명: UI규칙_NextjsTailwind_정의서.md  
- 작성일: 2025-05-23  
- 작성자: 송영근  
- 내  용: 자산관리 시스템에서 Next.js 및 TailwindCSS 기반으로 프론트엔드를 개발할 때 적용되는 UI 컴포넌트 구조, 스타일링 방식, 코드 설계 규칙을 정의한 문서

---

## [1. 기술 스택 기준]

| 항목 | 사용 기술 |
|------|------------|
| 프레임워크 | Next.js (App Router 기준) |
| 스타일 | TailwindCSS |
| UI 라이브러리 | shadcn/ui, lucide-react |
| 차트 | recharts |
| 아이콘 | lucide-react |
| 반응형 | Tailwind + Grid 기반 반응형 (모바일 대응)

---

## [2. UI 개발 구조]

### ▸ 화면 개발 디렉토리 구조

```

/app
/asset/list/page.tsx        ← 자산 목록 화면
/asset/register/page.tsx    ← 자산 등록 화면
/components
/asset/AssetCard.tsx        ← 자산 카드 컴포넌트
/form/TextInput.tsx         ← 공통 입력 컴포넌트

````

---

## [3. Tailwind 스타일링 규칙]

| 항목 | 규칙 |
|------|------|
| 기본 배경 | `bg-white` 사용 고정 |
| 컨테이너 | `p-6`, `rounded-lg`, `shadow` 사용 |
| 버튼 | `px-4 py-2 border rounded text-sm bg-white` |
| 버튼 hover | `hover:bg-gray-100` |
| 테이블 헤더 | `bg-gray-50 text-gray-700 font-semibold` |
| 테이블 셀 | `text-gray-600` |
| 행 hover | `hover:bg-gray-50` |
| 제목 | `text-xl` |
| 서브텍스트 | `text-sm text-gray-500` |

---

## [4. UI 컴포넌트 기본 스타일 가이드]

- 버튼, 테이블, 카드, 입력폼은 모두 shadcn/ui 기준  
- 반응형은 Tailwind grid 또는 flex 기준  
- 컴포넌트 단위로 최대한 분리 (예: AssetTableRow, ApprovalStepCard)

---

## [5. 예시: 자산카드 UI (Tailwind 기준)]

```tsx
<div className='bg-white rounded-lg shadow p-6'>
  <h2 className='text-xl font-semibold'>{asset.name}</h2>
  <p className='text-gray-600'>{asset.assetType}</p>
</div>
````

---

## \[6. 예시: 버튼 UI 구성]

```tsx
<button className='px-4 py-2 border rounded text-sm bg-white hover:bg-gray-100'>
  새 자산 등록
</button>
```

---

## \[7. 디자인 일관성 원칙]

* 배경색 통일: `bg-white`
* 패딩: 모든 영역 최소 `p-4` 이상
* 테두리: `rounded-lg`, `border-gray-200`
* 그리드 레이아웃 우선 적용
* 컴포넌트 내부 스타일 분산 금지 (스타일은 클래스 기준으로 통일)

---

## \[8. 확장 고려 사항]

* 다국어 라벨 관리: `@/lib/i18n.ts` 등 통합
* 사용자 역할별 버튼 노출 제어: `roleGuard()` 구조
* DarkMode 대응은 필요 시 `dark:` 접두어로 확장 가능
* 컴포넌트 문서화 도구 (예: Storybook) 적용 가능성 고려

---

```

✅ 이제 테이블 설계를 시작하기 위한 **4가지 기준 정의서가 모두 완료**되었어:

1. 프로젝트규칙  
2. 프로그램규칙  
3. 코딩규칙  
4. UI규칙 (Next.js + Tailwind)
