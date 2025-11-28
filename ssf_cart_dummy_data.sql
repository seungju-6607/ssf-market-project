select * from ssf_user;
select * from ssf_category;
select * from ssf_cart;
select * from ssf_item;
select * from ssf_addr;
select * from ssf_order;
select * from ssf_order_detail;
select * from ssf_coupon;
select * from ssf_coupon_used;
show tables;

USE ssf;

INSERT INTO ssf_category (category_key, category_key2, category_name)
VALUES (1, 1001, 'women/outer') AS new
ON DUPLICATE KEY UPDATE category_name = new.category_name;

INSERT INTO ssf_item (
    item_key, category_key, item_name, item_list, item_content,
    item_price, item_sale, item_cnt
) VALUES
(10001, 1, 'Hooded Fly Light Down Jacket Grey',
 '["https://img.ssfshop.com/cmd/LB_500x660/src/https://img.ssfshop.com/goods/GOLF/25/09/03/GQPF25090350158_0_THNAIL_ORGINL_20250903112325374.jpg"]',
 'SUNLOVE 브랜드 경량 다운 자켓', 271100, 239000, 15),
(10002, 1, 'Hooded Fly Light Down Jacket Stone',
 '["https://img.ssfshop.com/cmd/LB_500x660/src/https://img.ssfshop.com/goods/GOLF/25/09/03/GQPF25090349922_0_THNAIL_ORGINL_20250903110306477.jpg"]',
 'SUNLOVE 경량 다운 자켓 Stone 색상', 271100, 239000, 20),
(10003, 1, '(우먼)라이트 시어쉘 패딩 점퍼 - 3 COLOR',
 '["https://img.ssfshop.com/cmd/LB_500x660/src/https://img.ssfshop.com/goods/ORBR/25/10/01/GPXU25100131524_0_THNAIL_ORGINL_20251002132713597.jpg"]',
 'SUARE WOMEN 라이트 패딩 점퍼', 98910, 89000, 30);

INSERT INTO ssf_item (item_key, category_key, item_name, item_price, item_sale, item_list, item_content, item_cnt)
VALUES (10004, 1, 'SUNLOVE 구스다운', 298000, 199000, '["/images/sunlove.jpg"]', '테스트 상품', 30);

INSERT INTO ssf_cart (user_key, item_key, cart_qty, cart_size, cart_rdate)
VALUES ('9fbdcb7a-7c51-4e09-9c25-0f31b39c6a92', 10001, 1, 'M', NOW());

INSERT INTO ssf_cart (user_key, item_key, cart_qty, cart_size)
VALUES
('0dd2453b-ba23-11f0-ab67-7085c26d510a', 10001, 1, 'M'),
('0dd2453b-ba23-11f0-ab67-7085c26d510a', 10002, 2, 'S'),
('0dd2453b-ba23-11f0-ab67-7085c26d510a', 10003, 1, 'FREE');

INSERT INTO ssf_addr ( user_key, addr_name, addr_zipcode, addr_main, addr_detail, addr_tel, addr_req, addr_def) VALUES
('0dd2453b-ba23-11f0-ab67-7085c26d510a',
 '홍길동',
 '06236',
 '서울특별시 강남구 테헤란로 123 (역삼동)',
 '101호',
 '010-1234-5678',
 '부재 시 경비실에 맡겨주세요.',
 'Y');
 
 select * from ssf_order;

desc ssf_order;
desc ssf_order_detail;

