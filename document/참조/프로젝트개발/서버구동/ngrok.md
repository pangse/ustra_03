
1. 접속주소
https://dashboard.ngrok.com/get-started/setup/windows

2. 설치
install ngrok

3. 인증키 등록 
ngrok config add-authtoken 2xFhvOwxHVIOMSoUBedj0YMcBRY_jTNDL5UxxEjfTPEMXbjR


4.도메인 확인(결재 후) 계정 : songutuv@gmail.com   결재 (Pay to Pay)
 https://dashboard.ngrok.com/domains


5.도메인 설정  ID : rd_2xLXjAS3vZmoSGFuUb9cRzCWLdd
hybe.ngrok.app

6. 서버
npm run dev

7. 다른 터미널에서 실행 (인증키 등록 터미널) - 서버 실행용

--개발
ngrok http http://localhost:3080

--운영 터미널(인증키는 3번과 동일. )
ngrok config add-authtoken 2xFhvOwxHVIOMSoUBedj0YMcBRY_jTNDL5UxxEjfTPEMXbjR
ngrok http 3000 --url hybe.ngrok.app

8. 도메인 접속 확인 
hybe.ngrok.app



---------------- Old ----------------
1. 사이트 접속 
   https://dashboard.ngrok.com/get-started/setup/windows

ngrok http 3000


2. ngrok config 실행
ngrok config add-authtoken 2xFhvOwxHVIOMSoUBedj0YMcBRY_jTNDL5UxxEjfTPEMXbjR

3. 실행 
ngrok http http://localhost:3000

4. 터미널에서 web interface 확인
Session Status                online
 Account                       songutuv@gmail.com (Plan: Free)
 Version                       3.22.1
 Region                        Japan (jp)
Latency                       42ms
Web Interface                 http://127.0.0.1:4040

물론. 아래는 **ngrok을 처음부터 설치하고 외부 접속까지 가능한 상태로 만드는 전체 절차**야. Windows와 macOS, Linux를 모두 포함해서 설명할게.

---

# 📦 ngrok 설치부터 외부 접속까지 전체 절차

## 1단계. ngrok 회원가입 및 인증 토큰 확인

1. [https://ngrok.com/](https://ngrok.com/) 으로 이동
2. 이메일로 회원가입
3. 로그인 후 **"Your Authtoken"** 확인

   * 예: `2K3aPsfxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 2단계. ngrok 다운로드 및 설치

### 🔹 Windows

1. 아래 URL에서 다운로드
   [https://ngrok.com/download](https://ngrok.com/download)
2. ZIP 파일 압축 해제
3. `ngrok.exe`를 원하는 폴더에 저장 (예: `C:\ngrok\ngrok.exe`)
4. CMD 또는 PowerShell 실행 후 ngrok 명령어 작동 여부 확인:

```bash
cd C:\ngrok
ngrok version
```

### 🔹 macOS (Homebrew 사용)

```bash
brew install --cask ngrok
```

또는 직접 다운로드 후 `/usr/local/bin/`에 넣기.

### 🔹 Ubuntu/Linux

```bash
sudo snap install ngrok
```

---

## 3단계. 인증 토큰 등록

회원가입 후 받은 **authtoken**을 등록해야 ngrok이 작동함:

```bash
ngrok config add-authtoken <당신의_AUTHTOKEN>
```

예:

```bash
ngrok config add-authtoken 2K3aPsfxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 4단계. 로컬 서버 실행 확인 (예: 3000번 포트)

> 예시: Next.js 또는 Node.js 앱이 `http://localhost:3000`에 실행되고 있다고 가정

```bash
npm run dev
```

---

## 5단계. ngrok으로 외부 공개

```bash
ngrok http 3000
```

실행 결과:

```
Forwarding  https://a1b2c3d4.ngrok.io -> http://localhost:3000
```

이제 **`https://a1b2c3d4.ngrok.io`** 주소를 스마트폰, 외부 브라우저에서 접속하면 로컬 서버에 접속 가능!

---

## 6단계. 주소 유지(선택, 유료 플랜)

* 기본적으로 ngrok 주소는 매번 바뀜.
* 유료 플랜에서는 `https://내도메인.ngrok.io` 같은 고정 주소 설정 가능.

---

## 💡 팁: 자주 쓰는 명령

| 명령어                  | 설명                                           |
| -------------------- | -------------------------------------------- |
| `ngrok http 3000`    | 3000포트를 외부에 공개                               |
| `ngrok start --all`  | 설정파일에 정의된 모든 터널 실행                           |
| `ngrok config check` | 구성 오류 확인                                     |
| `ngrok dashboard`    | 웹 기반 터널 관리 대시보드 접속 (`http://127.0.0.1:4040`) |

---

필요하다면 `ngrok.yml` 설정파일 구성법, 백그라운드 실행, 인증 기반 터널 보호 등 고급 사용법도 안내해줄게.
어떤 환경에서 진행 중인지 (Windows/macOS/Linux) 알려주면 맞춤으로 도와줄 수도 있어.
