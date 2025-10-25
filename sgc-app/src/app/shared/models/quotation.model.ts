import { Item } from "./item.model";
import { Proposal } from "./proposal.model";
import { Supplier } from "./supplier.model";

export enum StatusQuotation {
    Pending = 'pending',
    InDecision = 'inDecision',
    Draft = 'draft',
    GeneratedRequest = 'generatedRequest',
    Canceled = 'canceled'
}

export interface QuotationItem {
    id?: number,
    item: Item,
    quantity: number,
    price: number,
    total: number
}

export interface QuotationSupplier {
    id?: number,
    quotationId: number,
    supplier: Supplier,
}

export interface Quotation {
    id?: number;
    code: string;
    creator: string;
    createdAt: Date;
    description: string;
    suppliers: QuotationSupplier[];
    status: StatusQuotation;
    itens: QuotationItem[];
    proposals: Proposal[];
    total: number;
}