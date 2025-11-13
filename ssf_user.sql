/* 데이터베이스 생성*/
create database ssf;

/* 데이터베이스 열기 */
use ssf;
select database();

/* 테이블 목록 확인 */
show tables;
drop table ssf_user;

/****************************************
* 작업내용 : user 테이블 생성
* 작성자 : 김소현
* 수정이력 : 
	2025-10-28	최초 생성
* 사용예시 : desc ssf_user;
****************************************/
CREATE TABLE `ssf_user` (
	`user_key`		VARCHAR(100)	primary key		COMMENT '회원고유번호',
	`email`			VARCHAR(50)		NOT NULL		COMMENT '이메일',
	`username`		VARCHAR(20)		NOT NULL		COMMENT '이름',
	`userpwd`		VARCHAR(100)	NOT NULL		COMMENT '비밀번호',
	`banned`		VARCHAR(1)		NULL			COMMENT '정지여부',
	`signout`		VARCHAR(1)		NULL			COMMENT '회원탈퇴여부',
	`signin`		DATETIME		NOT NULL		COMMENT '가입날짜',
	`snsprov`		VARCHAR(100)	NULL			COMMENT 'SNS제공자종류',
	`snsid`			VARCHAR(100)	NULL			COMMENT '사용자SNS고유ID',
	`referralId`	VARCHAR(100)	NULL			COMMENT '추천인ID',
    `phone`			VARCHAR(13)		NULL			COMMENT '휴대전화번호',
    `role`			VARCHAR(13)		NOT NULL		COMMENT '권한구분코드'
);


/****************************************
* 작업내용 : 주소 테이블 생성
* 작성자 : 박도윤
* 수정이력 : 
	2025-10-28	최초 생성
* 사용예시 : desc ssf_addr;
****************************************/
use ssf;
show tables;

CREATE TABLE ssf_addr (
	addr_key			INT		AUTO_INCREMENT		NOT NULL		COMMENT '배송지고유코드',
	user_key			VARCHAR(100)				NOT NULL		COMMENT '회원고유번호',
	addr_name			VARCHAR(15)					NOT NULL		COMMENT '받는분성명',
	addr_zipcode		VARCHAR(6)					NOT NULL		COMMENT '우편번호',
	addr_main			VARCHAR(300)				NOT NULL		COMMENT '받는분주소',
	addr_detail			VARCHAR(100)				NOT NULL		COMMENT '상세주소',
	addr_tel			VARCHAR(15)					NOT NULL		COMMENT '받는분전화번호',
	addr_req			VARCHAR(100)				NULL			COMMENT '배송시요청사항',
	addr_def			VARCHAR(1)					NULL			COMMENT '기본배송지여부',
    PRIMARY KEY (addr_key),
    CONSTRAINT fk_ssf_addr_ssf_user FOREIGN KEY(user_key)	references ssf_user(user_key)
);


/****************************************
* 작업내용 : 상품 카테고리, 상품 테이블 생성
* 작성자 : 박도윤
* 수정이력 : 
	2025-11-06	최초 생성
* 사용예시 : desc ssf_item;
****************************************/
use ssf;
show tables;

CREATE TABLE ssf_category (
	category_key		INT		AUTO_INCREMENT		NOT NULL		COMMENT '카테고리고유번호',
	category_key2		INT							NULL			COMMENT '카테고리고유번호2',
	category_name		VARCHAR(150)				NOT NULL		COMMENT '카테고리명',
    PRIMARY KEY (category_key)
);

CREATE TABLE ssf_item (
	item_key			INT			AUTO_INCREMENT				NOT NULL		COMMENT '상품고유번호',
	category_key		INT										NOT NULL		COMMENT '카테고리고유번호',
	item_name			VARCHAR(150)							NOT NULL		COMMENT '상품명',
	item_list			JSON									NOT NULL		COMMENT '이미지리스트',
	item_content		VARCHAR(1000)							NULL			COMMENT '상품상세',
	item_price			INT										NOT NULL		COMMENT '정가',
	item_sale			INT										NOT NULL		COMMENT '판매가',
	item_rdate			DATETIME	DEFAULT CURRENT_TIMESTAMP	NULL			COMMENT '등록일',
	item_cnt			INT										NOT NULL		COMMENT '재고',
    item_deleted		VARCHAR(1)	DEFAULT 'N'					NULL			COMMENT '삭제여부',
    PRIMARY KEY (item_key),
    CONSTRAINT fk_ssf_item_ssf_category FOREIGN KEY(category_key)	references ssf_category(category_key)
);


