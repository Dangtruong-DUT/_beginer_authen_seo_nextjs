"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { UpdateMeBody, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import accountApi from "@/apiRequest/account.api";
import { useEffect } from "react";

function ProfileForm() {
    const router = useRouter();

    const form = useForm<UpdateMeBodyType>({
        resolver: zodResolver(UpdateMeBody),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const responseFromBackend = await accountApi.meClient();
                form.reset(responseFromBackend.payload.data);
            } catch (error) {
                handleErrorApi(error, form.setError);
            }
        };
        getUserInfo();
    }, [form]);

    const onSubmit = async (values: UpdateMeBodyType) => {
        try {
            const responseFromBackend = await accountApi.UpdateMe(values);
            toast.success(responseFromBackend.payload.message || "Update successful");
            router.refresh();
            return responseFromBackend;
        } catch (error) {
            handleErrorApi(error, form.setError);
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3  max-w-[600px] shrink-0 w-full">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="tatamit" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="mt-4 w-full">
                    Save
                </Button>
            </form>
        </Form>
    );
}

export default ProfileForm;
