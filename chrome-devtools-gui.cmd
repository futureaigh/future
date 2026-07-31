@echo off
REM ============================================================
REM chrome-devtools-gui.cmd - launch chrome-devtools-mcp with a
REM VISIBLE (non-headless) Chrome window + isolated profile so it
REM does NOT appear to "close" immediately.
REM
REM Why it fixed the issue:
REM   chrome-devtools-mcp defaults to --headless (no visible window).
REM   Starting with --no-headless --isolated opens a real Chrome
REM   window using a temporary profile that stays open for the
REM   whole session, so the browser no longer auto-closes.
REM
REM Install permanently (one time):
REM   copy this file to a folder on your PATH, e.g.:
REM   copy chrome-devtools-gui.cmd "%USERPROFILE%\bin\"
REM   (make sure %USERPROFILE%\bin is on your PATH)
REM ============================================================
where chrome-devtools >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo chrome-devtools not found on PATH. Install it first:
  echo   npm i chrome-devtools-mcp@latest -g
  exit /b 1
)

echo Restarting chrome-devtools-mcp with a visible Chrome window...
chrome-devtools stop >nul 2>nul
chrome-devtools start --no-headless --isolated --log-file "%TEMP%\cdt-persist.log"
