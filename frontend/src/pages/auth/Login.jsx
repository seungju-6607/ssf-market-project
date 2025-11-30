// src/pages/auth/Login.jsx
import "../../styles/Auth.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getLogin } from "../../feature/auth/authAPI.js";
import { useAuth } from "../../context/AuthContext";
import NaverLoginButton from "../../components/auth/NaverLoginButton";
import KakaoLoginButton from "../../components/auth/KakaoLoginButton";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState("member");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const idRef = useRef(null);
  const passwordRef = useRef(null);
  const [form, setForm] = useState({ id: "", password: "" });
  const [error, setError] = useState("");

  const redirectTo =
    location.state?.from?.pathname && location.state.from.pathname !== "/login"
      ? location.state.from.pathname
      : "/";

  useEffect(() => {
    const statePrefill = location?.state?.prefill;
    let lsPrefill = null;
    try { lsPrefill = JSON.parse(localStorage.getItem("prefillLogin")); } catch {}
    const prefill = statePrefill || lsPrefill;
    if (prefill?.id) setForm((p) => ({ ...p, id: prefill.id }));
    if (lsPrefill) localStorage.removeItem("prefillLogin");

    const savedId = localStorage.getItem("savedLoginId");
    if (savedId) {
      setForm((p) => ({ ...p, id: savedId }));
      setRememberMe(true);
    }
  }, [location?.state]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const success = await dispatch(getLogin(form, { idRef, passwordRef }));
    if (!success) {
      alert("로그인에 실패, 확인 후 다시 진행해주세요.");
      setForm({ id: "", password: "" });
      idRef.current?.focus();
      return;
    }

    if (rememberMe) {
      localStorage.setItem("savedLoginId", form.id.trim());
    } else {
      localStorage.removeItem("savedLoginId");
    }

    // getLogin이 저장한 사용자 객체 동기화
    let u = null;
    try { u = JSON.parse(localStorage.getItem("loginUser") || "null"); } catch {}
    if (u) {
      login(u); // AuthContext에 즉시 반영
    } else {
      // loginUser가 없더라도 최소 정보로 컨텍스트 업데이트 시도
      const fallback = {
        id: form.id.trim(),
        email: form.id.trim(),
        name: form.id.includes("@") ? form.id.split("@")[0] : form.id,
        role: "user",
      };
      localStorage.setItem("loginUser", JSON.stringify(fallback));
      localStorage.setItem("isLogin", "true");
      login(fallback);
    }

    try { window.dispatchEvent(new Event("auth:changed")); } catch {}
    alert("로그인에 성공하였습니다.");
    navigate(redirectTo);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">로그인</h1>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="login-form-layout">
            <div className="login-inputs-section">
              <input
                type="text"
                name="id"
                placeholder="이메일"
                value={form.id}
                ref={idRef}
                onChange={onChange}
                required
              />

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="비밀번호"
                  value={form.password}
                  ref={passwordRef}
                  onChange={onChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    )}
                  </svg>
                </button>
              </div>

              {error && <p className="auth-error">{error}</p>}
            </div>

            <div className="login-button-section">
              <button type="submit" className="auth-submit">로그인</button>
            </div>
          </div>

          <div className="remember-me-section">
            <label className="remember-me-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>자동 로그인</span>
            </label>
          </div>
        </form>

        <div className="auth-links-box">
          <Link to="/account/recovery">아이디 찾기</Link>
          <Link to="/account/recovery" state={{ mode: "pw" }}>비밀번호 찾기</Link>
          <Link to="/signup">회원가입</Link>
        </div>

        <div className="sns-login-divider">
          <span>SNS 계정으로 로그인</span>
        </div>

        <div className="sns-login">
          <KakaoLoginButton />
          <NaverLoginButton />
        </div>

        <button
          type="button"
          className="non-member-order-btn"
          onClick={() => navigate("/orders/guest")}
        >
          비회원 주문 조회
        </button>
      </div>
    </div>
  );
}
