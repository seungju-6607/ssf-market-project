"use client";

import { useEffect } from "react";
import { axiosGet } from "@/utils/dataFetch.js";
import { useAuthStore } from "@/store/authStore.js";

export default function AuthHydrator() {
    const login = useAuthStore((s) => s.login);
    const logout = useAuthStore((s) => s.logout);
    // const setHydrating = useAuthStore((s) => s.setHydrating);

    useEffect(() => {
        (async () => {
            try {
                // refresh 쿠키 기반으로 서버가 Access 재발급/검증
                const data = await axiosGet("/auth/me");

                if (data?.authenticated) {
                    console.log("🔄 Hydrator: 새로고침 → Access Token 재발급됨", data.accessToken);
                    login({
                        userId: data.userId,
                        role: data.role,
                        accessToken: data.accessToken,
                    });
                } else {
                    logout();
                }
            } catch {
                logout();
            }
        })();
    }, [login, logout]);

    return null; // 화면에 아무것도 렌더링하지 않음
}
