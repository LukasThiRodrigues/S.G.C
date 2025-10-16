import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Quotation } from '../shared/models/quotation.model';

@Injectable({
    providedIn: 'root'
})
export class QuotationService {
    private apiUrl = 'http://localhost:3000';

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    create(body: Quotation): Observable<any> {
        return this.http.post(`${this.apiUrl}/quotations`, body).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/quotations']);
                }
            })
        );
    }

    update(body: Quotation): Observable<any> {
        return this.http.put(`${this.apiUrl}/quotations/${body.id}`, body).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/quotations']);
                }
            })
        );
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/quotations/${id}`).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/quotations']);
                }
            })
        );
    }

    findAll(page: number = 1, limit: number = 10, search: string = ''): Observable<any> {
        const params: any = { page, limit };
        if (search) params.search = search;

        return this.http.get(`${this.apiUrl}/quotations`, { params });
    }

    findOne(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/quotations/${id}`);
    }

}