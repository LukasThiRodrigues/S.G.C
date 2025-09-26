export enum SupplierStatus {
    Invited = 'invited',
    Active = 'active',
    Inactive = 'inactive',
}

export interface Supplier {
    id?: number;
    name: string;
    cnpj: string;
    status: SupplierStatus;
    contactEmail: string;
}
