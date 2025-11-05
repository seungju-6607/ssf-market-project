export function signupApi(payload) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const exists = users.some(u => u.email === payload.email);
  if (exists) return { ok: false, message: "이미 가입된 이메일입니다." };
  const next = [...users, { ...payload, role: "user", joinedAt: Date.now() }];
  localStorage.setItem("users", JSON.stringify(next));
  return { ok: true };
}

export function loginApi({ email, password }) {
  if (email === "admin" && password === "1234") {
    const token = "admin-token";
    localStorage.setItem("auth", JSON.stringify({ email, role: "admin", token }));
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("loginUser", JSON.stringify({ name: "관리자", email }));
    return { ok: true, role: "admin", user: { name: "관리자", email } };
  }
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." };
  const token = "user-token";
  localStorage.setItem("auth", JSON.stringify({ email: user.email, role: "user", token }));
  localStorage.setItem("isLogin", "true");
  localStorage.setItem("loginUser", JSON.stringify({ name: user.name, email: user.email }));
  return { ok: true, role: "user", user: { name: user.name, email: user.email } };
}

export function logoutApi() {
  localStorage.removeItem("auth");
  localStorage.setItem("isLogin", "false");
  localStorage.removeItem("loginUser");
}

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem("auth") || "null");
  } catch {
    return null;
  }
}

// 네이버 로그인 API
export function naverLoginApi(userData) {
  const user = {
    email: userData.email,
    name: userData.name,
    role: "user",
    loginType: "naver",
    naverId: userData.id
  };

  const token = "naver-user-token-" + Date.now();
  localStorage.setItem("auth", JSON.stringify({ email: user.email, role: "user", token }));
  localStorage.setItem("isLogin", "true");
  localStorage.setItem("loginUser", JSON.stringify(user));

  // 이벤트 발행
  window.dispatchEvent(new Event("auth:changed"));

  return { ok: true, role: "user", user };
}

// 카카오 로그인 API
export function kakaoLoginApi(userData) {
  const user = {
    email: userData.email,
    name: userData.name,
    role: "user",
    loginType: "kakao",
    kakaoId: userData.id
  };

  const token = "kakao-user-token-" + Date.now();
  localStorage.setItem("auth", JSON.stringify({ email: user.email, role: "user", token }));
  localStorage.setItem("isLogin", "true");
  localStorage.setItem("loginUser", JSON.stringify(user));

  // 이벤트 발행
  window.dispatchEvent(new Event("auth:changed"));

  return { ok: true, role: "user", user };
}
