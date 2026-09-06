# ADHIKAAR - Automated Full Stack Startup Script (PowerShell)
Write-Host "=========================================" -ForegroundColor Green
Write-Host " ADHIKAAR: DISCOVERY. VERIFY. RECLAIM. " -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Green

Write-Host "`n[1/3] Initializing Database & Seed Records..." -ForegroundColor Cyan
python -m backend.app.seed

Write-Host "`n[2/3] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "`n[3/3] Starting Next.js Creative Frontend on http://localhost:3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "`n✓ ADHIKAAR Platform successfully launched!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API Docs: http://127.0.0.1:8000/docs" -ForegroundColor White
