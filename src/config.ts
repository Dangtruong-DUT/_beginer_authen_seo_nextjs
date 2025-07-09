import { z } from "zod";

export const envConfigSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string(),
    NEXT_PUBLIC_API: z.string().url(),
});

const configProject = envConfigSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
});

if (!configProject.success) {
    console.error(configProject.error.issues);
    throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

export const envConfig = configProject.data;
