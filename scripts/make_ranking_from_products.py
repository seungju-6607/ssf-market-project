# scripts/make_ranking_from_products.py

from pathlib import Path
import json
import random
import re

# 루트 기준 경로 잡기
BASE_DIR = Path(__file__).resolve().parent.parent
PRODUCT_JS = BASE_DIR / "frontend" / "src" / "data" / "productData.generated.js"
TARGET_JS = BASE_DIR / "frontend" / "src" / "data" / "rankingData.generated.js"

# productData.generated.js 안에서 category 필드로 쓰는 값들
CATEGORY_LABELS = {
    "women": "여성",
    "men": "남성",
    "kids": "키즈",
    "luxury": "럭셔리",
    "shoes": "백&슈즈",
    "sports": "스포츠",
    "golf": "골프",
    "beauty": "뷰티",
    "life": "라이프",
    "outlet": "아울렛",
}


def load_products():
    """productData.generated.js 안의 배열(JSON 부분)만 잘라서 로드"""
    text = PRODUCT_JS.read_text(encoding="utf-8")
    m = re.search(r"\[.*\]", text, flags=re.S)
    if not m:
        raise RuntimeError("products 배열(JSON)을 찾을 수 없습니다.")
    arr_text = m.group(0)
    return json.loads(arr_text)


def build_ranking(products, per_cat=60):
    """카테고리별로 상품 묶어서 상위 per_cat개 랭킹 구조로 변환"""
    grouped = {key: [] for key in CATEGORY_LABELS.keys()}

    for p in products:
        cat = p.get("category")
        if cat in grouped:
            grouped[cat].append(p)

    random.seed(2025)  

    ranking = {}

    for cat, items in grouped.items():
      
        items_sorted = sorted(items, key=lambda x: x.get("price", 0), reverse=True)
        top = items_sorted[:per_cat]

        cat_ranking = []
        for idx, prod in enumerate(top, start=1):
            price = int(prod.get("price") or 0)
            before = int(price * random.uniform(1.1, 1.8)) if price > 0 else price
            discount = int((before - price) / before * 100) if before else 0

            likes = random.randint(80, 999)
            reviews = random.randint(5, 200)
            change = random.randint(-5, 5)

            cat_ranking.append(
                {
                    "id": prod["id"],
                    "brand": prod.get("brand", ""),
                    "name": prod.get("name", ""),
                    "image": prod.get("image", ""),
                    "price": price,
                    "before": before,
                    "discount": f"{discount}%",
                    "likes": likes,
                    "reviews": reviews,
                    "rank": idx,
                    "rankChange": change,
                }
            )

        ranking[cat] = cat_ranking

    return ranking


def main():
    products = load_products()
    ranking = build_ranking(products)

    tabs = [
        {"key": key, "label": CATEGORY_LABELS[key]} for key in CATEGORY_LABELS.keys()
    ]

    js = "// ⚠ 자동 생성 파일 (scripts/make_ranking_from_products.py로 생성됨)\n"
    js += "export const RANKING_TABS = " + json.dumps(
        tabs, ensure_ascii=False, indent=2
    ) + ";\n\n"
    js += "export const rankingData = " + json.dumps(
        ranking, ensure_ascii=False, indent=2
    ) + ";\n"

    TARGET_JS.write_text(js, encoding="utf-8")
    print(f"[OK] 랭킹 데이터 생성 완료 → {TARGET_JS}")


if __name__ == "__main__":
    main()
