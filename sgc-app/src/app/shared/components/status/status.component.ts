import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

// Defina tipos para suas estruturas
type StatusType = 'item' | 'quotation' | 'supplier' | 'request';

type QuotationStatus = 'pending' | 'inDecision' | 'draft' | 'generatedRequest' | 'canceled';
type SupplierStatus = 'invited' | 'active' | 'inactive';
type RequestStatus = 'pending' | 'draft' | 'supplierAccepted' | 'supplierRejected' | 'delivered' | 'canceled';

interface StatusConfig {
  color: string;
  label: string;
}

interface StatusList {
  item: Record<string, StatusConfig>;
  quotation: Record<QuotationStatus, StatusConfig>;
  supplier: Record<SupplierStatus, StatusConfig>;
  request: Record<RequestStatus, StatusConfig>;
}

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [NgClass],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent {
  
  @Input() status: string = '';
  @Input() type: StatusType = 'request';

  statusList: StatusList = {
    item: {},
    quotation: {
      pending: { color: 'orange', label: 'Pendente' },
      inDecision: { color: 'blue', label: 'Em Decisão' },
      draft: { color: 'gray', label: 'Rascunho' },
      generatedRequest: { color: 'green', label: 'Pedido Gerado' },
      canceled: { color: 'red', label: 'Cancelado' }
    },
    supplier: {
      invited: { color: 'blue', label: 'Convidado' },
      active: { color: 'green', label: 'Ativo' },
      inactive: { color: 'red', label: 'Inativo' }
    },
    request: {
      pending: { color: 'orange', label: 'Pendente' },
      draft: { color: 'gray', label: 'Rascunho' },
      supplierAccepted: { color: 'indigo', label: 'Fornecedor Aceitou' },
      supplierRejected: { color: 'red', label: 'Fornecedor Rejeitou' },
      delivered: { color: 'green', label: 'Entregue' },
      canceled: { color: 'red', label: 'Cancelado' }
    }
  };

  getStatusConfig(): StatusConfig {
    if (!this.isValidType(this.type)) {
      return { color: 'gray', label: 'Tipo inválido' };
    }

    const statusMap = this.statusList[this.type];

    if (statusMap && this.status in statusMap) {
      return statusMap[this.status as keyof typeof statusMap];
    }

    return { color: 'gray', label: 'Desconhecido' };
  }

  private isValidType(type: string): type is keyof StatusList {
    return type in this.statusList;
  }

  getStatusColor(): string {
    return this.getStatusConfig().color;
  }

  getStatusLabel(): string {
    return this.getStatusConfig().label;
  }
}