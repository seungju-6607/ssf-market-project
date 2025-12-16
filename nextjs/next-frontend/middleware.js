import { NextResponse } from "next/server";

export function middleware(req) {
    const refreshToken = req.cookies.get("refreshToken")?.value; // 또는 refreshToken 사용 가능
console.log("middleware :: Next.js console 출력 -------------------->>",req.headers, refreshToken);
    if (req.nextUrl.pathname.startsWith("/cart") || req.nextUrl.pathname.startsWith("/support")) {
        if (!refreshToken) {
            const loginUrl = new URL("/login", req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/cart",
        "/support"
    ]
};
