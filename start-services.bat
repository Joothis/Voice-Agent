@echo off
echo Starting Voice Agent Backend Services...

REM Start n8n in a new window
start cmd /k "echo Starting n8n... && n8n start"

REM Wait for n8n to start
echo Waiting for n8n to start...
timeout /t 5 /nobreak > nul

REM Start the backend server
echo Starting backend server...
start cmd /k "cd backend && python main.py"

echo Services started successfully!
echo n8n UI: http://localhost:5678
echo Backend API: http://localhost:8000

REM Open the n8n UI in the default browser
start http://localhost:5678

echo Press any key to exit...
pause > nul
