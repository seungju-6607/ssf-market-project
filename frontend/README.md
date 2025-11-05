# E-commerce Frontend

React 19 + Redux Toolkit 기반의 이커머스 프론트엔드 애플리케이션입니다.

## 기술 스택

- **React** 19.1.1
- **Redux Toolkit** 2.9.0
- **React Router** 7.9.1
- **Axios** 1.12.2
- **React Icons** 5.5.0

## 프로젝트 구조

```
src/
├── app/                    # Redux Store 설정
│   └── store.js
├── feature/                # Redux Toolkit 기능별 slice
│   ├── auth/              # 인증 관련
│   ├── cart/              # 장바구니 관련
│   └── product/           # 상품 관련
├── components/            # 재사용 가능한 컴포넌트
│   ├── commons/          # 공통 컴포넌트 (Header, Footer 등)
│   ├── detailTabs/       # 상품 상세 탭
│   └── product/          # 상품 관련 컴포넌트
├── pages/                # 페이지 컴포넌트
├── styles/               # CSS 파일
└── utils/                # 유틸리티 함수
```

## 주요 기능

- 상품 목록 및 상세 조회
- 장바구니 관리
- 회원 인증 (로그인/회원가입)
- 주문/결제
- 고객 지원

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build
```

## 환경 설정

- **Backend API Proxy**: `http://localhost:8080`
- **개발 서버 포트**: `3000`

## 상태 관리

Redux Toolkit을 사용하여 전역 상태를 관리합니다:
- **auth**: 로그인 상태 관리
- **cart**: 장바구니 상태 관리
- **product**: 상품 목록 및 상세 정보 관리

## 라우팅

- `/` - 홈
- `/all` - 전체 상품
- `/products/:pid` - 상품 상세
- `/cart` - 장바구니 (로그인 필요)
- `/checkout` - 주문/결제 (로그인 필요)
- `/login` - 로그인
- `/signup` - 회원가입
- `/support` - 고객 지원 (로그인 필요)
