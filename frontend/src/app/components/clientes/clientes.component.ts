import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  nuevoCliente = { nombre: '', email: '' };
  buscarId = 0;
  resultadoBusqueda: any;

  constructor(private clienteService: ClientesService) {}

  ngOnInit(): void {
    this.listar();  // Al cargar el componente, obtenemos los clientes
  }

  listar() {
    this.clienteService.listar().subscribe(data => {
      this.clientes = data;  // Asignamos los datos de clientes obtenidos a la variable clientes
    });
  }

  crear() {
    this.clienteService.crear(this.nuevoCliente).subscribe(() => {
      this.listar();  // Recargamos la lista de clientes después de crear uno nuevo
      this.nuevoCliente = { nombre: '', email: '' };  // Limpiamos el formulario
    });
  }

  buscar() {
    this.clienteService.buscarPorId(this.buscarId).subscribe(data => {
      this.resultadoBusqueda = data;  // Mostramos el cliente encontrado por ID
    });
  }

  eliminar(id: number) {
    this.clienteService.eliminar(id).subscribe(() => {
      this.listar();  // Recargamos la lista después de eliminar un cliente
    });
  }
}