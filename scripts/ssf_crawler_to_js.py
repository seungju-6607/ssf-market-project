from bs4 import BeautifulSoup
from pathlib import Path
import json
import re
import time
import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; SSFShopBot/1.0; +http://localhost)"
}


def fetch_html(url):
    """실제 사이트에서 HTML 가져오기"""
    print(f"[INFO] 요청: {url}")
    r = requests.get(url, headers=HEADERS, timeout=10)
    r.raise_for_status()
    return r.text


def parse_list_page(html, category, subcategory):
    """상품 리스트 HTML을 파싱"""
    soup = BeautifulSoup(html, "html.parser")
    products = []

    # 공통 구조: li.god-item
    for li in soup.select("li.god-item"):
        prdno = li.get("data-prdno") or ""
        brand_el = li.select_one("span.brand")
        name_el = li.select_one("span.name")
        price_el = li.select_one("span.price")
        img_el = li.select_one("div.god-img img")

        brand = brand_el.get_text(strip=True) if brand_el else ""
        name = name_el.get_text(strip=True) if name_el else ""
        price_text = price_el.get_text(" ", strip=True) if price_el else ""

        raw = price_text.replace(",", "")
        nums = re.findall(r"\d{3,}", raw)
        sale_price = int(nums[-1]) if nums else 0

        image = img_el["src"] if img_el and img_el.has_attr("src") else ""

        if not name:
            continue

        products.append(
            {
                "id": prdno or name,
                "brand": brand,
                "name": name,
                "price": sale_price,
                "image": image,
                "category": category,       # 프론트 CATEGORY_DATA의 키와 동일
                "subcategory": subcategory  # CATEGORY_DATA[cat].pages의 키와 동일
            }
        )

    print(f"[INFO] {category}/{subcategory} → {len(products)}개 상품 추출")
    return products


def crawl_category(url, category, subcategory):
    """한 카테고리 크롤링"""
    html = fetch_html(url)
    return parse_list_page(html, category, subcategory)


