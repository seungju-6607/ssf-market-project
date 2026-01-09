/* =========================
   STEP 1) DDL (Aiven-safe)
   - schema는 이미 있다고 가정
   - 파괴 DROP 제거/IF EXISTS 처리
   - FK 순서 정리
   ========================= */

USE ssf;

SET SQL_SAFE_UPDATES = 0;

/* -------------------------
   1) USER
   ------------------------- */
CREATE TABLE IF NOT EXISTS ssf_user (
  user_key     VARCHAR(100) PRIMARY KEY COMMENT '회원고유번호',
  email        VARCHAR(50)  NOT NULL     COMMENT '이메일',
  username     VARCHAR(20)  NOT NULL     COMMENT '이름',
  userpwd      VARCHAR(100) NOT NULL     COMMENT '비밀번호',
  banned       VARCHAR(1)   NULL         COMMENT '정지여부',
  signout      VARCHAR(1)   NULL         COMMENT '회원탈퇴여부',
  signin       DATETIME     NOT NULL     COMMENT '가입날짜',
  snsprov      VARCHAR(100) NULL         COMMENT 'SNS제공자종류',
  snsid        VARCHAR(100) NULL         COMMENT '사용자SNS고유ID',
  referralId   VARCHAR(100) NULL         COMMENT '추천인ID',
  phone        VARCHAR(13)  NULL         COMMENT '휴대전화번호',
  role         VARCHAR(13)  NOT NULL     COMMENT '권한구분코드'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* -------------------------
   2) COUPON
   ------------------------- */
