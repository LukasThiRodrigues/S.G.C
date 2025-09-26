import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Supplier } from '../shared/models/supplier.model';

@Injectable({
    providedIn: 'root'
})
export class SupplierService {
    private apiUrl = 'http://localhost:3000';

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    create(body: Supplier): Observable<any> {
        return this.http.post(`${this.apiUrl}/suppliers`, body).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/suppliers']);
                }
            })
        );
    }

    update(body: Supplier): Observable<any> {
        return this.http.put(`${this.apiUrl}/suppliers/${body.id}`, body).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/suppliers']);
                }
            })
        );
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/suppliers/${id}`).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/suppliers']);
                }
            })
        );
    }

    findAll(page: number = 1, limit: number = 10, search: string = ''): Observable<any> {
        const params: any = { page, limit };
        if (search) params.search = search;

        return this.http.get(`${this.apiUrl}/suppliers`, { params });
    }

    findOne(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/suppliers/${id}`);
    }

}