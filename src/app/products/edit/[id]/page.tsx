import ProductForm from "@/app/products/_components/product-form";
import { getPost } from "@/lib/data";
import { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
