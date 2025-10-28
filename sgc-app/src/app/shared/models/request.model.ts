import { User } from "../../services/auth.service";
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
    creator: User;
    createdAt: Date;
    description: string;
    deliveredAt?: Date;
    supplier: Supplier;
    status: StatusRequest;
    itens: RequestItem[];
    quotationId?: number;
    total: number;
}