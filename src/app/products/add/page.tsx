import ProductForm from "@/app/products/_components/product-form";

function AddProductPage() {
    return (
        <div>
            <h1 className="text-4xl text-black-50 font-bold">Create New Product</h1>
            <p className="text-gray-500">Fill in the details below to create a new product.</p>
            <ProductForm />
        </div>
    );
}

export default AddProductPage;
