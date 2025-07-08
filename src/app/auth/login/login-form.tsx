"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { toast } from "sonner";
import authApiRequest from "@/apiRequest/auth.api";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";

function LoginForm() {
    const router = useRouter();

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = async (values: LoginBodyType) => {
        try {
            const responseFromBackend = await authApiRequest.login(values);
            const responseFromNextServer = await authApiRequest.auth({
                sessionToken: responseFromBackend.payload.data.token,
                expiresAt: responseFromBackend.payload.data.expiresAt,
            });

            toast.success(responseFromBackend.payload.message || "Đăng nhập thành công", {
                description: "Chuyển hướng đến trang chủ sau 2 giây",
            });
            router.push("/me");
            router.refresh();

            return responseFromNextServer;
        } catch (error) {
            handleErrorApi(error, form.setError);
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
