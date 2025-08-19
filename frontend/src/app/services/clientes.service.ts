import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {  // Cambié el nombre de 'Clientes' a 'ClientesService'
  private apiUrl = 'http://localhost:8080/clientes';  // API Gateway

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.apiUrl);  // Llama al microservicio de clientes
  }

  crear(cliente: any): Observable<any> {
    return this.http.post(this.apiUrl, cliente);  // Llama al microservicio de clientes
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);  // Llama al microservicio de clientes
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);  // Llama al microservicio de clientes
  }

  buscarTexto(q: string): Observable<any> {
    return this.http.get(`${this.apiUrl}-search?q=${q}`);  // Llama al microservicio de clientes
  }
}