PostgreSQL을 Windows 환경에 설치하고 사용하는 방법을 안내해드릴게요.

### 1. PostgreSQL 설치

1. [공식 PostgreSQL 다운로드 페이지](https://www.postgresql.org/download/windows/)로 이동합니다.
2. “Download the installer”를 클릭하여 Windows용 설치 관리자를 다운로드합니다.
3. 다운로드한 파일을 실행하여 설치를 진행합니다.
   - 설치 중간에 데이터베이스 superuser(기본적으로 postgres)의 비밀번호를 설정해야 하니 기억해두세요.
   - 포트(기본 5432), 데이터 디렉터리 등은 기본값을 사용해도 무방합니다.

### 2. 환경 변수 설정 (선택 사항)
설치 후, `psql` 명령어를 어디서든 사용하려면 PostgreSQL의 `bin` 폴더를 환경 변수 PATH에 추가하면 편리합니다.

### 3. PostgreSQL 서버 실행 및 접속

- **서버 실행**: 설치 시 자동으로 Windows 서비스로 등록되어 자동 실행됩니다.
- **psql 접속**:  
  시작 메뉴에서 “SQL Shell (psql)”을 실행하거나, 명령 프롬프트/PowerShell에서 다음과 같이 접속할 수 있습니다.
  ```sh
  psql -U postgres
  ```
  (비밀번호는 설치 시 입력한 것으로 로그인)

  port 5432
  admin/ Init1234
  
mcp 등록
https://smithery.ai/server/@smithery-ai/postgres


### 4. 간단한 사용 예시

```sql
-- 데이터베이스 생성
CREATE DATABASE testdb;

-- 데이터베이스 목록 보기
\l

-- 데이터베이스 접속
\c testdb

-- 테이블 생성
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

-- 데이터 삽입
INSERT INTO users (name) VALUES ('Alice'), ('Bob');

-- 데이터 조회
SELECT * FROM users;
```

---

#### 추가로 원하는 작업(예: Python, Node.js 등에서 PostgreSQL 연동)이나, 설치 과정에서 막히는 부분이 있으면 말씀해 주세요!  
원하시면 설치 자동화 스크립트나, GUI 툴(PgAdmin) 안내도 도와드릴 수 있습니다.
