select * from ssf_user;
select * from ssf_category;
select * from ssf_cart;
select * from ssf_item;
select * from ssf_addr;
select * from ssf_order;
select * from ssf_order_detail;
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