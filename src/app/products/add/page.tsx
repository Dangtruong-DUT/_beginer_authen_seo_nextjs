import ProductForm from "@/app/products/_components/product-form";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Add New Product",

    description: "Create a new product by filling out the form below.",
};

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