/****************************************
* 작업내용 : 장바구니 테이블 생성
* 작성자 : 박도윤
* 수정이력 : 
	2025-11-07	최초 생성
* 사용예시 : desc ssf_cart;
****************************************/
CREATE TABLE ssf_cart (
	cart_key			INT				AUTO_INCREMENT				NOT NULL					COMMENT '장바구니고유번호',
	user_key			VARCHAR(100)								NOT NULL					COMMENT '회원고유번호',
	item_key			INT											NOT NULL					COMMENT '상품고유번호',
	cart_qty			INT											NOT NULL		DEFAULT 1	COMMENT '각상품수량',
	cart_size			VARCHAR(5)									NOT NULL					COMMENT '상품사이즈',
	cart_rdate			DATETIME	DEFAULT CURRENT_TIMESTAMP		NULL						COMMENT '장바구니 추가날짜',
    PRIMARY KEY (cart_key),
    CONSTRAINT fk_ssf_cart_ssf_user FOREIGN KEY(user_key)	references ssf_user(user_key),
    CONSTRAINT fk_ssf_cart_ssf_item FOREIGN KEY(item_key)	references ssf_item(item_key)
);


/***************************************************************************
* 작업내용 : 장바구니 리스트 VIEW 생성
* 작성자 : 박도윤
* 수정이력 : 
	2025-11-07	최초 생성
* 사용예시 : desc view_cartlist;
*****************************************************************************/
drop view view_cartlist;
select * from information_schema.views where table_name='view_cartlist';
create view view_cartlist
as
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
     c.cart_qty * i.item_sale AS line_total_sale, -- 장바구니 한줄 할인금액
     c.cart_qty * i.item_price AS line_total_price, -- 장바구니 한줄 금액
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
) AS t ON t.user_key = c.user_key
LIMIT 0, 1000;

 desc view_cartlist;
 
 
 /****************************************
* 작업내용 : 주문, 주문상세 테이블 생성
* 작성자 : 박도윤
* 수정이력 : 
	2025-11-12	최초 생성
* 사용예시 : desc ssf_order;
		   desc ssf_order_detail;
****************************************/
CREATE TABLE ssf_order (
	order_key			INT				AUTO_INCREMENT				NOT NULL					COMMENT '주문번호',
	user_key			VARCHAR(100)								NOT NULL					COMMENT '회원고유번호',
	order_price			INT											NOT NULL					COMMENT '총결제금액',
    order_card			VARCHAR(20)									NULL						COMMENT '결제카드회사',
    order_status		VARCHAR(20)									NULL						COMMENT '주문상태 (S:완료 R:환불)',
    order_reason		VARCHAR(300)								NULL						COMMENT '환불사유',
    order_name			VARCHAR(15)									NOT NULL					COMMENT '받는분성명',
    order_zipcode		VARCHAR(6)									NOT NULL					COMMENT '우편번호',
    order_addr			VARCHAR(300)								NOT NULL					COMMENT '받는분주소',
    ordder_addr_detail	VARCHAR(300)								NOT NULL					COMMENT '상세주소',
    order_tel			VARCHAR(15)									NOT NULL					COMMENT '받는분전화번호',
	order_req			VARCHAR(100)								NULL						COMMENT '배송시요청사항',
    order_item_cnt		INT											NULL						COMMENT '주문상품개수',
    order_item_name		VARCHAR(150)								NULL						COMMENT '대표상품',
    order_item_img		VARCHAR(600)								NULL						COMMENT '대표이미지',
    PRIMARY KEY (order_key),
    CONSTRAINT fk_ssf_order_ssf_user FOREIGN KEY(user_key)	references ssf_user(user_key)
);

CREATE TABLE ssf_order_detail (
	order_detail_key 	INT				AUTO_INCREMENT				NOT NULL					COMMENT '주문상세번호',
	order_key			INT											NOT NULL					COMMENT '주문번호',
	item_key			INT											NOT NULL					COMMENT '상품고유번호',
    order_detail_price	INT											NULL						COMMENT '가격',
    order_detail_cnt	INT				DEFAULT 1					NULL						COMMENT '개수',
    PRIMARY KEY (order_detail_key),
    CONSTRAINT fk_ssf_order_detail_ssf_order FOREIGN KEY(order_key)	references ssf_order(order_key),
    CONSTRAINT fk_ssf_order_detail_ssf_item FOREIGN KEY(item_key)	references ssf_item(item_key)
);




















