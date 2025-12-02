/* productData.json -> ssf_category 테이블 데이터 insert */
INSERT INTO ssf_category (
    category_id,
    category_key,
    category_key2,
    category_name
)
SELECT DISTINCT
    CONCAT(
        LPAD(
            CASE jt.category
                WHEN 'women' THEN 1
                WHEN 'men' THEN 2
                WHEN 'kids' THEN 3
                WHEN 'luxury' THEN 4
                WHEN 'shoes' THEN 5
                WHEN 'sports' THEN 6
                WHEN 'golf' THEN 7
                WHEN 'beauty' THEN 8
                WHEN 'life' THEN 9
                ELSE 99
            END, 2, '0'
        ),
        LPAD(
            CASE jt.subcategory
                WHEN 'outer' THEN 1
                WHEN 'jacket' THEN 2
                WHEN 'knit' THEN 3
                WHEN 'shirt' THEN 4
                WHEN 'tshirt' THEN 5
                WHEN 'onepiece' THEN 6
                WHEN 'pants' THEN 7
                WHEN 'skirt' THEN 8
                WHEN 'new' THEN 9
                WHEN 'suit' THEN 10
                WHEN 'boy' THEN 11
                WHEN 'girl' THEN 12
                WHEN 'baby' THEN 13
                WHEN 'womenapparel' THEN 14
                WHEN 'womenacc' THEN 15
                WHEN 'menapparel' THEN 16
                WHEN 'menacc' THEN 17
                WHEN 'women-bag' THEN 18
                WHEN 'women-wallet' THEN 19
                WHEN 'women-shoes' THEN 20
                WHEN 'men-bag' THEN 21
                WHEN 'men-wallet' THEN 22
                WHEN 'men-shoes' THEN 23
                WHEN 'travel' THEN 24
                WHEN 'men-apparel' THEN 25
                WHEN 'women-apparel' THEN 26
                WHEN 'shoes' THEN 27
                WHEN 'bag' THEN 28
                WHEN 'gear' THEN 29
                WHEN 'camping' THEN 30
                WHEN 'swim' THEN 31
                WHEN 'ball' THEN 32
                WHEN 'club' THEN 33
                WHEN 'acc' THEN 34
                WHEN 'skin' THEN 35
                WHEN 'makeup' THEN 36
                WHEN 'perfume' THEN 37
                WHEN 'furniture' THEN 38
                WHEN 'lighting' THEN 39
                WHEN 'homedeco' THEN 40
                WHEN 'homesragrance' THEN 41
                WHEN 'pet' THEN 42
                WHEN 'food' THEN 43
                WHEN 'deskstationery' THEN 44
                WHEN 'appliance' THEN 45
                WHEN 'car' THEN 46
                WHEN 'digital' THEN 47
                WHEN 'artculture' THEN 48
                WHEN 'storage' THEN 49
                WHEN 'giftcard' THEN 50
                WHEN 'women' THEN 51
                WHEN 'men' THEN 52
                WHEN 'kids' THEN 53
                WHEN 'luxury' THEN 54
                WHEN 'sports' THEN 55
                WHEN 'golf' THEN 56
                WHEN 'beauty' THEN 57
                WHEN 'life' THEN 58
                ELSE 99
            END, 2, '0'
        )
    ) AS category_id,

    CASE jt.category
        WHEN 'women' THEN 1
        WHEN 'men' THEN 2
        WHEN 'kids' THEN 3
        WHEN 'luxury' THEN 4
        WHEN 'shoes' THEN 5
        WHEN 'sports' THEN 6
        WHEN 'golf' THEN 7
        WHEN 'beauty' THEN 8
        WHEN 'life' THEN 9
        ELSE 99
    END AS category_key,

    CASE jt.subcategory
        WHEN 'outer' THEN 1
        WHEN 'jacket' THEN 2
        WHEN 'knit' THEN 3
        WHEN 'shirt' THEN 4
        WHEN 'tshirt' THEN 5
        WHEN 'onepiece' THEN 6
        WHEN 'pants' THEN 7
        WHEN 'skirt' THEN 8
        WHEN 'new' THEN 9
        WHEN 'suit' THEN 10
        WHEN 'boy' THEN 11
        WHEN 'girl' THEN 12
        WHEN 'baby' THEN 13
        WHEN 'womenapparel' THEN 14
        WHEN 'womenacc' THEN 15
        WHEN 'menapparel' THEN 16
        WHEN 'menacc' THEN 17
        WHEN 'women-bag' THEN 18
        WHEN 'women-wallet' THEN 19
        WHEN 'women-shoes' THEN 20
        WHEN 'men-bag' THEN 21
        WHEN 'men-wallet' THEN 22
        WHEN 'men-shoes' THEN 23
        WHEN 'travel' THEN 24
        WHEN 'men-apparel' THEN 25
        WHEN 'women-apparel' THEN 26
        WHEN 'shoes' THEN 27
        WHEN 'bag' THEN 28
        WHEN 'gear' THEN 29
        WHEN 'camping' THEN 30
        WHEN 'swim' THEN 31
        WHEN 'ball' THEN 32
        WHEN 'club' THEN 33
        WHEN 'acc' THEN 34
        WHEN 'skin' THEN 35
        WHEN 'makeup' THEN 36
        WHEN 'perfume' THEN 37
        WHEN 'furniture' THEN 38
        WHEN 'lighting' THEN 39
        WHEN 'homedeco' THEN 40
        WHEN 'homesragrance' THEN 41
        WHEN 'pet' THEN 42
        WHEN 'food' THEN 43
        WHEN 'deskstationery' THEN 44
        WHEN 'appliance' THEN 45
        WHEN 'car' THEN 46
        WHEN 'digital' THEN 47
        WHEN 'artculture' THEN 48
        WHEN 'storage' THEN 49
        WHEN 'giftcard' THEN 50
        WHEN 'women' THEN 51
        WHEN 'men' THEN 52
        WHEN 'kids' THEN 53
        WHEN 'luxury' THEN 54
        WHEN 'sports' THEN 55
        WHEN 'golf' THEN 56
        WHEN 'beauty' THEN 57
        WHEN 'life' THEN 58
        ELSE 99
    END AS category_key2,

    CONCAT(jt.category, '/', jt.subcategory) AS category_name

