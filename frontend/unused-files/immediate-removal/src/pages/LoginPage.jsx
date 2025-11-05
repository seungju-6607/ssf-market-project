import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function LoginPage() {
  const { isLogin, userId, handleLogin, handleLogout } = useContext(AuthContext);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const success = handleLogin(id, pw);
    if (!success) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    } else {
      setError("");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "50px auto" }}>
      <h1>로그인</h1>

      {isLogin ? (
        <div>
          <p>{userId}님 환영합니다 🎉</p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <button type="submit">로그인</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default LoginPage;
