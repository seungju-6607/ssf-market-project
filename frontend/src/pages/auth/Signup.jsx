// src/pages/auth/Signup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { signupApi } from "../../api/auth";
import "./Signup.css";
import { getSignup, getIdCheck } from '../../feature/auth/authAPI.js';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordCheck: "",
    phone: "",
    referralId: "",
  });

  const [agreements, setAgreements] = useState({
    age14: false,
    termsOfUse: false,
    privacy: false,
    membership: false,
    marketing: false,
  });

  const [marketingChannels, setMarketingChannels] = useState({
    sms: false,
    email: false,
    dm: false,
    tm: false,
  });

  const [expandedTerms, setExpandedTerms] = useState({
    termsOfUse: false,
    privacy: false,
    membership: false,
    marketing: false,
    marketingChannels: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [validation, setValidation] = useState({
    email: { valid: null, message: "" },
    password: { valid: null, message: "" },
    passwordCheck: { valid: null, message: "" },
  });

  // 조건별 체크 상태
  const [passwordChecks, setPasswordChecks] = useState({
    combination: false,
    minLength: false,
  });

  // 마케팅 채널 변경 시 마케팅 동의 상태 자동 업데이트
  useEffect(() => {
    const allChannelsChecked = marketingChannels.sms && marketingChannels.email && marketingChannels.dm && marketingChannels.tm;
    const anyChannelChecked = marketingChannels.sms || marketingChannels.email || marketingChannels.dm || marketingChannels.tm;

    // 모든 채널이 체크되어 있으면 마케팅 동의도 체크
    if (allChannelsChecked && !agreements.marketing) {
      setAgreements((prev) => ({ ...prev, marketing: true }));
    }
    // 하나라도 해제되어 있으면 마케팅 동의도 해제
    else if (!anyChannelChecked && agreements.marketing) {
      setAgreements((prev) => ({ ...prev, marketing: false }));
    }
  }, [marketingChannels, agreements.marketing]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));

    // 실시간 유효성 검사
    if (name === "password") {
      validatePassword(value);
      // 비밀번호 변경 시 비밀번호 확인도 재검증
      if (form.passwordCheck) {
        validatePasswordCheck(form.passwordCheck, value);
      }
    } else if (name === "passwordCheck") {
      validatePasswordCheck(value, form.password);
    } else if (name === "email") {
      validateEmail(value);
    }
  };

  // 입력 필드 지우기
  const clearField = (fieldName) => {
    setForm((p) => ({ ...p, [fieldName]: "" }));
    if (fieldName === "password") {
      setValidation((prev) => ({ ...prev, password: { valid: null, message: "" } }));
      setPasswordChecks({ combination: false, minLength: false });
    } else if (fieldName === "email") {
      setValidation((prev) => ({ ...prev, email: { valid: null, message: "" } }));
    }
  };

  // 비밀번호 유효성 검사
  const validatePassword = (value) => {
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    const isCombination = typeCount >= 2;
    const isMinLength = value.length >= 4;

    setPasswordChecks({
      combination: isCombination,
      minLength: isMinLength,
    });

    if (!value) {
      setValidation((prev) => ({ ...prev, password: { valid: null, message: "" } }));
      return;
    }

    if (!isMinLength) {
      setValidation((prev) => ({
        ...prev,
        password: { valid: false, message: "4자 이상 입력해주세요." },
      }));
    } else if (!isCombination) {
      setValidation((prev) => ({
        ...prev,
        password: { valid: false, message: "영문, 숫자, 특수문자 중 2가지 이상 조합해주세요." },
      }));
    } else {
      setValidation((prev) => ({
        ...prev,
        password: { valid: true, message: "사용 가능한 비밀번호입니다." },
      }));
    }
  };

  // 이메일 유효성 및 중복 검사
  const validateEmail = (value) => {
    if (!value) {
      setValidation((prev) => ({ ...prev, email: { valid: null, message: "" } }));
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setValidation((prev) => ({
        ...prev,
        email: { valid: false, message: "올바른 이메일 형식이 아닙니다." },
      }));
      return;
    } else {
      setValidation((prev) => ({
       ...prev,
       email: { valid: true, message: "사용 가능한 이메일입니다." },
      }));
    }
  };

  // 비밀번호 확인 검사
  const validatePasswordCheck = (checkValue, passwordValue) => {
    if (!checkValue) {
      setValidation((prev) => ({ ...prev, passwordCheck: { valid: null, message: "" } }));
      return;
    }

    if (checkValue !== passwordValue) {
      setValidation((prev) => ({
        ...prev,
        passwordCheck: { valid: false, message: "비밀번호가 일치하지 않습니다." },
      }));
    } else {
      setValidation((prev) => ({
        ...prev,
        passwordCheck: { valid: true, message: "비밀번호가 일치합니다." },
      }));
    }
  };

  // 필수 전체 동의
  const handleRequiredAgreements = (checked) => {
    setAgreements({
      age14: checked,
      termsOfUse: checked,
      privacy: checked,
      membership: checked,
      marketing: agreements.marketing, // 선택 항목은 유지
    });
  };

  // 개별 약관 동의
  const handleAgreementChange = (name, checked) => {
    setAgreements((prev) => ({ ...prev, [name]: checked }));

    // 마케팅 동의 체크 시 하위 채널도 함께 체크/해제
    if (name === "marketing") {
      setMarketingChannels({
        sms: checked,
        email: checked,
        dm: checked,
        tm: checked,
      });
    }
  };

  // 마케팅 채널 동의
  const handleMarketingChannel = (name, checked) => {
    setMarketingChannels((prev) => ({ ...prev, [name]: checked }));
  };

  // 약관 펼치기/접기
  const toggleTerm = (name) => {
    setExpandedTerms((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const formatPhone = (number) => {
    if (number.length === 10) {
      // 10자리
      return number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (number.length === 11) {
      // 11자리
      return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    return number;
  };

  // 회원가입 처리
  const handleSignup = async (e) => {
    e.preventDefault();

    // 필수 항목 체크
    if (!form.name || !form.password || !form.passwordCheck || !form.email || !form.phone) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    // 이름 검사
    if (form.name.trim().length < 2) {
      alert("이름은 최소 2자 이상이어야 합니다.");
      return;
    }

    // 비밀번호 일치 확인
    if (form.password !== form.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 유효성 검사 확인
    if (!validation.password.valid) {
      alert("비밀번호를 확인해주세요.");
      return;
    }

    if (validation.email.valid === false) {
      alert("이메일을 확인해주세요.");
      return;
    }

    // 필수 약관 동의 확인
    if (!agreements.age14 || !agreements.termsOfUse || !agreements.privacy || !agreements.membership) {
      alert("필수 약관에 모두 동의해주세요.");
      return;
    }

    // 전화번호 검사 (선택사항이지만 입력했으면 검사)
    if (!/^[0-9]{10,11}$/.test(form.phone.replace(/-/g, ""))) {
      alert("올바른 전화번호 형식이 아닙니다. (10-11자리 숫자)");
      return;
    }

    try {
      const idResult = await dispatch(getIdCheck(form.email));

      if (!idResult) {
        try {
          const newForm = { ...form, phone: formatPhone(form.phone) };
          const signResult = await dispatch(getSignup(newForm, "ssf"));
          if (signResult) {
            alert("회원가입이 완료되었습니다! 🎉");
            navigate("/login");
          } else {
            alert("회원가입에 실패하셨습니다.");
          }
        } catch (signupErr) {
          console.error("회원가입 에러:", signupErr);
          alert("회원가입 중 오류가 발생했습니다.");
        }
      } else {
        alert("이미 가입된 이메일 주소 입니다.");
        setValidation((prev) => ({
          ...prev,
          email: { valid: false, message: "이미 가입된 이메일입니다." },
        }));
      }
    } catch (idErr) {
      console.error("ID 체크 에러:", idErr);
      alert("아이디 확인 중 오류가 발생했습니다.");
    }
  };

  const allRequired = agreements.age14 && agreements.termsOfUse && agreements.privacy && agreements.membership;

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">회원가입</h1>

        <form onSubmit={handleSignup} className="signup-form">
          {/* 이름 */}
          <div className="form-group">
            <label className="form-label">
              이름 <span className="required">*</span>
            </label>
            <div className="form-input-wrapper">
              <div className="input-with-clear">
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={form.name}
                  onChange={onChange}
                  placeholder="이름을 입력하세요"
                  required
                />
                {form.name && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => clearField("name")}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 이메일 */}
          <div className="form-group">
            <label className="form-label">
              이메일 <span className="required">*</span>
            </label>
            <div className="form-input-wrapper">
              <div className="input-with-clear">
                <input
                  type="email"
                  name="email"
                  className={`form-input ${validation.email.valid === false ? "invalid" : ""}`}
                  value={form.email}
                  onChange={onChange}
                  placeholder="이메일을 입력하세요"
                  required
                />
                {form.email && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => clearField("email")}
                  >
                    ✕
                  </button>
                )}
              </div>
              {validation.email.message && (
                <p className={`validation-message ${validation.email.valid ? "valid" : "invalid"}`}>
                  {validation.email.valid ? "✓" : "✗"} {validation.email.message}
                </p>
              )}
            </div>
          </div>

          {/* 휴대폰 번호 */}
          <div className="form-group">
            <label className="form-label">
                휴대폰 번호 <span className="required">*</span>
            </label>
            <div className="form-input-wrapper">
              <div className="input-with-clear">
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="숫자만 입력하세요"
                  required
                />
                {form.phone && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => clearField("phone")}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label className="form-label">
              비밀번호 <span className="required">*</span>
            </label>
            <div className="form-input-wrapper">
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-input ${validation.password.valid === false ? "invalid" : ""}`}
                  value={form.password}
                  onChange={onChange}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
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
              {validation.password.message && (
                <p className={`validation-message ${validation.password.valid ? "valid" : "invalid"}`}>
                  {validation.password.valid ? "✓" : "✗"} {validation.password.message}
                </p>
              )}
              <div className="form-hint">
                <div className={`form-hint-item ${passwordChecks.combination ? "active" : ""}`}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>영문, 숫자, 특수문자 2가지 이상 조합</span>
                </div>
                <div className={`form-hint-item ${passwordChecks.minLength ? "active" : ""}`}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>4자 이상</span>
                </div>
              </div>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <label className="form-label">
              비밀번호 확인 <span className="required">*</span>
            </label>
            <div className="form-input-wrapper">
              <div className="password-wrapper">
                <input
                  type={showPasswordCheck ? "text" : "password"}
                  name="passwordCheck"
                  className={`form-input ${validation.passwordCheck.valid === false ? "invalid" : ""}`}
                  placeholder="비밀번호 확인"
                  value={form.passwordCheck}
                  onChange={onChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPasswordCheck ? (
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
              {validation.passwordCheck.message && (
                <p className={`validation-message ${validation.passwordCheck.valid ? "valid" : "invalid"}`}>
                  {validation.passwordCheck.valid ? "✓" : "✗"} {validation.passwordCheck.message}
                </p>
              )}
            </div>
          </div>

          {/* 추천인 ID */}
          <div className="form-group">
            <label className="form-label">추천인 ID</label>
            <div className="form-input-wrapper">
              <div className="input-with-clear">
                <input
                  type="text"
                  name="referralId"
                  className="form-input"
                  value={form.referralId}
                  onChange={onChange}
                  placeholder="추천인 ID (선택)"
                />
                {form.referralId && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => clearField("referralId")}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 이용약관 동의 */}
          <div className="agreements-section">
            <h3 className="agreements-title">이용약관 동의</h3>

            {/* 필수 전체 동의 */}
            <div className="agreement-item all-agreement">
              <label>
                <input
                  type="checkbox"
                  checked={allRequired}
                  onChange={(e) => handleRequiredAgreements(e.target.checked)}
                />
                <span>[필수] 전체동의</span>
              </label>
            </div>

            {/* 필수 약관 그룹 - 박스 */}
            <div className="agreement-group required-box">
              {/* 만 14세 이상 */}
              <div className="agreement-item">
                <label>
                  <input
                    type="checkbox"
                    checked={agreements.age14}
                    onChange={(e) => handleAgreementChange("age14", e.target.checked)}
                  />
                  <span>[필수] 만 14세 이상</span>
                </label>
              </div>

              {/* 온라인사이트 이용약관 */}
              <div className="agreement-item expandable">
                <label>
                  <input
                    type="checkbox"
                    checked={agreements.termsOfUse}
                    onChange={(e) => handleAgreementChange("termsOfUse", e.target.checked)}
                  />
                  <span>[필수] 온라인사이트 이용약관</span>
                </label>
                <button type="button" className="expand-btn" onClick={() => toggleTerm("termsOfUse")}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    {expandedTerms.termsOfUse ? (
                      <path d="M8 5l-4 4h8l-4-4z"/>
                    ) : (
                      <path d="M8 11l4-4H4l4 4z"/>
                    )}
                  </svg>
                </button>
              </div>
              {expandedTerms.termsOfUse && (
                <div className="agreement-content">
                  <h4>제1조 (목적)</h4>
                  <p>이 약관은 온라인사이트에서 제공하는 인터넷 관련 서비스를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                  <h4>제2조 (용어의 정의)</h4>
                  <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                  <ul>
                    <li>1. "회원"이라 함은 회사와 서비스 이용계약을 체결한 자를 말합니다.</li>
                    <li>2. "아이디(ID)"라 함은 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.</li>
                  </ul>
                </div>
              )}

              {/* 개인정보 수집 및 이용동의 */}
              <div className="agreement-item expandable">
                <label>
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={(e) => handleAgreementChange("privacy", e.target.checked)}
                  />
                  <span>[필수] 개인정보 수집 및 이용동의</span>
                </label>
                <button type="button" className="expand-btn" onClick={() => toggleTerm("privacy")}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    {expandedTerms.privacy ? (
                      <path d="M8 5l-4 4h8l-4-4z"/>
                    ) : (
                      <path d="M8 11l4-4H4l4 4z"/>
                    )}
                  </svg>
                </button>
              </div>
              {expandedTerms.privacy && (
                <div className="agreement-content">
                  <h4>제1조 (목적)</h4>
                  <p>수집 항목: 이메일, 휴대전화번호, 주소, 서비스 이용기록</p>
                  <h4>제2조 (이용 목적)</h4>
                  <p>이용 목적: 고객 맞춤 서비스 제공, 이벤트 및 광고성 정보 전달 및 참여 기회 제공</p>
                  <h4>제3조 (보유 기간)</h4>
                  <p>보유 기간: 고객의 동의 철회 시 또는 회원 탈퇴 시 즉시 파기</p>
                </div>
              )}

              {/* 멤버십 이용약관 */}
              <div className="agreement-item expandable">
                <label>
                  <input
                    type="checkbox"
                    checked={agreements.membership}
                    onChange={(e) => handleAgreementChange("membership", e.target.checked)}
                  />
                  <span>[필수] 멤버십 이용약관</span>
                </label>
                <button type="button" className="expand-btn" onClick={() => toggleTerm("membership")}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    {expandedTerms.membership ? (
                      <path d="M8 5l-4 4h8l-4-4z"/>
                    ) : (
                      <path d="M8 11l4-4H4l4 4z"/>
                    )}
                  </svg>
                </button>
              </div>
              {expandedTerms.membership && (
                <div className="agreement-content">
                  <h4>제1조 (목적)</h4>
                  <p>본 약관은 멤버십 서비스를 이용함에 있어 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
                  <h4>제2조 (용어의 정의)</h4>
                  <p>멤버십: 회사에서 제공하는 통합 멤버십 서비스를 의미합니다.</p>
                </div>
              )}
            </div>

            {/* 마케팅 동의 - 박스 밖 */}
            <div className="agreement-item expandable marketing-main">
              <label>
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={(e) => handleAgreementChange("marketing", e.target.checked)}
                />
                <span>[선택] 마케팅 목적의 개인정보 수집 및 이용 동의</span>
              </label>
              <button type="button" className="expand-btn" onClick={() => toggleTerm("marketing")}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  {expandedTerms.marketing ? (
                    <path d="M8 5l-4 4h8l-4-4z"/>
                  ) : (
                    <path d="M8 11l4-4H4l4 4z"/>
                  )}
                </svg>
              </button>
            </div>
            {expandedTerms.marketing && (
              <div className="agreement-content">
                <p>1. 항목 : 이메일, 휴대폰번호, 주소, 서비스 이용기록</p>
                <p>2. 이용 목적 : 고객 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공</p>
                <p>3. 보유 기간 : 고객의 동의 철회 시 또는 회원 탈퇴 시 즉시 파기</p>
                <br />
                <p>동의를 거부하실 수 있으나, 거부 시 고객 맞춤 서비스 제공, 광고성(이벤트) 정보 제공 및 참여 기회가 제한됩니다.</p>
              </div>
            )}

            {/* 마케팅정보 수신 동의 */}
            <h4 className="marketing-consent-title">[선택] 마케팅정보 수신 동의</h4>
            <div className="agreement-group optional-group">
              <div className="channel-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={marketingChannels.sms}
                      onChange={(e) => handleMarketingChannel("sms", e.target.checked)}
                    />
                    <span>SMS 및 알림톡</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={marketingChannels.email}
                      onChange={(e) => handleMarketingChannel("email", e.target.checked)}
                    />
                    <span>이메일</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={marketingChannels.dm}
                      onChange={(e) => handleMarketingChannel("dm", e.target.checked)}
                    />
                    <span>DM(우편물)</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={marketingChannels.tm}
                      onChange={(e) => handleMarketingChannel("tm", e.target.checked)}
                    />
                    <span>TM(전화)</span>
                  </label>
                </div>
            </div>
          </div>

          {/* 가입하기 버튼 */}
          <button type="submit" className="signup-submit-btn">
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}
