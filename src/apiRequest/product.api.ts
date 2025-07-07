import http from "@/lib/http";
import {
    CreateProductBodyType,
    ProductListResType,
    ProductResType,
    UpdateProductBodyType,
} from "@/schemaValidations/product.schema";

const productApiRequest = {
    getList: () => http.get<ProductListResType>("/products"),
    create: (body: CreateProductBodyType) => http.post<ProductResType>("/products", body),
    uploadImage: (body: FormData) => http.post<{ message: string; data: string }>("/media/upload", body),
    getDetail: (id: string) => http.get<ProductResType>(`/products/${id}`),
    edit: (body: UpdateProductBodyType, id: string) => http.put<ProductResType>(`/products/${id}`, body),
    delete: (id: string) => http.delete<{ message: string }>(`/products/${id}`),
};
export default productApiRequest;
