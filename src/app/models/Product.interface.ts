export interface Product {
    id: string | number,
    name: string,
    code: string | number,
    purchaseDate: Date | string,
    expirationDate: Date | string,
    stock: number,
    price: string | number;
}