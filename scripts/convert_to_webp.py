#!/usr/bin/env python3
"""
WebP 이미지 변환 스크립트

이 스크립트는 지정된 디렉토리의 모든 JPG, JPEG, PNG 이미지를 WebP 포맷으로 변환합니다.
"""

import os
import sys
from pathlib import Path
from PIL import Image
import argparse

# Windows 인코딩 문제 해결
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')


def convert_to_webp(directory, quality=80, recursive=True, delete_original=False):
    """
    디렉토리 내 이미지를 WebP로 변환

    Args:
        directory (str): 변환할 디렉토리 경로
        quality (int): WebP 품질 (1-100, 기본값: 80)
        recursive (bool): 하위 디렉토리 포함 여부 (기본값: True)
        delete_original (bool): 원본 파일 삭제 여부 (기본값: False)
    """
    directory = Path(directory)

    if not directory.exists():
        print(f"오류: 디렉토리를 찾을 수 없습니다: {directory}")
        return

    # 변환 대상 확장자
    image_extensions = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}

    # 이미지 파일 찾기
    if recursive:
        image_files = [f for f in directory.rglob('*') if f.suffix in image_extensions]
    else:
        image_files = [f for f in directory.glob('*') if f.suffix in image_extensions]

    total_files = len(image_files)

    if total_files == 0:
        print(f"변환할 이미지 파일이 없습니다: {directory}")
        return

    print(f"\n{'='*70}")
    print(f"WebP 변환 시작")
    print(f"{'='*70}")
    print(f"대상 디렉토리: {directory}")
    print(f"총 파일 수: {total_files}개")
    print(f"품질 설정: {quality}")
    print(f"원본 삭제: {'예' if delete_original else '아니오'}")
    print(f"{'='*70}\n")

    converted = 0
    errors = 0
    skipped = 0

    for idx, image_path in enumerate(image_files, 1):
        try:
            # WebP 파일 경로
            webp_path = image_path.with_suffix('.webp')

            # 이미 WebP 파일이 존재하는 경우 건너뛰기
            if webp_path.exists() and not delete_original:
                print(f"[{idx}/{total_files}] 건너뛰기 (이미 존재): {image_path.name}")
                skipped += 1
                continue

            # 이미지 열기
            with Image.open(image_path) as img:
                # RGBA → RGB 변환 (WebP는 투명도를 지원하지만 RGB로 변환하면 파일 크기가 더 작음)
                if img.mode in ('RGBA', 'LA', 'P'):
                    rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                    img = rgb_img
                elif img.mode != 'RGB':
                    img = img.convert('RGB')

                # WebP로 저장
                img.save(webp_path, 'WEBP', quality=quality)

            # 원본 파일 삭제
            if delete_original:
                image_path.unlink()
                print(f"[{idx}/{total_files}] ✓ 변환 완료 (원본 삭제): {image_path.name} → {webp_path.name}")
            else:
                print(f"[{idx}/{total_files}] ✓ 변환 완료: {image_path.name} → {webp_path.name}")

            converted += 1

        except Exception as e:
            print(f"[{idx}/{total_files}] ✗ 오류: {image_path.name} - {str(e)}")
            errors += 1

    # 결과 요약
    print(f"\n{'='*70}")
    print(f"변환 완료")
    print(f"{'='*70}")
    print(f"성공: {converted}개")
    print(f"건너뛰기: {skipped}개")
    print(f"오류: {errors}개")
    print(f"{'='*70}\n")


def main():
    parser = argparse.ArgumentParser(
        description='이미지를 WebP 포맷으로 변환합니다.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
사용 예시:
  # 기본 사용법 (품질 80, 재귀적 변환)
  python convert_to_webp.py ./images

  # 품질 90으로 변환
  python convert_to_webp.py ./images -q 90

  # 원본 파일 삭제하며 변환
  python convert_to_webp.py ./images --delete

  # 하위 디렉토리 제외하고 변환
  python convert_to_webp.py ./images --no-recursive
        """
    )

    parser.add_argument('directory', help='변환할 디렉토리 경로')
    parser.add_argument('-q', '--quality', type=int, default=80,
                        help='WebP 품질 (1-100, 기본값: 80)')
    parser.add_argument('--no-recursive', action='store_true',
                        help='하위 디렉토리를 포함하지 않음')
    parser.add_argument('--delete', action='store_true',
                        help='변환 후 원본 파일 삭제')

    args = parser.parse_args()

    # 품질 범위 확인
    if not 1 <= args.quality <= 100:
        print("오류: 품질은 1-100 사이의 값이어야 합니다.")
        sys.exit(1)

    convert_to_webp(
        directory=args.directory,
        quality=args.quality,
        recursive=not args.no_recursive,
        delete_original=args.delete
    )


if __name__ == '__main__':
    main()
