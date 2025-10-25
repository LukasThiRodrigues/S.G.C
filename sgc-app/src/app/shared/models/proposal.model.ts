import { Item } from "./item.model";
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
    total: number;
}