def main():
    base_dir = Path(__file__).resolve().parent.parent
    target_js = base_dir / "frontend" / "src" / "data" / "productData.generated.js"
    target_js.parent.mkdir(parents=True, exist_ok=True)

    categories = [
        # ===== 여성 =====
        ("https://www.ssfshop.com/Outerwear/list?dspCtgryNo=SFMA41A07", "women", "outer"),
        ("https://www.ssfshop.com/Jackets-Vests/list?dspCtgryNo=SFMA41A21", "women", "jacket"),
        ("https://www.ssfshop.com/Knitwear/list?dspCtgryNo=SFMA41A03", "women", "knit"),
        ("https://www.ssfshop.com/Shirts-Blouses/list?dspCtgryNo=SFMA41A02", "women", "shirt"),
        ("https://www.ssfshop.com/T-shirts/list?dspCtgryNo=SFMA41A01", "women", "tshirt"),
        ("https://www.ssfshop.com/Dresses/list?dspCtgryNo=SFMA41A06", "women", "onepiece"),
        ("https://www.ssfshop.com/Pants-Trousers/list?dspCtgryNo=SFMA41A04", "women", "pants"),
        ("https://www.ssfshop.com/Skirts/list?dspCtgryNo=SFMA41A05", "women", "skirt"),
        ("https://www.ssfshop.com/New-In/list?dspCtgryNo=SFMA41A14", "women", "new"),

        # ===== 남성 =====
        ("https://www.ssfshop.com/Outerwear/list?dspCtgryNo=SFMA42A05", "men", "outer"),
        ("https://www.ssfshop.com/Formal-Wear/list?dspCtgryNo=SFMA42A06", "men", "suit"),
        ("https://www.ssfshop.com/Jackets-Vests/list?dspCtgryNo=SFMA42A19", "men", "jacket"),
        ("https://www.ssfshop.com/Shirts/list?dspCtgryNo=SFMA42A02", "men", "shirt"),
        ("https://www.ssfshop.com/Knitwear/list?dspCtgryNo=SFMA42A03", "men", "knit"),
        ("https://www.ssfshop.com/T-Shirts/list?dspCtgryNo=SFMA42A01", "men", "tshirt"),
        ("https://www.ssfshop.com/Pants-Trousers/list?dspCtgryNo=SFMA42A04", "men", "pants"),
        ("https://www.ssfshop.com/New-In/list?dspCtgryNo=SFMA42A13", "men", "new"),

        # ===== 키즈 =====
        ("https://www.ssfshop.com/BOYS/list?dspCtgryNo=SFMA43A01", "kids", "boy"),
        ("https://www.ssfshop.com/GIRLS/list?dspCtgryNo=SFMA43A02", "kids", "girl"),
        ("https://www.ssfshop.com/BABY/list?dspCtgryNo=SFMA43A06", "kids", "baby"),
        ("https://www.ssfshop.com/New-In/list?dspCtgryNo=SFMA43A03", "kids", "new"),

        # ===== 럭셔리 ===== (camelCase로 맞춤)
        ("https://www.ssfshop.com/Women-Apparel/list?dspCtgryNo=SFME34A01", "luxury", "womenapparel"),
        ("https://www.ssfshop.com/Women-Fashion-Accessories/list?dspCtgryNo=SFME34A11", "luxury", "womenacc"),
        ("https://www.ssfshop.com/Mens-Apparel/list?dspCtgryNo=SFME34A02", "luxury", "menapparel"),
        ("https://www.ssfshop.com/Mens-Fashion-Accessories/list?dspCtgryNo=SFME34A13", "luxury", "menacc"),

        # ===== 백&슈즈 =====
        # category는 프론트의 key인 "shoes"로 통일, subcategory는 camelCase
        ("https://www.ssfshop.com/new-in/list?dspCtgryNo=SFMA46A02", "shoes", "new"),
        ("https://www.ssfshop.com/WomenBags/list?dspCtgryNo=SFMA46A09", "shoes", "women-bag"),
        ("https://www.ssfshop.com/WomensWallet/list?dspCtgryNo=SFMA46A10", "shoes", "women-wallet"),
        ("https://www.ssfshop.com/WomensShoes/list?dspCtgryNo=SFMA46A12", "shoes", "women-shoes"),
        ("https://www.ssfshop.com/MensBags/list?dspCtgryNo=SFMA46A13", "shoes", "men-bag"),
        ("https://www.ssfshop.com/MensWallets/list?dspCtgryNo=SFMA46A14", "shoes", "men-wallet"),
        ("https://www.ssfshop.com/MensShoes/list?dspCtgryNo=SFMA46A18", "shoes", "men-shoes"),
        ("https://www.ssfshop.com/TRAVEL/list?dspCtgryNo=SFMA46A27", "shoes", "travel"),

        # ===== 스포츠 =====
        ("https://www.ssfshop.com/Men-Clothing/list?dspCtgryNo=SFME37A17", "sports", "men-apparel"),
        ("https://www.ssfshop.com/Women-Clothing/list?dspCtgryNo=SFME37A18", "sports", "women-apparel"),
        ("https://www.ssfshop.com/Shoes/list?dspCtgryNo=SFME37A19", "sports", "shoes"),
        ("https://www.ssfshop.com/Bag/list?dspCtgryNo=SFME37A21", "sports", "bag"),
        ("https://www.ssfshop.com/Sports-Goods/list?dspCtgryNo=SFME37A22", "sports", "gear"),
        ("https://www.ssfshop.com/Camping-Goods/list?dspCtgryNo=SFME37A23", "sports", "camping"),
        ("https://www.ssfshop.com/SwimWear/list?dspCtgryNo=SFME37A24", "sports", "swim"),

        # ===== 골프 =====
        ("https://www.ssfshop.com/Golfball/list?dspCtgryNo=SFME35A15", "golf", "ball"),
        ("https://www.ssfshop.com/WOMEN/list?dspCtgryNo=SFME35A01", "golf", "women-apparel"),
        ("https://www.ssfshop.com/WOMENSSHOES/list?dspCtgryNo=SFME35A08", "golf", "women-shoes"),
        ("https://www.ssfshop.com/MEN/list?dspCtgryNo=SFME35A07", "golf", "men-apparel"),
        ("https://www.ssfshop.com/MENSSHOES/list?dspCtgryNo=SFME35A09", "golf", "men-shoes"),
        ("https://www.ssfshop.com/GOLFCLUB/list?dspCtgryNo=SFME35A13", "golf", "club"),
        ("https://www.ssfshop.com/GOLFBAG/list?dspCtgryNo=SFME35A11", "golf", "bag"),
        ("https://www.ssfshop.com/GOLF-EQUIPMENT/list?dspCtgryNo=SFME35A12", "golf", "acc"),

        # ===== 뷰티 =====
        ("https://www.ssfshop.com/Skincare/list?dspCtgryNo=SFMA45A07", "beauty", "skin"),
        ("https://www.ssfshop.com/Makeup/list?dspCtgryNo=SFMA45A08", "beauty", "makeup"),
        ("https://www.ssfshop.com/Fragrance/list?dspCtgryNo=SFMA45A01", "beauty", "perfume"),
        ("https://www.ssfshop.com/Newin/list?dspCtgryNo=SFMA45A02", "beauty", "new"),

        # ===== 라이프 =====
        ("https://www.ssfshop.com/Furniture-Living/list?dspCtgryNo=SFMB84A03", "life", "furniture"),
        ("https://www.ssfshop.com/LIGHT/list?dspCtgryNo=SFMB84A55", "life", "lighting"),
        ("https://www.ssfshop.com/Homedeco/list?dspCtgryNo=SFMB84A35", "life", "homedeco"),
        ("https://www.ssfshop.com/HomeFragrance/list?dspCtgryNo=SFMB84A27", "life", "homesragrance"),
        ("https://www.ssfshop.com/Pet/list?dspCtgryNo=SFMB84A07", "life", "pet"),
        ("https://www.ssfshop.com/Food/list?dspCtgryNo=SFMB84A06", "life", "food"),
        ("https://www.ssfshop.com/Stationery/list?dspCtgryNo=SFMB84A49", "life", "deskstationery"),
        ("https://www.ssfshop.com/homeappliances/list?dspCtgryNo=SFMB84A24", "life", "appliance"),
        ("https://www.ssfshop.com/Car-Supplies/list?dspCtgryNo=SFMB84A51", "life", "car"),
        ("https://www.ssfshop.com/DIGITAL/list?dspCtgryNo=SFMB84A46", "life", "digital"),
        ("https://www.ssfshop.com/ART/list?dspCtgryNo=SFMB84A12", "life", "artculture"),
        ("https://www.ssfshop.com/Acceptance/list?dspCtgryNo=SFMB84A48", "life", "storage"),
        ("https://www.ssfshop.com/Giftcard/list?dspCtgryNo=SFMB84A45", "life", "giftcard"),

       # ===== 아울렛 =====
        ("https://www.ssfshop.com/WOMEN/list?dspCtgryNo=SFMA44A02", "outlet", "women"),
        ("https://www.ssfshop.com/MEN/list?dspCtgryNo=SFMA44A04", "outlet", "men"),
        ("https://www.ssfshop.com/KIDS/list?dspCtgryNo=SFMA44A05", "outlet", "kids"),
        ("https://www.ssfshop.com/LUXURY/list?dspCtgryNo=SFMA44A09", "outlet", "luxury"),
        ("https://www.ssfshop.com/BAG-SHOES/list?dspCtgryNo=SFMA44A06", "outlet", "shoes"),
        ("https://www.ssfshop.com/SPORTS/list?dspCtgryNo=SFMA44A11", "outlet", "sports"),
        ("https://www.ssfshop.com/GOLF/list?dspCtgryNo=SFMA44A12", "outlet", "golf"),
        ("https://www.ssfshop.com/BEAUTY/list?dspCtgryNo=SFMA44A08", "outlet", "beauty"),
        ("https://www.ssfshop.com/LIFE/list?dspCtgryNo=SFMA44A07", "outlet", "life"),

    ]

    all_products = []
    for url, cat, sub in categories:
        try:
            items = crawl_category(url, cat, sub)
            all_products.extend(items)
            time.sleep(1)
        except Exception as e:
            print(f"[WARN] {cat}/{sub} 크롤링 실패: {e}")

    print(f"\n총 {len(all_products)}개 상품 수집 완료.")

    # JSON 저장 (디버그용)
    json_path = base_dir / "scripts" / "ssf_items.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_products, f, ensure_ascii=False, indent=2)
    print(f"[INFO] ssf_items.json 저장 완료 ({json_path})")

    # JS 파일로 저장 (프론트에서 import 해서 씀)
    with open(target_js, "w", encoding="utf-8") as f:
        f.write("// ⚠ 자동 생성 파일 (scripts/ssf_crawler_to_js.py로 생성됨)\n")
        f.write("export const products = ")
        json.dump(all_products, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print(f"[INFO] productData.generated.js 생성 완료 ({target_js})")


if __name__ == "__main__":
    main()
