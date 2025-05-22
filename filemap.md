# 파일 구조 및 페이지 목록

## 1. API 엔드포인트 목록

| 구분 | 경로 | 설명 |
|------|------|------|
| 메인 API | pages/api/index.tsx | API 메인 페이지 |
| 대여 API | pages/api/rentals.ts | 대여 관련 API |
| 자산 API | pages/api/assets.ts | 자산 관련 API |
| 사용자 API | pages/api/users.ts | 사용자 관련 API |
| 자재이력 통계 | src/pages/api/material-history/stats.ts | 자재 이력 통계 API |
| 최근 자재이력 | src/pages/api/material-history/recent.ts | 최근 자재 이력 API |

## 2. 주요 페이지 목록 (app directory 기반)

| 구분 | 경로 | 설명 |
|------|------|------|
| 관리자 메인 | src/app/(admin)/page.tsx | 관리자 대시보드 |
| 일정 관리 | src/app/(admin)/calendar/page.tsx | 일정 관리 페이지 |
| 자산 이동 | src/app/(admin)/asset-movement/page.tsx | 자산 이동 관리 |
| 알림 | src/app/(admin)/notifications/page.tsx | 알림 목록 |
| 알림 설정 | src/app/(admin)/notifications/settings/page.tsx | 알림 설정 |
| 반납 이력 | src/app/(admin)/return-history/page.tsx | 반납 이력 관리 |
| 알림 목록 | src/app/alerts/page.tsx | 알림 목록 페이지 |
| 알림 상세 | src/app/alerts/[id]/page.tsx | 알림 상세 보기 |
| 알림 설정 | src/app/alerts/settings/page.tsx | 알림 설정 페이지 |
| 회원가입 | src/app/(full-width-pages)/(auth)/signup/page.tsx | 회원가입 페이지 |
| 로그인 | src/app/(full-width-pages)/(auth)/signin/page.tsx | 로그인 페이지 |
| 404 에러 | src/app/(full-width-pages)/(error-pages)/error-404/page.tsx | 404 에러 페이지 |

## 3. 모바일 페이지

| 구분 | 경로 | 설명 |
|------|------|------|
| 모바일 대여 | src/app/(mobile)/rental/ | 모바일 대여 페이지 |
| 모바일 로그인 | src/app/(mobile)/login/ | 모바일 로그인 페이지 |

## 4. 기타 관리자 페이지

| 구분 | 경로 | 설명 |
|------|------|------|
| 마스터데이터 | src/app/(admin)/(others-pages)/masterdata/ | 마스터데이터 관리 |
| 자재 관리 | src/app/(admin)/(others-pages)/materials/ | 자재 관리 |
| 일정 관리 | src/app/(admin)/(others-pages)/calendar/ | 일정 관리 |
| 알림 관리 | src/app/(admin)/(others-pages)/notifications/ | 알림 관리 |
| 자재 이력 | src/app/(admin)/(others-pages)/material-history/ | 자재 이력 관리 |
| RFID 관리 | src/app/(admin)/(others-pages)/rfid/ | RFID 관리 |
| 대여 관리 | src/app/(admin)/(others-pages)/rental-management/ | 대여 관리 |
| 사용자 관리 | src/app/(admin)/(others-pages)/users/ | 사용자 관리 |
| 프로필 | src/app/(admin)/(others-pages)/profile/ | 프로필 관리 |
| 빈 페이지 | src/app/(admin)/(others-pages)/blank/ | 빈 페이지 |
| 자산 유형 | src/app/(admin)/(others-pages)/asset-types/ | 자산 유형 관리 |
| 테이블 | src/app/(admin)/(others-pages)/(tables)/ | 테이블 컴포넌트 |
| 폼 | src/app/(admin)/(others-pages)/(forms)/ | 폼 컴포넌트 |
| 차트 | src/app/(admin)/(others-pages)/(chart)/ | 차트 컴포넌트 |

> 각 디렉토리 내 상세 파일은 필요시 추가로 정리할 수 있습니다.