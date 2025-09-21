export interface Item {
    id?: number;
    item: string;
    description: string;
    code: string;
    unit: string;
    quantity?: number;
    price?: number;
    total?: number;
}