otpauth://totp/ngrok:songutuv@gmail.com?algorithm=SHA1&digits=6&issuer=ngrok&period=30&secret=B3U2EKEA2PII5AYX3SKSMPG6VCZ3LE7K



ngrok config add-authtoken 2xFhvOwxHVIOMSoUBedj0YMcBRY_jTNDL5UxxEjfTPEMXbjR

1. 사이트 접속 
   https://dashboard.ngrok.com/get-started/setup/windows


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