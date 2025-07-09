import productApiRequest from "@/apiRequest/product.api";
import ProductForm from "@/app/products/_components/product-form";
import { Metadata } from "next";
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

async function UpdateProduct({ params }: { params: Promise<{ id: string }> }) {
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
                    <h1 className="text-4xl text-black-50 font-bold">Edit Product: {product.name}</h1>
                    <ProductForm product={product} />
                </div>
            ) : (
                <h1 className="text-4xl text-red-500 font-bold">Product not found</h1>
            )}
            {/* Display product details or error message */}
        </div>
    );
}

export default UpdateProduct;
