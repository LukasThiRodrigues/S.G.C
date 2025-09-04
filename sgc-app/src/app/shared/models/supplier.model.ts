export enum SupplierStatus {
    Invited = 'Convidado',
    Active = 'Ativo',
    Inactive = 'Inativo',
}

export interface Supplier {
    id?: number;
    name: string;
    cnpj: string;
    status: SupplierStatus;
}
