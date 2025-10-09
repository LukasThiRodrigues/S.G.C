import { Item } from "./item.model";
import { Supplier } from "./supplier.model";

export enum StatusRequest {
    Pending = 'pending',
    SupplierAccepted = 'supplierAccepted',
    SupplierRejected = 'supplierRejected',
    Draft = 'draft',
    Delivered = 'delivered',
    Canceled = 'canceled'
}

export interface RequestItem {
    id?: number,
    item: Item,
    quantity: number,
    price: number,
    total: number
}

export interface Request {
    id?: number;
    code: string;
    creator: string;
    createdAt: Date;
    description: string;
    deliveredAt?: Date;
    supplier: Supplier;
    status: StatusRequest;
    itens: RequestItem[];
    total: number;
}