INSERT INTO ssf_order (
    order_uuid, user_key, order_price, order_card, order_status,
    order_reason, order_name, order_zipcode, order_addr,
    order_addr_detail, order_tel, order_req, order_date
) VALUES
('d8d21d1a-9f20-4c46-8d9c-1fabc2010001', '0dd2453b-ba23-11f0-ab67-7085c26d510a', 129000, NULL, 'S', NULL, '홍길동', '06236', '서울 강남구 테스트로 1', '101호', '010-1111-1111', '부재 시 문앞에 놔주세요.', '2025-11-14 10:00:00'),
('e3f12d12-5a14-47e8-bee3-1fabc2010002', '0dd2453b-ba23-11f0-ab67-7085c26d510a', 239000, NULL, 'S', NULL, '홍길동', '06236', '서울 강남구 테스트로 2', '102호', '010-1111-1112', NULL, '2025-11-15 10:00:00'),
('fa82e2a1-92d4-4d46-a8cd-1fabc2010003', '0dd2453b-ba23-11f0-ab67-7085c26d510a', 99000, NULL, 'S', NULL, '홍길동', '06236', '서울 강남구 테스트로 3', '103호', '010-1111-1113', NULL, '2025-11-16 10:00:00'),
('b1b32e23-7e5f-4dbb-9cd1-1fabc2010004', '0dd2453b-ba23-11f0-ab67-7085c26d510a', 198000, NULL, 'S', NULL, '홍길동', '06236', '서울 강남구 테스트로 4', '104호', '010-1111-1114', NULL, '2025-11-17 10:00:00'),
('c9121f45-4fa5-4a09-92bb-1fabc2010005', '0dd2453b-ba23-11f0-ab67-7085c26d510a', 159000, NULL, 'S', NULL, '홍길동', '06236', '서울 강남구 테스트로 5', '105호', '010-1111-1115', '빠른 배송 부탁드립니다.', '2025-11-18 10:00:00'),
('fd842e67-9912-4f08-8899-1fabc2010006', '0dd2453b-ba23-11f0-ab67-7085c26d510a', 189000, NULL, 'S', NULL, '홍길동', '06236', '서울 강남구 테스트로 6', '106호', '010-1111-1116', NULL, '2025-11-19 10:00:00'),
('aa213fe2-134a-4fbb-b182-1fabc2010007', '0dd2453b-ba23-11f0-ab67-7085c26d510a', 239000, NULL, 'S', NULL, '홍길동', '06236', '서울 강남구 테스트로 7', '107호', '010-1111-1117', NULL, '2025-11-20 10:00:00'),
('ce921bc1-7714-455a-a8b2-1fabc2010008', '0dd2453b-ba23-11f0-ab67-7085c26d510a', 129000, NULL, 'S', NULL, '홍길동', '06236', '서울 강남구 테스트로 8', '108호', '010-1111-1118', NULL, '2025-11-21 10:00:00'),
('da72ce15-41b3-4cce-bb11-1fabc2010009', '0dd2453b-ba23-11f0-ab67-7085c26d510a', 99000, NULL, 'S', NULL, '홍길동', '06236', '서울 강남구 테스트로 9', '109호', '010-1111-1119', NULL, '2025-11-22 10:00:00'),
('ab41de94-6f51-4b8a-b2cd-1fabc2010010', '0dd2453b-ba23-11f0-ab67-7085c26d510a', 279000, NULL, 'S', NULL, '홍길동', '06236', '서울 강남구 테스트로 10', '110호', '010-1111-1120', NULL, '2025-11-23 10:00:00'),
('ee91fa11-2a11-4772-88bd-1fabc2010011', '0dd2453b-ba23-11f0-ab67-7085c26d510a', 249000, NULL, 'S', NULL, '홍길동', '06236', '서울 강남구 테스트로 11', '111호', '010-1111-1121', NULL, '2025-11-24 10:00:00');


INSERT INTO ssf_order_detail (
    order_uuid, item_key, order_detail_price, order_detail_cnt, order_detail_size
) VALUES
('d8d21d1a-9f20-4c46-8d9c-1fabc2010001', 10001, 129000, 1, 'M'),
('e3f12d12-5a14-47e8-bee3-1fabc2010002', 10001, 239000, 1, 'S'),
('fa82e2a1-92d4-4d46-a8cd-1fabc2010003', 10001, 99000, 1, 'M'),
('b1b32e23-7e5f-4dbb-9cd1-1fabc2010004', 10001, 99000, 1, 'S'),
('b1b32e23-7e5f-4dbb-9cd1-1fabc2010004', 10001, 99000, 1, 'M'),
('c9121f45-4fa5-4a09-92bb-1fabc2010005', 10001, 159000, 1, 'M'),
('fd842e67-9912-4f08-8899-1fabc2010006', 10001, 189000, 1, 'S'),
('aa213fe2-134a-4fbb-b182-1fabc2010007', 10001, 239000, 1, 'S'),
('ce921bc1-7714-455a-a8b2-1fabc2010008', 10001, 129000, 1, 'S'),
('da72ce15-41b3-4cce-bb11-1fabc2010009', 10001, 99000, 1, 'M'),
('ab41de94-6f51-4b8a-b2cd-1fabc2010010', 10001, 139500, 1, 'S'),
('ab41de94-6f51-4b8a-b2cd-1fabc2010010', 10001, 139500, 1, 'M'),
('ee91fa11-2a11-4772-88bd-1fabc2010011', 10001, 249000, 1, 'M');

SET SQL_SAFE_UPDATES = 0;
delete from ssf_order_detail;
delete from ssf_order;

INSERT INTO ssf_coupon (
    coupon_id,
    coupon_name,
    coupon_cost,
    expire_at
) VALUES (
    '0d8c39a1-77fc-4a3e-a29d-1acb311e97f4',
    '신규가입 10,000원 할인쿠폰',
    10000,
    '2099-12-31'
);

INSERT INTO ssf_coupon_used (
    coupon_id,
    user_key,
    used_yn
) VALUES (
    '0d8c39a1-77fc-4a3e-a29d-1acb311e97f4',
    '0dd2453b-ba23-11f0-ab67-7085c26d510a',
    'N'
);

