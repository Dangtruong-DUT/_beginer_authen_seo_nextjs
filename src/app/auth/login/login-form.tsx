"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { envConfig } from "@/config";
import { toast } from "sonner";

// type LoginResponseType = {
//     status: number;
//     payload: {
//         accessToken: string;
//         user: {
//             id: string;
//             email: string;
//             name: string;
//         };
//     };
// };

type LoginErrorType = {
    status: number;
    payload: {
        message: string;
        errors: { field: keyof LoginBodyType; message: string }[];
    };
};
function LoginForm() {
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = async (values: LoginBodyType) => {
        try {
            const res = await fetch(envConfig.NEXT_PUBLIC_API_ENDPOINT + "/auth/login", {
                body: JSON.stringify(values),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const payload = await res.json();
            const data = {
                status: res.status,
                payload,
            };
            if (!res.ok) {
                throw data;
            }
            toast.success(data.payload.message || "Đăng nhập thành công", {
                description: "Chuyển hướng đến trang chủ sau 2 giây",
            });
            return data;
        } catch (error) {
            const err = error as LoginErrorType;
            if (err.status === 422) {
                err.payload.errors.forEach((error) => {
                    form.setError(error.field, {
                        type: "system",
                        message: error.message,
                    });
                });
            } else {
                toast.error(err.payload.message || "Đăng nhập thất bại", {});
            }
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3  max-w-[600px] shrink-0 w-full">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>email</FormLabel>
                            <FormControl>
                                <Input placeholder="email@gmail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>password</FormLabel>
                            <FormControl>
                                <Input placeholder="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="mt-4 w-full">
                    SignIn
                </Button>
            </form>
        </Form>
    );
}

export default LoginForm;
