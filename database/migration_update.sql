-- ============================================
-- ecommerce 데이터베이스 업데이트 스크립트
-- 작성일: 2025-10-28
-- 설명: 카카오페이 결제, 주문 관리, 고객 지원 기능 추가
-- ============================================

USE ecommerce;

-- ============================================
-- 1. orders 테이블 생성 (주문 정보)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    oid INT AUTO_INCREMENT PRIMARY KEY COMMENT '주문 ID (자동증가)',
    order_code VARCHAR(100) NOT NULL UNIQUE COMMENT '주문 코드 (UUID)',
    member_id VARCHAR(50) NOT NULL COMMENT '회원 ID',
    shipping_fee INT DEFAULT 0 COMMENT '배송비',
    discount_amount INT DEFAULT 0 COMMENT '할인 금액',
    total_amount INT NOT NULL COMMENT '총 결제 금액',
    receiver_name VARCHAR(100) NOT NULL COMMENT '수령인 이름',
    receiver_phone VARCHAR(20) NOT NULL COMMENT '수령인 전화번호',
    zipcode VARCHAR(10) COMMENT '우편번호',
    address1 VARCHAR(200) COMMENT '주소1',
    address2 VARCHAR(200) COMMENT '주소2',
    memo TEXT COMMENT '배송 메모',
    odate DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '주문 날짜',
    INDEX idx_member_id (member_id),
    INDEX idx_order_code (order_code),
    INDEX idx_odate (odate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='주문 정보';

-- ============================================
-- 2. order_detail 테이블 생성 (주문 상세 정보)
-- ============================================
CREATE TABLE IF NOT EXISTS order_detail (
    odid INT AUTO_INCREMENT PRIMARY KEY COMMENT '주문 상세 ID',
    order_code VARCHAR(100) NOT NULL COMMENT '주문 코드',
    pid INT NOT NULL COMMENT '상품 ID',
    pname VARCHAR(200) NOT NULL COMMENT '상품명',
    size VARCHAR(10) COMMENT '사이즈',
    qty INT NOT NULL COMMENT '수량',
    pid_total_price INT NOT NULL COMMENT '상품 총 가격 (단가 * 수량)',
    discount INT DEFAULT 0 COMMENT '할인 금액',
    INDEX idx_order_code (order_code),
    INDEX idx_pid (pid),
    FOREIGN KEY (order_code) REFERENCES orders(order_code) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='주문 상세 정보';

-- ============================================
-- 3. support 테이블 생성 (고객 지원/문의)
-- ============================================
CREATE TABLE IF NOT EXISTS support (
    sid INT AUTO_INCREMENT PRIMARY KEY COMMENT '지원 ID',
    title VARCHAR(200) NOT NULL COMMENT '제목',
    content TEXT COMMENT '내용',
    stype VARCHAR(50) DEFAULT 'general' COMMENT '지원 타입 (general, faq, notice 등)',
    hits INT DEFAULT 0 COMMENT '조회수',
    rdate DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
    INDEX idx_stype (stype),
    INDEX idx_rdate (rdate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='고객 지원';

-- ============================================
-- 4. view_cartlist 뷰 생성
--    (장바구니 + 상품 + 회원 정보 통합 뷰)
-- ============================================
CREATE OR REPLACE VIEW view_cartlist AS
SELECT
    m.id,
    m.name AS mname,
    m.phone,
    m.email,
    p.pid,
    p.name,
    p.info,
    p.image,
    p.price,
    c.size,
    c.qty,
    c.cid,
    (p.price * c.qty) AS totalPrice
FROM cart c
INNER JOIN member m ON c.id = m.id
INNER JOIN product p ON c.pid = p.pid;

-- ============================================
-- 5. 샘플 데이터 삽입 (선택사항)
-- ============================================

-- support 테이블 샘플 데이터
INSERT INTO support (title, content, stype, hits) VALUES
('배송 관련 문의', '배송은 얼마나 걸리나요?', 'faq', 100),
('반품 정책', '반품은 어떻게 하나요?', 'faq', 85),
('회원가입 방법', '회원가입은 어떻게 하나요?', 'general', 50),
('결제 오류 문의', '결제 중 오류가 발생했습니다.', 'general', 30),
('이벤트 공지', '10월 할인 이벤트 안내', 'notice', 200);

-- ============================================
-- 스크립트 실행 완료 확인
-- ============================================
SELECT '✅ orders 테이블 생성 완료' AS status
UNION ALL
SELECT '✅ order_detail 테이블 생성 완료'
UNION ALL
SELECT '✅ support 테이블 생성 완료'
UNION ALL
SELECT '✅ view_cartlist 뷰 생성 완료'
UNION ALL
SELECT '✅ 모든 데이터베이스 마이그레이션이 완료되었습니다!';

-- ============================================
-- 테이블 확인
-- ============================================
SHOW TABLES;

-- ============================================
-- 뷰 확인
-- ============================================
SHOW FULL TABLES WHERE Table_type = 'VIEW';
