# ssf-market-project
[🎬 프로젝트 시연 영상 보기](https://github.com/ssojja/ssf-market-project/blob/main/ssf-market-project.mp4)

&nbsp;
SSF Shop을 벤치마킹한 **풀스택 쇼핑몰 프로젝트** (React + Redux + Spring Boot)

[![Java](https://img.shields.io/badge/Java-21-007396?logo=java)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.6-6DB33F?logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org)
[![Redux](https://img.shields.io/badge/Redux-2.9.0-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com/)

---

## 📌 프로젝트 개요

본 프로젝트는 패션 쇼핑몰 **[SSF Shop](https://www.ssfshop.com)**을 모델로 구현한 **Multi-module Gradle 풀스택 웹 애플리케이션**입니다.

Spring Boot를 기반으로 한 백엔드와 React 및 Redux Toolkit을 기반으로 한 프론트엔드로 구성된 시스템으로, 실무 수준의 쇼핑몰 구현과 협업형 개발 프로세스를 경험하는 것을 목표로 합니다.

**프로젝트 특징**
- **멀티 모듈 구조** : Gradle 기반 backend + frontend 통합 프로젝트
- **JPA** : JPA(Hibernate) 기반으로 데이터베이스 연동
- **Redux Toolkit** : 전역 상태 관리 (cart, product, auth 등)
- **React Router** : 최신 라우팅 라이브러리
- **Spring Security** : BCrypt 암호화, CORS 설정

---

## 🎯 주요 목표

- ✅ **쇼핑몰 핵심 기능 구현** : 상품 검색/필터, 장바구니, 주문, 결제, 사용자 관리, 플리마켓
- ✅ **프론트엔드/백엔드 모듈화** : 컴포넌트 기반 개발 및 상태 관리 확립
- ✅ **REST API 설계** : 백엔드 API와 프론트엔드 연동
- 🚧 **보안 강화** : JWT 기반 인증, OAuth2 소셜 로그인

---

## 👥 구성원 및 역할 분담
| 구성원 이름          | 역할                                                         |
| ----------------------- | ------------------------------------------------------------ |
|       `김소현`        | `데이터베이스 설계(크롤링 Data DB구축, DB생성)` & `REST API 개발(회원가입, 소셜 API 로그인, 플리마켓, 관리자 회원관리)`|
|       `박도윤`        | `데이터베이스 설계(DB생성)` & `REST API 개발(로그인, 장바구니, 결제, 관리자 주문관리)` & `Spring Security 설정` |
|       `하승주`        | `컴포넌트 기반 설계 및 개발` & `데이터베이스 설계(DB생성)` & `REST API 개발(위시리스트)` |


---

## 🛠️ 기술 스택

### Backend (Spring Boot) / Frontend (React)

| 구분  | 기술명 | 구분  | 기술명 |
|------|------------|------|------------|
| **프로그래밍 언어** | Java | **프레임워크** | React |
| **프레임워크** | Spring Boot | **상태 관리** | Redux Toolkit |
| **빌드 도구** | Gradle | **라우팅** | React Router |
| **데이터베이스** | MySQL | **HTTP 클라이언트** | Axios |
| **JDBC 드라이버** | MySQL Connector | **아이콘** | React Icons |
| **보안** | Spring Security | **빌드 도구** | React Scripts (CRA) |
| **유틸리티** | Lombok | - | - |

**상태 관리 전략**
- **Redux Toolkit** : 전역 상태 (cart, product, auth 등)
- **React Context** : 컴포넌트 트리 전체 공유

---

## 📂 프로젝트 구조

```
ssf-market-project/
├── backend/                          # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/springboot/ssf-market-project/
│   │   │   │   ├── config/          # Spring Security 설정
│   │   │   │   ├── controller/      # REST API 컨트롤러
│   │   │   │   ├── dto/             # 데이터 전송 객체
│   │   │   │   ├── entity/          # 엔티티
│   │   │   │   ├── repository/      # 데이터 액세스
│   │   │   │   └── service/         # 비즈니스 로직
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/
│   │   └── test/
│   ├── uploads/                      # 플리마켓 첨부 이미지 관리 폴더
│   └── build.gradle
│
├── frontend/                         # React 프론트엔드
│   ├── node_modules/
│   ├── public/
│   │   ├── data/                    # JSON 데이터 (초기/참조)
│   │   ├── images/                  # 상품/배너 이미지
│   │   └── index.html
│   ├── src/
│   │   ├── app/                     # Redux Store
│   │   ├── components/              # 재사용 컴포넌트
│   │   ├── context/                 # React Context
│   │   ├── feature/                 # Redux Slices & API
│   │   ├── hooks/                   # 커스텀 훅
│   │   ├── pages/                   # 페이지 컴포넌트
│   │   ├── styles/                  # CSS 파일
│   │   ├── utils/                   # 유틸리티 함수
│   │   └── App.js
│   └── package.json
│
├── gradle/                           # Gradle Wrapper
├── build.gradle                      # 루트 Gradle 설정
├── settings.gradle                   # 모듈 설정
└── README.md
```

---

## ✨ 주요 기능

### 🛍️ 상품 기능
- **상품 탐색** : 카테고리별 상품 목록, 검색, 필터링
- **상품 상세** : 이미지 갤러리, 옵션 선택, 상세 정보, 바로 결제
- **상품 Q&A** : 상품 문의 및 답변
- **반품 정보** : 반품/교환 정책 안내

### 🛒 장바구니 & 주문
- **장바구니** : 상품 추가/삭제/수량 변경, Cart DB 저장
- **주문/결제** : 주문 정보 입력, 결제 수단 선택
- **주문 내역** : 주문 조회 및 상태 확인

### 👤 사용자 관리
- **회원가입/로그인** : BCrypt 암호화, Spring Security, API 연동 로그인, ID/PW 찾기
- **마이페이지** : 주문 내역, 위시리스트, 비밀번호 변경, 내 플리마켓, 플리마켓 판매글 올리기
- **마이페이지(관리자)** : 관리자 대시보드, 주문관리
- **인증/보안** : CORS 설정, 세션 관리

### 🤝 플리마켓
- **상품 검색** : 카테고리별 상품 목록, 검색, 필터링
- **판매글 관리** : 판매글 추가/수정/삭제 및 상태 변경, 문의 인박스

### 📊 관리자 기능
- 주문 관리 (기간별 주문 조회 및 상세 내역 확인)
- 회원 관리 (회원 목록 조회, 회원 가입 상태 변경)

---

## 🗄️ 데이터베이스 ERD 구조(MySQL 8.0)

<img width="1408" height="853" alt="image" src="https://github.com/user-attachments/assets/7cc1a546-a6fd-428e-9ea7-6cb1d69957d0" />

---

## 🔄 개발 프로세스

1. **요구사항 정의** : 기능/화면/DB 설계
2. **환경 세팅** : GitHub 브랜치 전략, 초기 프로젝트 구조
3. **백엔드 개발** : REST API 구현, 데이터베이스 스키마
4. **프론트엔드 개발** : 컴포넌트 개발, Redux, API 연동
5. **통합 및 테스트** : E2E 테스트, UI/UX 개선

---

## 🌐 배포 현황

- **개발 환경**
  - Backend : `http://localhost:8080`
  - Frontend : `http://localhost:3000`

- **프로덕션** : 배포 예정

---

## 📖 참고 자료

- [SSF Shop 공식 사이트](https://www.ssfshop.com) - 벤치마킹 대상
- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [React 공식 문서](https://react.dev)
- [Redux Toolkit 공식 문서](https://redux-toolkit.js.org/)
- [React Router v7 문서](https://reactrouter.com)

---

## 🙏 감사의 글

SSF Shop을 벤치마킹 대상으로 선정하여 실무 수준의 쇼핑몰 구현 경험을 쌓을 수 있었습니다.
협업 과정을 통해 Git, 코드 리뷰, 문서화 등 실무 프로세스를 체험할 수 있었습니다.

---

**프로젝트 버전** : 1.0.0
**최종 업데이트** : 2025-12-19
**벤치마킹** : [SSF Shop](https://www.ssfshop.com)
