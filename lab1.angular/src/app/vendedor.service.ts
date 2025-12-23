import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendedor } from './vendedor';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  private baseUrl = 'http://localhost:3000/api/vendedores';

  constructor(private http: HttpClient) {}

  getVendedores(): Observable<Vendedor[]> {
    return this.http.get<Vendedor[]>(this.baseUrl);
  }

  getVendedor(id: string): Observable<Vendedor> {
    return this.http.get<Vendedor>(`${this.baseUrl}/${id}`);
  }

  addVendedor(v: Vendedor): Observable<Vendedor> {
    return this.http.post<Vendedor>(this.baseUrl, v);
  }

  updateVendedor(v: Vendedor): Observable<Vendedor> {
    return this.http.put<Vendedor>(`${this.baseUrl}/${v.id}`, v);
  }

  deleteVendedor(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