CREATE TABLE IF NOT EXISTS ssf_coupon (
  coupon_id    VARCHAR(50)  NOT NULL COMMENT '쿠폰UUID',
  coupon_name  VARCHAR(150) NOT NULL COMMENT '쿠폰명',
  coupon_cost  INT          NOT NULL COMMENT '할인금액',
  expire_at    DATE         NOT NULL COMMENT '쿠폰 만료일',
  PRIMARY KEY (coupon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ssf_coupon_used (
  id        BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '단일 PK',
  coupon_id VARCHAR(50)  NOT NULL COMMENT '쿠폰 UUID',
  user_key  VARCHAR(100) NOT NULL COMMENT '회원고유번호',
  used_yn   CHAR(1)      NOT NULL DEFAULT 'N' COMMENT '사용여부',
  UNIQUE KEY uq_coupon_user (coupon_id, user_key),
  CONSTRAINT fk_coupon_used_coupon FOREIGN KEY (coupon_id) REFERENCES ssf_coupon(coupon_id),
  CONSTRAINT fk_coupon_used_user   FOREIGN KEY (user_key)  REFERENCES ssf_user(user_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* -------------------------
   3) ADDRESS
   ------------------------- */
CREATE TABLE IF NOT EXISTS ssf_addr (
  addr_key      INT AUTO_INCREMENT NOT NULL COMMENT '배송지고유코드',
  user_key      VARCHAR(100)       NOT NULL COMMENT '회원고유번호',
  addr_name     VARCHAR(15)        NOT NULL COMMENT '받는분성명',
  addr_zipcode  VARCHAR(6)         NOT NULL COMMENT '우편번호',
  addr_main     VARCHAR(300)       NOT NULL COMMENT '받는분주소',
  addr_detail   VARCHAR(100)       NOT NULL COMMENT '상세주소',
  addr_tel      VARCHAR(15)        NOT NULL COMMENT '받는분전화번호',
  addr_req      VARCHAR(100)       NULL     COMMENT '배송시요청사항',
  addr_def      VARCHAR(1)         NULL     COMMENT '기본배송지여부',
  PRIMARY KEY (addr_key),
  CONSTRAINT fk_ssf_addr_user FOREIGN KEY (user_key) REFERENCES ssf_user(user_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* -------------------------
   4) CATEGORY / ITEM
   ------------------------- */
CREATE TABLE IF NOT EXISTS ssf_category (
  category_id    VARCHAR(5)   NOT NULL COMMENT '카테고리구분키',
  category_key   INT          NOT NULL COMMENT '카테고리고유번호',
  category_key2  INT          NOT NULL COMMENT '카테고리고유번호2',
  category_name  VARCHAR(150) NOT NULL COMMENT '카테고리명',
  PRIMARY KEY (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ssf_item (
  item_key         INT AUTO_INCREMENT NOT NULL COMMENT '상품고유번호',
  category_id      VARCHAR(5)         NOT NULL COMMENT '카테고리구분키',
  product_id       VARCHAR(100)       NOT NULL COMMENT '상품 id',
  item_name        VARCHAR(150)       NOT NULL COMMENT '상품명',
  item_list        JSON               NOT NULL COMMENT '이미지리스트',
  item_content     VARCHAR(1000)      NULL     COMMENT '상품상세',
  item_price       INT                NOT NULL COMMENT '정가',
  item_sale        INT                NOT NULL COMMENT '판매가',
  item_rdate       DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '등록일',
  item_cnt         INT                NOT NULL COMMENT '재고',
  item_deleted     VARCHAR(1) DEFAULT 'N' NULL COMMENT '삭제여부',
  item_brand       VARCHAR(100)       NOT NULL COMMENT '상품브랜드',
  item_category    VARCHAR(150)       NOT NULL COMMENT '대분류카테고리',
  item_subcategory VARCHAR(150)       NOT NULL COMMENT '중분류카테고리',
  PRIMARY KEY (item_key),
  CONSTRAINT fk_item_category FOREIGN KEY (category_id) REFERENCES ssf_category(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* -------------------------
   5) CART
   ------------------------- */
CREATE TABLE IF NOT EXISTS ssf_cart (
  cart_key   INT AUTO_INCREMENT NOT NULL COMMENT '장바구니고유번호',
  user_key   VARCHAR(100)       NOT NULL COMMENT '회원고유번호',
  item_key   INT                NOT NULL COMMENT '상품고유번호',
  cart_qty   INT                NOT NULL DEFAULT 1 COMMENT '각상품수량',
  cart_size  VARCHAR(5)         NOT NULL COMMENT '상품사이즈',
  cart_rdate DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '장바구니 추가날짜',
  PRIMARY KEY (cart_key),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_key) REFERENCES ssf_user(user_key),
  CONSTRAINT fk_cart_item FOREIGN KEY (item_key) REFERENCES ssf_item(item_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* -------------------------
   6) VIEW (cartlist)
   ------------------------- */
DROP VIEW IF EXISTS view_cartlist;

CREATE VIEW view_cartlist AS
SELECT
  c.cart_key,
  c.user_key,
  u.username,
  u.email,
  i.item_key,
  i.item_name,
  i.item_list,
  i.item_content,
  i.item_price,
  i.item_sale,
  c.cart_qty,
  c.cart_size,
  c.cart_rdate,
  c.cart_qty * i.item_sale AS line_total_sale,
  c.cart_qty * i.item_price AS line_total_price,
  t.total_sale_amount,
  t.total_item_count
FROM ssf_cart AS c
INNER JOIN ssf_user AS u ON u.user_key = c.user_key
INNER JOIN ssf_item AS i ON i.item_key = c.item_key
LEFT JOIN (
  SELECT
    c.user_key,
    SUM(c.cart_qty * i.item_sale) AS total_sale_amount,
    SUM(c.cart_qty) AS total_item_count
  FROM ssf_cart AS c
  INNER JOIN ssf_item AS i ON i.item_key = c.item_key
  GROUP BY c.user_key
) AS t ON t.user_key = c.user_key;

/* -------------------------
   7) ORDER / ORDER_DETAIL
   ------------------------- */
CREATE TABLE IF NOT EXISTS ssf_order (
  order_key         INT AUTO_INCREMENT NOT NULL COMMENT '주문번호',
  order_uuid        VARCHAR(50)        NOT NULL COMMENT '주문UUID',
  user_key          VARCHAR(100)       NOT NULL COMMENT '회원고유번호',
  order_price       INT                NOT NULL COMMENT '총결제금액',
  order_card        VARCHAR(20)        NULL COMMENT '결제카드회사',
  order_status      VARCHAR(20)        NULL COMMENT '주문상태 (S:완료 R:환불)',
  order_reason      VARCHAR(300)       NULL COMMENT '환불사유',
  order_name        VARCHAR(15)        NOT NULL COMMENT '받는분성명',
  order_zipcode     VARCHAR(6)         NOT NULL COMMENT '우편번호',
  order_addr        VARCHAR(300)       NOT NULL COMMENT '받는분주소',
  order_addr_detail VARCHAR(300)       NOT NULL COMMENT '상세주소',
  order_tel         VARCHAR(15)        NOT NULL COMMENT '받는분전화번호',
  order_req         VARCHAR(100)       NULL COMMENT '배송시요청사항',
  order_date        DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '주문날짜',
  order_couponid    VARCHAR(50)        NULL COMMENT '쿠폰아이디',
  PRIMARY KEY (order_key),
  UNIQUE KEY uq_order_uuid (order_uuid),
  CONSTRAINT fk_order_user FOREIGN KEY (user_key) REFERENCES ssf_user(user_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_order_uuid ON ssf_order(order_uuid);

CREATE TABLE IF NOT EXISTS ssf_order_detail (
  order_detail_key   INT AUTO_INCREMENT NOT NULL COMMENT '주문상세번호',
  order_uuid         VARCHAR(50)        NOT NULL COMMENT '주문UUID',
  item_key           INT                NOT NULL COMMENT '상품고유번호',
  order_detail_price INT                NULL COMMENT '가격',
  order_detail_cnt   INT DEFAULT 1      NULL COMMENT '개수',
  order_detail_size  VARCHAR(10)        NOT NULL COMMENT '사이즈',
  PRIMARY KEY (order_detail_key),
  CONSTRAINT fk_order_detail_order FOREIGN KEY (order_uuid) REFERENCES ssf_order(order_uuid),
  CONSTRAINT fk_order_detail_item  FOREIGN KEY (item_key)   REFERENCES ssf_item(item_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* -------------------------
   8) FLEA MARKET
   ------------------------- */
CREATE TABLE IF NOT EXISTS flea_market (
  flea_key      INT AUTO_INCREMENT NOT NULL COMMENT '판매글번호',
  user_key      VARCHAR(100)       NOT NULL COMMENT '회원고유번호',
  flea_name     VARCHAR(15)        NOT NULL COMMENT '판매자성명',
  flea_email    VARCHAR(50)        NULL COMMENT '판매자이메일',
  flea_id       VARCHAR(50)        NOT NULL COMMENT '판매자회원id',
  flea_title    VARCHAR(150)       NOT NULL COMMENT '판매글제목',
  flea_price    INT                NOT NULL COMMENT '플리마켓가격',
  flea_category VARCHAR(100)       NOT NULL COMMENT '판매글카테고리',
  flea_content  VARCHAR(1000)      NULL COMMENT '판매글설명',
  flea_list     VARCHAR(1000)      NULL COMMENT '이미지리스트',
  flea_sale     VARCHAR(1) DEFAULT 'N' NULL COMMENT '판매여부',
  flea_rdate    DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '판매글등록/수정날짜',
  PRIMARY KEY (flea_key),
  CONSTRAINT fk_flea_user FOREIGN KEY (user_key) REFERENCES ssf_user(user_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS flea_messages (
  msg_id      BIGINT AUTO_INCREMENT NOT NULL COMMENT '문의글번호',
  flea_key    INT                   NOT NULL COMMENT '판매글번호',
  buyer_id    VARCHAR(100)          NOT NULL COMMENT '구매자 회원ID',
  seller_id   VARCHAR(100)          NOT NULL COMMENT '판매자 회원ID',
  sender_id   VARCHAR(100)          NOT NULL COMMENT '발신자 ID',
  sender_name VARCHAR(50)           NOT NULL COMMENT '발신자 이름',
  inquiry_msg TEXT                  NOT NULL COMMENT '문의 내용',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '판매글등록/수정날짜',
  read_flag   BOOLEAN DEFAULT FALSE NULL COMMENT '읽음 여부',
  PRIMARY KEY (msg_id),
  CONSTRAINT fk_flea_messages_flea FOREIGN KEY (flea_key)
    REFERENCES flea_market(flea_key) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* -------------------------
   검증용
   ------------------------- */
SHOW TABLES;
