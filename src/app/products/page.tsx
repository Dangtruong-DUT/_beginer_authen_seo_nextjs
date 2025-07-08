import productApiRequest from "@/apiRequest/product.api";
import DeleteProduct from "@/app/products/_components/button-delete-product";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Menu",
};

async function ProductPage() {
    const { payload } = await productApiRequest.getList();
    return (
        <div>
            <h1 className="text-4xl text-black-50 font-bold">Production List</h1>
            <ul className="grid mt-4 space-y-4 grid-cols-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {payload.data.map((product) => (
                    <li
                        key={product.id}
                        className="mb-4 p-4 border rounded-lg hover:shadow-lime-50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all "
                    >
                        <h2>{product.name}</h2>
                        <p>{product.id}</p>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        {product.image && (
                            <Link href={`/products/${product.id}`}>
                                <Image src={product.image} alt={product.name} width={100} height={100} />
                            </Link>
                        )}
                        <div className="flex space-x-2 mt-2">
                            <Link href={`/products/edit/${product.id}`}>
                                <Button variant={"secondary"}>Edit</Button>
                            </Link>
                            <DeleteProduct product={product} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductPage;
