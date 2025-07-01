"use client";

import RegisterForm from "@/app/auth/register/register-form";

function RegisterPage() {
    return (
        <div>
            <h1 className="text-xl text-center font-bold">Register</h1>
            <div className="flex justify-center mt-[1rem]">
                <RegisterForm />
            </div>
        </div>
    );
}

export default RegisterPage;
