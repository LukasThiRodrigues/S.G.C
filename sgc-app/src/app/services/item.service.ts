import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Item } from '../shared/models/item.model';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    create(body: Item): Observable<any> {
        return this.http.post(`${this.apiUrl}/items`, body).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/items']);
                }
            })
        );
    }

    update(body: Item): Observable<any> {
        return this.http.put(`${this.apiUrl}/items/${body.id}`, body).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/items']);
                }
            })
        );
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/items/${id}`).pipe(
            tap(response => {
                if (response) {
                    this.router.navigate(['/items']);
                }
            })
        );
    }

    findAll(page: number = 1, limit: number = 10, search: string = ''): Observable<any> {
        const params: any = { page, limit };
        if (search) params.search = search;

        return this.http.get(`${this.apiUrl}/items`, { params });
    }

    findOne(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/items/${id}`);
    }

}