import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Proposal } from '../shared/models/proposal.model';

@Injectable({
    providedIn: 'root'
})
export class ProposalService {
    private apiUrl = 'http://localhost:3000';

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    create(body: Proposal): Observable<any> {
        return this.http.post(`${this.apiUrl}/proposals`, body).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/proposals']);
                }
            })
        );
    }

    update(body: Proposal): Observable<any> {
        return this.http.put(`${this.apiUrl}/proposals/${body.id}`, body).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/proposals']);
                }
            })
        );
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/proposals/${id}`).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/proposals']);
                }
            })
        );
    }

    findAll(page: number = 1, limit: number = 10, supplierId?: number | null): Observable<any> {
        const params: any = { page, limit };
        if (supplierId) params.supplierId = supplierId;

        return this.http.get(`${this.apiUrl}/proposals`, { params });
    }

    findOne(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/proposals/${id}`);
    }

}