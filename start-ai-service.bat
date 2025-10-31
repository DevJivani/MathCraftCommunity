@echo off
echo Starting AI Classification Service...
echo.
cd /d "%~dp0python-files"
echo Current directory: %CD%
echo.
echo Installing Python dependencies...
pip install -r requirements.txt
echo.
echo Starting AI service on port 5001...
python python-a21-ai.py
pause
