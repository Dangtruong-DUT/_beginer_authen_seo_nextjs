import productApiRequest from "@/apiRequest/product.api";
import ProductForm from "@/app/products/_components/product-form";

async function UpdateProduct({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let product = null;
    try {
        const { payload } = await productApiRequest.getDetail(id);
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
