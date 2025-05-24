````md
# 문서명: ZCM_RFID_TAG_테이블정의서.md
- 작성일: 2025-05-23
- 작성자: 송영근
- 내  용: 자산에 부착된 RFID 태그 정보를 마스터 형태로 관리하고, 자산 등록, 이동 감지, 위치 이력 자동 생성에 연계되는 RFID 태그 테이블 정의서

---

## [1. 테이블명 및 목적]

- 테이블명: `ZCM_RFID_TAG`
- 목적: 자산 식별에 사용되는 RFID 태그 정보를 관리하고,  
  각 자산에 1:1로 연결된 RFID 고유 ID와 상태, 연결 자산, 등록 시각 등을 기록하여  
  자동 이동 감지, 실시간 추적, 재발급 처리 등을 가능하게 함

---

## [2. 테이블 구조 (Prisma 기준)]

```prisma
model ZCM_RFID_TAG {
  id             String   @id @default(uuid())     // RFID 내부 ID
  rfidTagId      String                             // RFID 물리 태그 ID (고유값)
  assetId        String?                            // 연결된 자산 ID (ZFI_ASSET_MASTER.id)
  rfidType       String?                            // 태그 유형 (UHF / NFC / BLE 등)
  status         String                             // 태그 상태 (ACTIVE, INACTIVE, DAMAGED, LOST 등)
  locationCode   String?                            // 마지막 감지 위치 코드
  registerAt     String                             // 등록 시각
  deactivatedAt  String?                            // 비활성 처리 일시
  createdBy      String
  createdAt      String
  updatedBy      String?
  updatedAt      String?
}
````

---

## \[3. 연관 테이블 관계]

| 필드                | 참조 테이블                | 설명                                |
| ----------------- | --------------------- | --------------------------------- |
| assetId           | `ZFI_ASSET_MASTER.id` | 태그가 연결된 자산                        |
| rfidType / status | `ZCM_CODE_VALUE`      | 공통코드 그룹: RFID\_TYPE, RFID\_STATUS |
| locationCode      | `ZCM_LOCATION.code`   | RFID 태그 감지 위치 기준 (선택적 연동)         |

---

## \[4. 상태 코드 예시 (`status`)]

| 코드       | 설명            |
| -------- | ------------- |
| ACTIVE   | 정상 사용 중       |
| INACTIVE | 사용 중지 (논리 삭제) |
| DAMAGED  | 손상됨           |
| LOST     | 분실 상태 (추적 불가) |

---

## \[5. 관리 기준]

* 하나의 `rfidTagId`는 반드시 전역 유일해야 함
* 자산과 연결되면 `assetId`로 연결되며, 교체 시 이력 처리 필요
* 삭제는 불가하며 `status = INACTIVE`로 처리
* RFID Tag 재발급 시 반드시 `registerAt` 및 `deactivatedAt` 기록

---

## \[6. 활용 시나리오]

* 자산 등록 시 RFID 스캔 → 신규 등록 및 연결
* RFID 리더 통과 시 → 자동 이동 기록 생성
* 실시간 위치 확인 시 → 최근 감지된 `locationCode` 기준 표시
* 재고조사 시 → 미감지 RFID = 누락 또는 분실 자산 추정

---

## \[7. 확장 고려 사항]

* 스캔 이력 테이블: `ZFI_RFID_SCAN_LOG` 별도 구성 가능
* RFID Reader 정보 테이블(`ZCM_RFID_READER`) 연계
* RFID 감지 위치를 GPS로 변환하는 위치 매핑 구조 연동 가능
* BLE와 혼합되는 경우 `signalStrength`, `lastSeenAt` 필드 확장 가능

---

```

이제 RFID 기반 자산 등록 및 이동 추적을 위한 마스터 설계까지 완료된 상태야.  
필요하면 이어서 `RFID 리더기 마스터`, `스캔 이력 로그`, `실사 세션 테이블`까지 단계별로 진행할 수 있어.  
계속 진행할까?
```
