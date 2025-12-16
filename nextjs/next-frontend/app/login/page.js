import LoginForm from "@/app/login/LoginForm.jsx";

export default function Login() {
    return (
        <div className="content">
            <div className="center-layout login-form">
                <h1 className="center-title">로그인</h1>
                <LoginForm />
            </div>
        </div>
    );
}