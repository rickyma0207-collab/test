@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动服务器...
echo 启动后请在浏览器打开: http://localhost:3000
echo 按 Ctrl+C 可停止服务
echo.
npm start
pause
