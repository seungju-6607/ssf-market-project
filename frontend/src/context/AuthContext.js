// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * 로그인 상태 유지 전략
 * - 로그인 성공 시: localStorage("loginUser")에 사용자 객체 저장, "isLogin" = "true"
 * - 앱 시작/새로고침 시: localStorage에서 복원
 * - 로그아웃: localStorage 정리
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // { id, name, email, ... } 형태 가정
  const [ready, setReady] = useState(false);   // 복원 완료 여부 (깜박임 방지용)

  // ✅ 앱 시작/새로고침 시 로그인 사용자 복원
  useEffect(() => {
    try {
      let parsedUser = null;

      // 1) loginUser가 있으면 최우선 사용
      const savedLoginUser = localStorage.getItem("loginUser");
      if (savedLoginUser) {
        try {
          parsedUser = JSON.parse(savedLoginUser);
        } catch {
          parsedUser = null;
        }
      }

      // 2) loginUser가 없거나 name이 없으면 loginInfo를 참고
      if (!parsedUser || !parsedUser.name) {
        const savedLoginInfo = localStorage.getItem("loginInfo");
        if (savedLoginInfo) {
          try {
            const info = JSON.parse(savedLoginInfo);

            // 👇 로그인 응답 구조에 따라 알아서 골라서 매핑
            const name =
              info.name ||
              info.userName ||
              info.username ||
              info.memberName ||
              info.nickname ||
              "";

            const id =
              info.id ||
              info.userId ||
              info.memberId ||
              info.loginId ||
              "";

            const email = info.email || info.userEmail || "";

            parsedUser = {
              id,
              name,
              email,
              raw: info, // 혹시 나중에 디버깅할 때 쓰라고 원본도 넣어둠
            };
          } catch {
            // loginInfo 파싱 실패 시 무시
          }
        }
      }

      setUser(parsedUser || null);
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  // ✅ 신규 회원 웰컴 쿠폰 발급 (중복 방지)
  const issueWelcomeCouponIfNeeded = () => {
    const savedCoupons = JSON.parse(localStorage.getItem("coupons") || "[]");
    const hasWelcomeCoupon = savedCoupons.some((c) => c.id === "welcome-10000");

    if (!hasWelcomeCoupon) {
      const newCoupon = {
        id: "welcome-10000",
        name: "신규가입 1만원 할인 쿠폰",
        amount: 10000,
        type: "fixed",
        discount: "₩10,000",
        used: false,
        createdAt: new Date().toISOString(),
      };

      const updatedCoupons = [...savedCoupons, newCoupon];
      // localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
    }
  };

  return (
    <AuthContext.Provider value={{ user, ready, issueWelcomeCouponIfNeeded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
