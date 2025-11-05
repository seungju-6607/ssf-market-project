@echo off
chcp 65001 > nul
REM WebP 이미지 일괄 변환 스크립트 (Windows)

echo ===================================================
echo WebP 이미지 일괄 변환 스크립트
echo ===================================================
echo.

REM 프로젝트 루트로 이동
cd /d "%~dp0.."

REM Python 설치 확인
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Python이 설치되어 있지 않습니다.
    echo Python 3.x를 설치한 후 다시 실행해주세요.
    pause
    exit /b 1
)

REM Pillow 설치 확인
python -c "import PIL" >nul 2>&1
if %errorlevel% neq 0 (
    echo [알림] Pillow 라이브러리가 설치되어 있지 않습니다.
    echo Pillow를 설치하시겠습니까? (Y/N)
    set /p install_pillow=
    if /i "%install_pillow%"=="Y" (
        pip install Pillow
    ) else (
        echo [오류] Pillow가 필요합니다. 설치 후 다시 실행해주세요.
        pause
        exit /b 1
    )
)

echo.
echo 변환할 디렉토리를 선택하세요:
echo.
echo 1. 브랜드 배너 (frontend/src/assets/brands/banner)
echo 2. 상품 이미지 (frontend/public/images)
echo 3. 아이콘 (frontend/public/icons)
echo 4. 문서 이미지 (docs/assets)
echo 5. 전체 프로젝트
echo 6. 직접 입력
echo 0. 종료
echo.

set /p choice="선택 (0-6): "

if "%choice%"=="0" exit /b 0
if "%choice%"=="1" set target_dir=frontend/src/assets/brands/banner
if "%choice%"=="2" set target_dir=frontend/public/images
if "%choice%"=="3" set target_dir=frontend/public/icons
if "%choice%"=="4" set target_dir=docs/assets
if "%choice%"=="5" set target_dir=.
if "%choice%"=="6" (
    set /p target_dir="디렉토리 경로 입력: "
)

if not defined target_dir (
    echo [오류] 잘못된 선택입니다.
    pause
    exit /b 1
)

echo.
echo 품질 설정 (1-100, 기본값: 80):
set /p quality="품질 (Enter=80): "
if not defined quality set quality=80

echo.
echo 원본 파일을 삭제하시겠습니까? (Y/N, 기본값: N)
set /p delete_original="삭제 여부: "

set delete_flag=
if /i "%delete_original%"=="Y" set delete_flag=--delete

echo.
echo ===================================================
echo 변환 시작
echo ===================================================
echo 대상: %target_dir%
echo 품질: %quality%
echo 원본 삭제: %delete_original%
echo ===================================================
echo.

REM 변환 실행
python scripts/convert_to_webp.py "%target_dir%" -q %quality% %delete_flag%

echo.
echo ===================================================
echo 변환 작업이 완료되었습니다.
echo ===================================================
pause
