# 문서명: RFID_정의서.md
- 작성일: 2025-05-23
- 작성자: 송영근
- 내  용: 자산관리 시스템에서 RFID 태그 기반 자산 식별 및 이동 자동 감지를 단계별로 구성하고 등록, 관리, 연동 구조까지 포함한 업무 정의서

---

## [1. 정의]

RFID(Radio Frequency Identification)는 무선 주파수를 이용하여  
자산에 부착된 고유 식별 태그를 인식하고, **자동 등록, 위치 감지, 이동 기록** 등을  
수작업 없이 자동으로 처리할 수 있도록 하는 장치 기반 식별 체계이다.

---

## [2. RFID 등록 절차]

```txt
① 자산 등록 준비  
→ ② RFID Tag 실물 부착  
→ ③ 등록 화면에서 RFID 태그 스캔  
→ ④ 고유 ID 자동 수신 및 자산에 연결  
→ ⑤ ZFI_ASSET_MASTER.rfidTagId 저장
````

* RFID는 자산 1개당 1개의 고유 태그와 연결됨
* 중복 등록 불가, 삭제 불가 (재발급 시 히스토리 필요)

---

## \[3. 시스템 관리 항목]

| 항목         | 설명                                 |
| ---------- | ---------------------------------- |
| rfidTagId  | RFID 태그 고유 ID                      |
| rfidType   | 태그 종류 (UHF, NFC 등)                 |
| registerAt | 등록 일시                              |
| assetId    | 연결된 자산 ID (`ZFI_ASSET_MASTER.id`)  |
| status     | 활성화 여부 (ACTIVE / LOST / DAMAGED 등) |

---

## \[4. RFID 이동 감지 흐름]

```txt
[자산 → RFID 리더기 통과]
 → [ZFI_ASSET_POSITION_LOG 생성]
 → [자산 상태 자동 갱신 or 이동 기록 생성]
 → [ZFI_ASSET_LOG 통합 기록]
```

* 리더기 위치는 시스템에 위치코드로 등록됨
* BLE, GPS 기반 감지와 연동 가능

---

## \[5. 연동 테이블 구조 요약]

| 테이블                      | 역할              |
| ------------------------ | --------------- |
| `ZCM_RFID_TAG`           | RFID 태그 마스터 테이블 |
| `ZFI_ASSET_MASTER`       | 자산 등록 시 RFID 연결 |
| `ZFI_ASSET_POSITION_LOG` | 리더기 통과 기록 자동 생성 |
| `ZFI_ASSET_LOG`          | 자산 이력 통합 기록 테이블 |

---

## \[6. RFID 연동 예시 흐름]

### ▶ 자산 등록 시

* 태그 ID 스캔 → `ZCM_RFID_TAG`에 등록
* `ZFI_ASSET_MASTER.rfidTagId`에 연결

### ▶ 이동 자동 감지

* 게이트 통과 → `ZFI_ASSET_POSITION_LOG` 자동 생성
* → `ZFI_ASSET_LOG`에도 MOVE 로그 기록
* → 자산 상태 자동 갱신 가능 (예: `RENTED`)

---

## \[7. UI 연동 지점]

* 자산 등록 화면: RFID 스캔 입력창 포함
* 자산 목록 화면: RFID 검색 필터
* 자산 상세 팝업: RFID 정보 표시
* 자산 이동 이력 화면: RFID 통과 자동 로그 포함

---

## \[8. 관리 기준]

* RFID는 이력 추적을 위해 삭제 금지 (비활성 처리만 가능)
* Tag 교체 시 이전 태그와 연계 이력 남겨야 함
* 중복 등록 방지를 위해 RFID ID는 시스템 전체에서 유일해야 함

---

## \[9. 확장 고려 사항]

* RFID + BLE 혼합 트래킹 연동
* RFID 실시간 위치 맵핑 UI 연계 (게이트 기준 위치 라벨 표시)
* 재고 실사 시 대량 스캔 지원 (리더기 일괄 태깅)
* `ZFI_RFID_SCAN_SESSION` 테이블로 실시간 스캔 기록 및 사용자 기록 구분

---
