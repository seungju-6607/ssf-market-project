import React, { useEffect, useState } from "react";
import "../../styles/Auth.css";

export default function AccountRecovery() {
  const [mode, setMode] = useState("id");
  const [nameForId, setNameForId] = useState("");
  const [foundId, setFoundId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [count, setCount] = useState(5);
  const [newPass, setNewPass] = useState("");
  const [newPassCheck, setNewPassCheck] = useState("");

  const getUser = () => {
    try { return JSON.parse(localStorage.getItem("userData")); } catch { return null; }
  };

  const maskEmail = (v) => {
    if (!v || !v.includes("@")) return v || "";
    const [id, dom] = v.split("@");
    const head = id.slice(0, Math.max(1, Math.ceil(id.length / 3)));
    return `${head}${"*".repeat(Math.max(3, id.length - head.length))}@${dom}`;
  };

  const handleFindId = (e) => {
    e.preventDefault();
    const user = getUser();
    if (!user) { alert("가입 정보가 없습니다."); return; }
    if (!nameForId.trim()) { alert("이름을 입력해 주세요."); return; }
    if (user.name === nameForId.trim()) {
      setFoundId(maskEmail(user.email));
      alert(`아이디 찾기 결과: ${maskEmail(user.email)}`);
    } else {
      alert("일치하는 사용자 정보가 없습니다.");
      setFoundId("");
    }
  };

  useEffect(() => {
    let timer;
    if (verifying) {
      setCount(5);
      timer = setInterval(() => {
        setCount((c) => {
          if (c <= 1) {
            clearInterval(timer);
            setVerifying(false);
            setVerified(true);
            alert("인증이 완료되었습니다.");
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [verifying]);

  const handleVerify = () => {
    const user = getUser();
    if (!user) { alert("가입 정보가 없습니다."); return; }
    if (!email.trim()) { alert("이메일을 입력해 주세요."); return; }
    if (!name.trim()) { alert("이름을 입력해 주세요."); return; }
    if (user.email !== email.trim() || user.name !== name.trim()) { alert("이메일 또는 이름이 일치하지 않습니다."); return; }
    setVerified(false);
    setVerifying(true);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const user = getUser();
    if (!user) { alert("가입 정보가 없습니다."); return; }
    if (!verified) { alert("이메일 인증을 완료해 주세요."); return; }
    if (!newPass) { alert("새 비밀번호를 입력해 주세요."); return; }
    if (newPass.length < 6) { alert("비밀번호는 6자 이상이어야 합니다."); return; }
    if (!newPassCheck) { alert("비밀번호 확인을 입력해 주세요."); return; }
    if (newPass !== newPassCheck) { alert("비밀번호가 일치하지 않습니다."); return; }
    const updated = { ...user, password: newPass };
    localStorage.setItem("userData", JSON.stringify(updated));
    alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
    window.location.href = "http://localhost:3000/#/login";
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">아이디/비밀번호 찾기</h1>

        <div className="tab-row" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button className={`auth-submit ${mode === "id" ? "active" : ""}`} type="button" onClick={() => setMode("id")}>아이디 찾기</button>
          <button className={`auth-submit ${mode === "pw" ? "active" : ""}`} type="button" onClick={() => setMode("pw")}>비밀번호 변경</button>
        </div>

        {mode === "id" && (
          <form className="auth-form" onSubmit={handleFindId}>
            <div>
              <label>이름</label>
              <input type="text" value={nameForId} onChange={(e) => setNameForId(e.target.value)} placeholder="가입 시 이름" />
            </div>
            <button className="auth-submit" type="submit">아이디 찾기</button>
            {foundId && <div className="notice success" style={{ marginTop: 12 }}>아이디: {foundId}</div>}
          </form>
        )}

        {mode === "pw" && (
          <>
            <div className="auth-form">
              <div>
                <label>이메일</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div>
                <label>이름</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="가입 시 이름" />
              </div>
              <button className="auth-submit" type="button" onClick={handleVerify} disabled={verifying}>
                {verifying ? `이메일 인증 중... ${count}s` : verified ? "인증 완료" : "이메일 인증"}
              </button>
            </div>

            <form className="auth-form" onSubmit={handleChangePassword}>
              <div>
                <label>새 비밀번호</label>
                <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="6자 이상" />
              </div>
              <div>
                <label>비밀번호 확인</label>
                <input type="password" value={newPassCheck} onChange={(e) => setNewPassCheck(e.target.value)} placeholder="비밀번호 재입력" />
              </div>
              <button className="auth-submit" type="submit">비밀번호 변경</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
