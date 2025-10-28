import { Item } from "./item.model";
import { Request } from "./request.model";
import { Supplier } from "./supplier.model";

export interface ProposalItem {
    id?: number,
    item: Item,
    quantity: number,
    price: number,
    total: number
}

export interface Proposal {
    id?: number;
    createdAt: Date;
    supplier: Supplier;
    itens: ProposalItem[];
    request?: Request;
    total: number;
}