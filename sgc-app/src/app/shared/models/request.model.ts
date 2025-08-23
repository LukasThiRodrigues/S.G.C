export enum StatusPedido {
    Pendente = 'Pendente',
    Rascunho = 'Rascunho',
    Entregue = 'Entregue',
    Cancelado = 'Cancelado'
}

export interface ItemPedido {
    id?: number;
    produto: string;
    unidade: string;
    quantidade: number;
    precoUnitario: number;
    total: number;
}

export interface Pedido {
    id?: number;
    codigo: string;
    criador: string;
    dataEmissao: Date;
    dataEntrega?: Date;
    fornecedor: string;
    status: StatusPedido;
    itens: ItemPedido[];
    total: number;
}