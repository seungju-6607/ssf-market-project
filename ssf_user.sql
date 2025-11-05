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

desc ssf_user;
select * from ssf_user;
select * from ssf_addr;

-- INSERT INTO ssf_user (user_key, email, username, userpwd, banned, signout, signin, snsprov, snsid, referralId) 
-- VALUES ( UUID() , "test", "test", "test", "N", "N", now(), "test", "test", "test");

DELETE FROM ssf_user;