FROM JSON_TABLE(
    CAST(LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/productData.json') AS CHAR CHARACTER SET utf8mb4),
    "$[*]" COLUMNS (
        category VARCHAR(50) PATH "$.category",
        subcategory VARCHAR(50) PATH "$.subcategory"
    )
) jt;


/* productData.json -> ssf_item 테이블 데이터 insert */
INSERT INTO ssf_item (
    category_id,
	product_id,
    item_name,
    item_list,
    item_content,
    item_price,
    item_sale,
    item_rdate,
    item_cnt,
    item_deleted,
    item_brand,
    item_category,
    item_subcategory
)
SELECT
    c.category_id,
    jt.id,
    jt.name,
    JSON_ARRAY(jt.image),
    jt.name,
    jt.price,
    jt.price,
    NOW(),
    10,
    'N',
    jt.brand,
    jt.category,
    jt.subcategory
FROM JSON_TABLE(
    CAST(LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/rankingData.json') AS CHAR CHARACTER SET utf8mb4),
    "$[*]" COLUMNS (
		id VARCHAR(100) PATH "$.id",
        category VARCHAR(50) PATH "$.category",
        subcategory VARCHAR(50) PATH "$.subcategory",
        name VARCHAR(150) PATH "$.name",
        image VARCHAR(1000) PATH "$.image",
        price INT PATH "$.price",
        brand VARCHAR(100) PATH "$.brand"
    )
) jt
JOIN ssf_category c
  ON c.category_key = (
        CASE jt.category
            WHEN 'women' THEN 1
            WHEN 'men' THEN 2
            WHEN 'kids' THEN 3
            WHEN 'luxury' THEN 4
            WHEN 'shoes' THEN 5
            WHEN 'sports' THEN 6
            WHEN 'golf' THEN 7
            WHEN 'beauty' THEN 8
            WHEN 'life' THEN 9
            ELSE 99
        END
     )
 AND c.category_key2 = (
        CASE jt.subcategory
            WHEN 'outer' THEN 1
            WHEN 'jacket' THEN 2
            WHEN 'knit' THEN 3
            WHEN 'shirt' THEN 4
            WHEN 'tshirt' THEN 5
            WHEN 'onepiece' THEN 6
            WHEN 'pants' THEN 7
            WHEN 'skirt' THEN 8
            WHEN 'new' THEN 9
            WHEN 'suit' THEN 10
            WHEN 'boy' THEN 11
            WHEN 'girl' THEN 12
            WHEN 'baby' THEN 13
            WHEN 'womenapparel' THEN 14
            WHEN 'womenacc' THEN 15
            WHEN 'menapparel' THEN 16
            WHEN 'menacc' THEN 17
            WHEN 'women-bag' THEN 18
            WHEN 'women-wallet' THEN 19
            WHEN 'women-shoes' THEN 20
            WHEN 'men-bag' THEN 21
            WHEN 'men-wallet' THEN 22
            WHEN 'men-shoes' THEN 23
            WHEN 'travel' THEN 24
            WHEN 'men-apparel' THEN 25
            WHEN 'women-apparel' THEN 26
            WHEN 'shoes' THEN 27
            WHEN 'bag' THEN 28
            WHEN 'gear' THEN 29
            WHEN 'camping' THEN 30
            WHEN 'swim' THEN 31
            WHEN 'ball' THEN 32
            WHEN 'club' THEN 33
            WHEN 'acc' THEN 34
            WHEN 'skin' THEN 35
            WHEN 'makeup' THEN 36
            WHEN 'perfume' THEN 37
            WHEN 'furniture' THEN 38
            WHEN 'lighting' THEN 39
            WHEN 'homedeco' THEN 40
            WHEN 'homesragrance' THEN 41
            WHEN 'pet' THEN 42
            WHEN 'food' THEN 43
            WHEN 'deskstationery' THEN 44
            WHEN 'appliance' THEN 45
            WHEN 'car' THEN 46
            WHEN 'digital' THEN 47
            WHEN 'artculture' THEN 48
            WHEN 'storage' THEN 49
            WHEN 'giftcard' THEN 50
            WHEN 'women' THEN 51
            WHEN 'men' THEN 52
            WHEN 'kids' THEN 53
            WHEN 'luxury' THEN 54
            WHEN 'sports' THEN 55
            WHEN 'golf' THEN 56
            WHEN 'beauty' THEN 57
            WHEN 'life' THEN 58
            ELSE 99
        END
     );


use ssf;
show tables;
desc ssf_item;
set SQL_SAFE_UPDATES = 0;
-- drop table ssf_item;
delete from ssf_category;

select count(*) from ssf_item;
select * from ssf_category where category_key = 9;
