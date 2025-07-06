"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { CreateProductBody, CreateProductBodyType } from "@/schemaValidations/product.schema";
import productApiRequest from "@/apiRequest/product.api";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import Image from "next/image";

function ProductAddForm() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    const form = useForm<CreateProductBodyType>({
        resolver: zodResolver(CreateProductBody),
        defaultValues: {
            description: "",
            image: "",
            name: "",
            price: 0,
        },
    });
    const onSubmit = async (values: CreateProductBodyType) => {
        try {
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                const responseFromBackend = await productApiRequest.uploadImage(formData);
                console.log(responseFromBackend);
                values.image = responseFromBackend.payload.data;
            } else {
                values.image = "";
            }
            const responseFromBackend = await productApiRequest.create(values);
            toast.success(responseFromBackend.payload.message || "create product successfully");
            router.push("/products");
            return responseFromBackend;
        } catch (error) {
            handleErrorApi(error, form.setError);
        }
    };
    console.log("image", form.watch("image"));
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
                                <Input placeholder="gai xinh" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="san pham ngon" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input placeholder="1$" {...field} type={"number"} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Input
                                    ref={fileRef}
                                    placeholder="5lit"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0] || null;
                                        setFile(file);
                                        field.value = file ? URL.createObjectURL(file) : "";
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                            {file && (
                                <div>
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt="new product"
                                        width={128}
                                        height={128}
                                        className="w-32 h-32 object-cover mt-2 rounded-md"
                                    />
                                    <Button
                                        variant="destructive"
                                        className="mt-2"
                                        type="button"
                                        onClick={() => {
                                            setFile(null);
                                            field.value = "";
                                            if (fileRef.current) {
                                                fileRef.current.value = "";
                                            }
                                        }}
                                    >
                                        Remove Image
                                    </Button>
                                </div>
                            )}
                        </FormItem>
                    )}
                />
                <Button type="submit" className="mt-4 w-full">
                    Create Product
                </Button>
            </form>
        </Form>
    );
}

export default ProductAddForm;
