# Scripts 디렉토리

이 디렉토리는 프로젝트 유틸리티 스크립트를 포함합니다.

## 📂 파일 구조

```
scripts/
├── README.md                # 이 문서
├── convert_to_webp.py      # WebP 변환 Python 스크립트
├── convert_images.bat      # Windows 배치 스크립트
└── convert_images.sh       # Linux/Mac 셸 스크립트
```

---

## 🖼️ WebP 이미지 변환 도구

프로젝트 내 이미지 파일을 WebP 포맷으로 변환하는 도구입니다.

### 빠른 시작

#### Windows
```bash
scripts\convert_images.bat
```

#### Linux/Mac
```bash
./scripts/convert_images.sh
```

### 직접 실행

```bash
# 기본 사용법
python scripts/convert_to_webp.py <디렉토리>

# 품질 지정
python scripts/convert_to_webp.py <디렉토리> -q 80

# 원본 삭제
python scripts/convert_to_webp.py <디렉토리> --delete

# 하위 디렉토리 제외
python scripts/convert_to_webp.py <디렉토리> --no-recursive
```

### 사용 예시

```bash
# 브랜드 배너 변환
python scripts/convert_to_webp.py frontend/src/assets/brands/banner -q 80

# 상품 이미지 변환 (원본 삭제)
python scripts/convert_to_webp.py frontend/public/images -q 85 --delete

# 전체 프로젝트 변환
python scripts/convert_to_webp.py . -q 80
```

---

## 📖 자세한 문서

전체 사용 가이드는 다음 문서를 참조하세요:

**[WebP 변환 가이드](../docs/05-guides/webp-conversion-guide.md)**

이 문서에는 다음 내용이 포함되어 있습니다:
- 사전 요구사항
- 상세 사용 방법
- 고급 사용법
- FAQ
- 문제 해결

---

## 🔧 사전 요구사항

### 필수
- Python 3.7+
- Pillow 라이브러리

### 설치

```bash
# Pillow 설치
pip install Pillow

# 또는
pip3 install Pillow
```

---

## 🎯 주요 기능

### convert_to_webp.py

**기능**:
- JPG, JPEG, PNG 파일을 WebP로 변환
- 재귀적 디렉토리 탐색
- 품질 조절 (1-100)
- 원본 파일 삭제 옵션
- 진행률 표시
- RGBA → RGB 자동 변환
- Windows 인코딩 자동 처리

**장점**:
- 30-50% 파일 크기 감소
- 품질 손실 최소화
- 빠른 변환 속도
- 안전한 오류 처리

### convert_images.bat / convert_images.sh

**기능**:
- 대화형 메뉴
- 사전 정의된 디렉토리 선택
- 자동 의존성 확인
- Pillow 자동 설치 옵션

**메뉴 옵션**:
1. 브랜드 배너 (`frontend/src/assets/brands/banner`)
2. 상품 이미지 (`frontend/public/images`)
3. 아이콘 (`frontend/public/icons`)
4. 문서 이미지 (`docs/assets`)
5. 전체 프로젝트 (`.`)
6. 직접 입력
0. 종료

---

## 📊 성능

### 변환 속도

| 파일 수 | 예상 시간 | 용량 절감 |
|---------|-----------|-----------|
| 10개 | 1-2초 | ~30-50% |
| 100개 | 10-15초 | ~30-50% |
| 500개 | 40-60초 | ~30-50% |

### 실제 결과 (이 프로젝트)

| 항목 | 파일 수 | 변환 시간 | 용량 절감 |
|------|---------|-----------|-----------|
| 브랜드 배너 | 74개 | ~5초 | 10MB (32%) |
| 상품 이미지 | 371개 | ~25초 | 다수 |
| 아이콘 | 61개 | ~8초 | 소량 |
| 문서 이미지 | 6개 | ~1초 | 소량 |
| **총계** | **512개** | **~40초** | **10MB** |

---

## 🚨 주의사항

1. **백업 권장**: 원본 파일을 삭제하기 전에 백업을 만드세요.
2. **Git 확인**: 변환 후 Git 상태를 확인하세요.
3. **품질 테스트**: 첫 변환 시 품질을 확인하세요.
4. **투명도**: RGBA 이미지는 흰색 배경으로 변환됩니다.

---

## 🔗 관련 링크

- [WebP 공식 사이트](https://developers.google.com/speed/webp)
- [Pillow 문서](https://pillow.readthedocs.io/)
- [Can I Use WebP](https://caniuse.com/webp)

---

## 📝 라이선스

이 스크립트는 프로젝트 라이선스를 따릅니다.

---

**최종 업데이트**: 2025-10-31
