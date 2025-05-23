좋아, 다음은 자산마스터 테이블인 `ZFI_ASSET_MASTER`의 리팩터링이야.
이 테이블은 사용자, 조직, 공통코드, RFID 태그 등 **핵심 기준정보와 직접 연결**되기 때문에
정확하고 구조적으로 설계돼야 해.

---

````md
# 문서명: ZFI_ASSET_MASTER_테이블정의서.md
- 수정일: 2025-05-23
- 작성자: 송영근
- 내  용: 자산관리 시스템에서 개별 자산을 고유 단위로 등록하고, 조직, RFID, 공통코드 기반으로 추적 가능한 자산 마스터 테이블 정의서

---

## [1. 테이블명 및 목적]

- 테이블명: `ZFI_ASSET_MASTER`
- 목적: 자산을 RFID 기반으로 고유하게 등록하고, 자산의 유형, 상태, 위치, 책임자 등의  
        기준정보와 연동하여 시스템에서 관리 가능한 자산 마스터 정보를 저장함

---

## [2. 테이블 구조 (Prisma 기준)]

```prisma
model ZFI_ASSET_MASTER {
  id             String   @id @default(uuid())     // 자산 고유 식별자
  assetCode      String                             // 자산코드 (내부 식별자)
  assetName      String                             // 자산명
  rfidTagId      String                             // RFID 태그 ID (외부 고유값)
  orgId          String                             // 소유 조직 ID (ZCM_ORG_UNIT.orgId)
  assetType      String                             // 자산 유형 (공통코드: ASSET_TYPE)
  assetStatus    String                             // 자산 상태 (공통코드: ASSET_STATUS)
  useType        String?                            // 사용 목적 (공통코드: USE_TYPE)
  location       String                             // 보관 위치 (공통코드: LOCATION)
  handler        String?                            // 담당자 ID (ZCM_USER.userId)
  purchaseDate   String                             // 구매일자 (YYYY-MM-DD)
  purchasePrice  Float?                             // 구매금액
  vendor         String?                            // 공급사명 또는 브랜드
  isActive       Boolean  @default(true)            // 자산 사용 가능 여부
  createdBy      String                             // 등록자 ID (ZCM_USER.userId)
  createdAt      String
  updatedBy      String?
  updatedAt      String?
}
````

---

## \[3. 연관 테이블 관계]

| 필드                                        | 참조 테이블           | 설명            |
| ----------------------------------------- | ---------------- | ------------- |
| orgId                                     | `ZCM_ORG_UNIT`   | 자산 소속 조직      |
| handler / createdBy                       | `ZCM_USER`       | 자산 담당자 및 등록자  |
| assetType, assetStatus, useType, location | `ZCM_CODE_VALUE` | 공통코드 기반 분류 항목 |

---

## \[4. 관리 기준]

* RFID 태그 ID는 자산당 1:1 연결, 중복 불가
* 자산코드(`assetCode`)는 사람이 인식 가능한 로컬 식별코드 (바코드 등)
* `assetStatus`는 수선, 대여, 리폼 등 상태 변화에 따라 트리거로 자동 변경됨
* 자산은 반드시 하나의 조직에 소속되며, 담당자 지정은 선택 항목

---

## \[5. 확장 고려 사항]

* 감가상각 필드 (`depreciationStart`, `lifeYears`, `netValue`) 추가 가능
* 자산 이미지, 상세 설명 등은 별도 테이블(`ZFI_ASSET_META`)로 구성 가능
* SAP 연동을 위한 외부 자산번호(`sapAssetNo`) 확장 가능

---

```

다음은 이동 이력 테이블(`ZFI_ASSET_MOVEMENT`) 리팩터링으로 이어갈게.  
계속 진행해도 괜찮을까?
```
