import LoginForm from "@/app/auth/login/login-form";

function LoginPage() {
    return (
        <div>
            <h1 className="text-xl text-center font-semibold">Login</h1>

            <div className="flex justify-center mt-[1rem]">
                <LoginForm />
            </div>
        </div>
    );
}

export default LoginPage;
