"use client";
import { Button } from "@/components/ui/button";
import { ProductResType } from "@/schemaValidations/product.schema";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import productApiRequest from "@/apiRequest/product.api";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";

function DeleteProduct({ product }: { product: ProductResType["data"] }) {
    const router = useRouter();
    const handleDelete = async () => {
        try {
            const result = await productApiRequest.delete(String(product.id));
            toast.success(result.payload.message || "Product deleted successfully");
            router.refresh();
        } catch (error) {
            handleErrorApi(error);
        }
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product{" "}
                        <strong>{product.name ?? ""}</strong>. Are you sure you want to continue?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteProduct;
