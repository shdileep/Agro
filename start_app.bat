@echo off
echo Starting app... > app.log
start /B npm run dev >> app.log 2>&1
echo App started in background. >> app.log
