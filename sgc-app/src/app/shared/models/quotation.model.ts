import { Item } from "./item.model";
import { Supplier } from "./supplier.model";

export enum StatusQuotation {
    Pending = 'Pendente',
    InDecision = 'Em Decisão',
    Draft = 'Rascunho',
    GeneratedRequest = 'Pedido Gerado',
    Canceled = 'Cancelado'
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