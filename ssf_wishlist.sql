USE ssf;

CREATE TABLE IF NOT EXISTS ssf_wishlist (
    wish_key       INT AUTO_INCREMENT PRIMARY KEY COMMENT '찜 PK',
    user_key       VARCHAR(50) NOT NULL COMMENT '회원 고유번호 (ssf_user.user_key)',
    product_id     VARCHAR(100) NOT NULL COMMENT '프론트 상품 id',
    product_name   VARCHAR(255) NOT NULL COMMENT '상품명',
    product_brand  VARCHAR(100) NULL COMMENT '브랜드명',
    product_image  VARCHAR(500) NULL COMMENT '상품 이미지 URL',
    product_price  INT NOT NULL COMMENT '현재 판매가',
    product_price_ori INT NULL COMMENT '정상가(할인 전)',
    wish_rdate     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '찜한 날짜/시간',
    CONSTRAINT uq_wishlist_user_product UNIQUE (user_key, product_id)
);

SELECT * FROM ssf_wishlist;
