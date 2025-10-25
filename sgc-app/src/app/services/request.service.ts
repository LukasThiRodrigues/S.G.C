import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Request } from '../shared/models/request.model';

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    private apiUrl = 'http://localhost:3000';

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    create(body: Request): Observable<any> {
        return this.http.post(`${this.apiUrl}/requests`, body).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/requests']);
                }
            })
        );
    }

    update(body: Request): Observable<any> {
        return this.http.put(`${this.apiUrl}/requests/${body.id}`, body).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/requests']);
                }
            })
        );
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/requests/${id}`).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/requests']);
                }
            })
        );
    }

    findAll(page: number = 1, limit: number = 10, search: string = '', supplierId?: number | null): Observable<any> {
        const params: any = { page, limit };
        if (search) params.search = search;
        if (supplierId) params.supplierId = supplierId;

        return this.http.get(`${this.apiUrl}/requests`, { params });
    }

    findOne(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/requests/${id}`);
    }

}