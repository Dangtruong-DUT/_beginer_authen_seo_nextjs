import type { Metadata } from "next";
import productApiRequest from "@/apiRequest/product.api";
import Image from "next/image";
import { cache } from "react";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const getPost = cache(async (id: string) => {
    const res = await productApiRequest.getDetail(id);
    return res;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    let product = null;
    try {
        const { payload } = await getPost(id);
        product = payload.data;
    } catch (error) {
        console.error("Failed to fetch product details:", error);
    }
    return {
        title: product?.name || "Product Detail",
        description: product ? product.description : "Product not found",
    };
}

async function ProductDetail({ params }: Props) {
    const { id } = await params;
    let product = null;
    try {
        const { payload } = await getPost(id);
        product = payload.data;
    } catch (error) {
        console.error("Failed to fetch product details:", error);
    }
    return (
        <div>
            {product ? (
                <div>
                    <h1 className="text-4xl text-black-50 font-bold">Product Detail: {product.name}</h1>
                    <p>ID: {product.id}</p>
                    <p>Description: {product.description}</p>
                    <p>Price: ${product.price}</p>
                    {product.image && <Image src={product.image} alt={product.name} width={100} height={100} />}
                </div>
            ) : (
                <h1 className="text-4xl text-red-500 font-bold">Product not found</h1>
            )}
        </div>
    );
}

export default ProductDetail;
