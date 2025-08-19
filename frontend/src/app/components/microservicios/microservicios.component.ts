import { Component } from '@angular/core';

interface Microservicio {
  nombre: string;
  descripcion: string;
  detalles: string;
}

@Component({
  selector: 'app-microservicios',
  templateUrl: './microservicios.component.html',
  styleUrls: ['./microservicios.css']
})
export class MicroserviciosComponent {
  microservicios: Microservicio[] = [
    {
      nombre: 'Gateway',
      descripcion: 'Punto de entrada para los microservicios.',
      detalles: 'Encargado de enrutar las peticiones a los microservicios correspondientes.'
    },
    {
      nombre: 'Clientes',
      descripcion: 'Gestión de clientes.',
      detalles: 'Permite crear, editar y consultar clientes.'
    },
    {
      nombre: 'Productos',
      descripcion: 'Gestión de productos.',
      detalles: 'Permite crear, editar y consultar productos.'
    },
    {
      nombre: 'Ventas',
      descripcion: 'Gestión de ventas.',
      detalles: 'Permite registrar y consultar ventas.'
    }
  ];

  seleccionado: Microservicio | null = null;

  mostrarDetalles(micro: Microservicio) {
    this.seleccionado = micro;
  }
}
