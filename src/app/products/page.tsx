import productApiRequest from "@/apiRequest/product.api";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

async function ProductPage() {
    const { payload } = await productApiRequest.getList();
    return (
        <div>
            <h1 className="text-4xl text-black-50 font-bold">Production List</h1>
            <ul className="grid mt-4 space-y-4 grid-cols-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {payload.data.map((product) => (
                    <li key={product.id} className="mb-4 p-4 border rounded-lg hover:shadow-lime-50 hover:bg-gray-200 ">
                        <h2>{product.name}</h2>
                        <p>{product.id}</p>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        {product.image && <Image src={product.image} alt={product.name} width={100} height={100} />}
                        <div className="flex space-x-2 mt-2">
                            <Link href={`/products/${product.id}`}>
                                <Button variant={"secondary"}>Edit</Button>
                            </Link>
                            <Button variant={"destructive"}>Delete</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductPage;
