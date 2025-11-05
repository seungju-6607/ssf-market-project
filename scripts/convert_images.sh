#!/bin/bash
# WebP 이미지 일괄 변환 스크립트 (Linux/Mac)

echo "==================================================="
echo "WebP 이미지 일괄 변환 스크립트"
echo "==================================================="
echo ""

# 프로젝트 루트로 이동
cd "$(dirname "$0")/.."

# Python 설치 확인
if ! command -v python3 &> /dev/null; then
    echo "[오류] Python3가 설치되어 있지 않습니다."
    echo "Python 3.x를 설치한 후 다시 실행해주세요."
    exit 1
fi

# Pillow 설치 확인
if ! python3 -c "import PIL" &> /dev/null; then
    echo "[알림] Pillow 라이브러리가 설치되어 있지 않습니다."
    read -p "Pillow를 설치하시겠습니까? (y/N): " install_pillow
    if [[ "$install_pillow" =~ ^[Yy]$ ]]; then
        pip3 install Pillow
    else
        echo "[오류] Pillow가 필요합니다. 설치 후 다시 실행해주세요."
        exit 1
    fi
fi

echo ""
echo "변환할 디렉토리를 선택하세요:"
echo ""
echo "1. 브랜드 배너 (frontend/src/assets/brands/banner)"
echo "2. 상품 이미지 (frontend/public/images)"
echo "3. 아이콘 (frontend/public/icons)"
echo "4. 문서 이미지 (docs/assets)"
echo "5. 전체 프로젝트"
echo "6. 직접 입력"
echo "0. 종료"
echo ""

read -p "선택 (0-6): " choice

case $choice in
    0)
        exit 0
        ;;
    1)
        target_dir="frontend/src/assets/brands/banner"
        ;;
    2)
        target_dir="frontend/public/images"
        ;;
    3)
        target_dir="frontend/public/icons"
        ;;
    4)
        target_dir="docs/assets"
        ;;
    5)
        target_dir="."
        ;;
    6)
        read -p "디렉토리 경로 입력: " target_dir
        ;;
    *)
        echo "[오류] 잘못된 선택입니다."
        exit 1
        ;;
esac

echo ""
read -p "품질 설정 (1-100, 기본값: 80): " quality
quality=${quality:-80}

echo ""
read -p "원본 파일을 삭제하시겠습니까? (y/N): " delete_original

delete_flag=""
if [[ "$delete_original" =~ ^[Yy]$ ]]; then
    delete_flag="--delete"
fi

echo ""
echo "==================================================="
echo "변환 시작"
echo "==================================================="
echo "대상: $target_dir"
echo "품질: $quality"
echo "원본 삭제: $delete_original"
echo "==================================================="
echo ""

# 변환 실행
python3 scripts/convert_to_webp.py "$target_dir" -q "$quality" $delete_flag

echo ""
echo "==================================================="
echo "변환 작업이 완료되었습니다."
echo "==================================================="
