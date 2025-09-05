import { Item } from "./item.model";
import { Supplier } from "./supplier.model";

export enum StatusQuotation {
    Pending = 'pending',
    InDecision = 'inDecision',
    Draft = 'draft',
    GeneratedRequest = 'generatedRequest',
    Canceled = 'canceled'
}

export interface Quotation {
    id?: number;
    code: string;
    creator: string;
    createdAt: Date;
    description: string;
    suppliers: Supplier[];
    status: StatusQuotation;
    itens: Item[];
    total: number;
}