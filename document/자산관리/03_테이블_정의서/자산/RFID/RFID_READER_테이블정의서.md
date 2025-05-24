# 문서명: ZCM_RFID_READER_테이블정의서.md
- 작성일: 2025-05-23
- 작성자: 송영근
- 내  용: 자산관리 시스템에서 RFID 리더기의 고유 정보, 설치 위치, 장비 유형, 통신 상태, 확장 속성 등을 관리하고, RFID 태그 감지 이벤트 기록 및 연계 로그 기반 운영을 위한 테이블 정의서

---

## [1. 테이블명 및 목적]

- 테이블명: `ZCM_RFID_READER`
- 목적: 자산 위치 감지 및 이동 자동 기록의 기반이 되는 RFID 리더기 정보를 등록·관리하고,  
  설치 위치, 장비 유형, 통신 상태, 장비 사양을 저장하여  
  자산관리 시스템과의 연동 및 장애 감지, 실사, 이벤트 이력관리를 가능하게 한다.

---

## [2. 테이블 구조 (Prisma 기준)]

```prisma
model ZCM_RFID_READER {
  id               String   @id @default(uuid())       // 리더기 고유 ID
  readerCode       String                               // 리더기 코드 (인식용 식별자)
  readerName       String                               // 리더기 이름 또는 관리명
  readerType       String                               // FIXED / MOBILE / BLE
  locationCode     String?                              // 설치 위치 코드 (ZCM_LOCATION.code)
  ipAddress        String?                              // 네트워크 IP (고정형일 경우)
  firmwareVersion  String?                              // 펌웨어 버전
  modelName        String?                              // 장비 모델명
  manufacturer     String?                              // 제조사 정보
  installDate      String                               // 설치일자
  lastHeartbeat    String?                              // 마지막 통신 시각 (헬스 체크)
  isActive         Boolean  @default(true)              // 사용 여부
  createdBy        String
  createdAt        String
  updatedBy        String?
  updatedAt        String?
}
````

---

## \[3. 코드 그룹 연계 필드]

| 필드           | 코드 그룹         | 설명                         |
| ------------ | ------------- | -------------------------- |
| readerType   | `READER_TYPE` | FIXED, MOBILE, BLE\_BEACON |
| locationCode | `LOCATION`    | 사무실, 창고, 스튜디오 등 지정 구역 코드   |

---

## \[4. 관리 기준]

* `readerCode`는 전역 고유해야 하며 RFID 이벤트 송신 시 기준이 됨
* BLE 장비는 `RSSI`, `BLE_ZONE`과 연계 가능
* `isActive = false`일 경우 감지 무시
* `lastHeartbeat`를 통해 통신 정상 여부 판단 가능 (모니터링)

---

## \[5. 활용 시나리오]

* 창고 출입구에 설치된 고정형 리더기로 자산 자동 출고 처리
* 모바일 리더기로 재고 실사 시 리더기별 기록 추적
* BLE 리더기 기준 자산 자동 위치 등록
* 각 리더기별 감지 로그(`ZFI_RFID_EVENT_LOG`)와 연결 가능

---

## \[6. 확장 고려 사항]

* 감지 민감도 설정: 신호 경계값, 거리 단위 기준점 적용
* RFID Reader 그룹화 기능: 창고별, 건물별 필터링
* 리더기 이벤트 발생 로그 (`ZFI_RFID_EVENT_LOG`) 별도 테이블 구성
* 리더기 감지 기록 → `ZFI_ASSET_POSITION_LOG` 자동 연계

---

## \[7. 연관 테이블 구조]

```txt
ZCM_RFID_READER
 ├─ readerCode
 └─ locationCode → ZCM_LOCATION.code
      ↓
  [RFID 감지 발생]
      ↓
ZFI_ASSET_POSITION_LOG
 → 자산 이동 자동 기록
 → ZFI_ASSET_LOG 통합 이력에 반영
```

