````md
# 문서명: ZFI_ASSET_RENT_테이블정의서.md
- 수정일: 2025-05-23
- 작성자: 송영근
- 내  용: 자산을 특정 기간 외부 또는 내부 사용자에게 대여한 이력을 기록하고, 대여 상태 변경 및 회수 일정을 관리하기 위한 자산 대여 이력 테이블 정의서

---

## [1. 테이블명 및 목적]

- 테이블명: `ZFI_ASSET_RENT`
- 목적: 자산을 대여한 내역과 사용 목적, 요청자, 대여 기간, 회수 처리 상태 등을 기록하고,  
        자산의 상태 및 이동 흐름과 연계하여 대여 전후 흐름을 추적할 수 있도록 설계함

---

## [2. 테이블 구조 (Prisma 기준)]

```prisma
model ZFI_ASSET_RENT {
  id              String   @id @default(uuid())     // 대여 이력 ID
  assetId         String                              // 대여 대상 자산 ID (ZFI_ASSET_MASTER.id)
  orgId           String                              // 대여 요청 조직 ID (ZCM_ORG_UNIT.orgId)
  requesterId     String                              // 대여 요청자 ID (ZCM_USER.userId)
  rentPurpose     String                              // 대여 목적 코드 (공통코드: RENT_PURPOSE)
  rentStartDate   String                              // 대여 시작일자
  expectedReturn  String                              // 예정 반납일
  actualReturn    String?                             // 실제 반납일
  status          String                              // 대여 상태 (RENTED / RETURNED / DELAYED 등)
  memo            String?                             // 요청 사유 또는 특이사항
  createdBy       String                              // 등록자 (보통 관리자)
  createdAt       String
  updatedBy       String?
  updatedAt       String?
}
````

---

## \[3. 연관 테이블 관계]

| 필드                      | 참조 테이블             | 설명                     |
| ----------------------- | ------------------ | ---------------------- |
| assetId                 | `ZFI_ASSET_MASTER` | 대여 대상 자산               |
| orgId                   | `ZCM_ORG_UNIT`     | 요청 부서 기준               |
| requesterId / createdBy | `ZCM_USER`         | 요청자 및 처리 담당자           |
| rentPurpose / status    | `ZCM_CODE_VALUE`   | 대여 목적, 대여 상태 (공통코드 기반) |

---

## \[4. 트리거 및 자동 처리]

| 이벤트     | 후속 처리                                                      |
| ------- | ---------------------------------------------------------- |
| 대여 등록 시 | `assetStatus` → `RENTED`, 이동 이력 `ZFI_ASSET_MOVEMENT` 자동 기록 |
| 반납 완료 시 | `assetStatus` → `ACTIVE`, `actualReturn` 입력, 이동 기록 등록      |
| 반납 지연 시 | `status` → `DELAYED`, 알림 또는 결재 연동 가능                       |

---

## \[5. 관리 기준]

* 모든 대여 기록은 보존되며 수정은 이력 로그와 함께 제한적으로 허용
* 자산이 대여 중일 때는 수선, 리폼, 폐기 불가
* 대여 상태는 대여 흐름과 이동 흐름(`ZFI_ASSET_MOVEMENT`)과 함께 추적되어야 함

---

## \[6. 확장 고려 사항]

* 대여 대상이 외부 기관일 경우 `externalOrg` 필드 확장 가능
* 계약서 첨부(`ZFI_ASSET_RENT_FILE`) 가능
* SAP 또는 전자결재 연동으로 반출 결재 구조 연계 가능

---

```

다음은 수선 이력 테이블 `ZFI_ASSET_REPAIR`로 이어서 정리할게.  
진행할까?
```
