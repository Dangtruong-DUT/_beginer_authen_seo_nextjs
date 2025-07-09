import productApiRequest from "@/apiRequest/product.api";
import { cache } from "react";

export const getPost = cache(async (id: string) => {
    const res = await productApiRequest.getDetail(id);
    return res;
});
