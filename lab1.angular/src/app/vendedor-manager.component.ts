import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendedorService } from './vendedor.service';
import { Vendedor } from './vendedor';

@Component({
  selector: 'app-vendedor-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestión de Vendedores</h2>
      
      <!-- Formulario -->
      <div class="form-section">
        <h3>{{ editingId() ? 'Editar' : 'Nuevo' }} Vendedor</h3>
        <form (ngSubmit)="submitForm()">
          <div class="form-group">
            <label>Nombre:</label>
            <input [(ngModel)]="formData.name" name="name" required class="form-control">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" [(ngModel)]="formData.email" name="email" required class="form-control">
          </div>
          <div class="form-group">
            <label>Teléfono:</label>
            <input [(ngModel)]="formData.telefono" name="telefono" required class="form-control">
          </div>
          <div class="form-group">
            <label>Comisión:</label>
            <input type="number" [(ngModel)]="formData.comision" name="comision" required class="form-control">
          </div>
          <div class="form-group">
            <label>Código Empleado:</label>
            <input [(ngModel)]="formData.codigoEmpleado" name="codigoEmpleado" required class="form-control">
          </div>
          <div class="button-group">
            <button type="submit" class="btn btn-primary">{{ editingId() ? 'Actualizar' : 'Crear' }}</button>
            <button type="button" (click)="cancelEdit()" class="btn btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>

      <!-- Lista -->
      <div class="list-section">
        <h3>Lista de Vendedores</h3>
        <div *ngIf="error()" class="error">{{ error() }}</div>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Comisión</th>
              <th>Código</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let vendedor of vendedores()">
              <td>{{ vendedor.id }}</td>
              <td>{{ vendedor.name }}</td>
              <td>{{ vendedor.email }}</td>
              <td>{{ vendedor.telefono }}</td>
              <td>{{ vendedor.comision }}</td>
              <td>{{ vendedor.codigoEmpleado }}</td>
              <td>
                <button (click)="editVendedor(vendedor)" class="btn btn-sm btn-warning">Editar</button>
                <button (click)="deleteVendedor(vendedor.id!)" class="btn btn-sm btn-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .form-section {
      background: #f5f5f5;
      padding: 20px;
      margin-bottom: 30px;
      border-radius: 8px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary {
      background: #007bff;
      color: white;
    }
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    .btn-warning {
      background: #ffc107;
      color: black;
    }
    .btn-danger {
      background: #dc3545;
      color: white;
    }
    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
      margin-right: 5px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    .table th, .table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .table th {
      background: #007bff;
      color: white;
    }
    .error {
      color: red;
      padding: 10px;
      margin-bottom: 10px;
    }
  `]
})
export class VendedorManagerComponent implements OnInit {
  vendedores = signal<Vendedor[]>([]);
  editingId = signal<string | null>(null);
  error = signal<string>('');
  
  formData = {
    name: '',
    email: '',
    telefono: '',
    comision: 0,
    codigoEmpleado: ''
  };

  constructor(private vendedorService: VendedorService) {}

  ngOnInit() {
    this.loadVendedores();
  }

  loadVendedores() {
    this.vendedorService.getVendedores().subscribe({
      next: (data) => this.vendedores.set(data),
      error: (err) => this.error.set('Error al cargar vendedores')
    });
  }

  submitForm() {
    const vendedor = new Vendedor(
      this.formData.name,
      this.formData.email,
      this.formData.telefono,
      this.formData.comision,
      this.formData.codigoEmpleado
    );

    if (this.editingId()) {
      vendedor.id = this.editingId()!;
      this.vendedorService.updateVendedor(vendedor).subscribe({
        next: () => {
          this.loadVendedores();
          this.cancelEdit();
        },
        error: (err) => this.error.set('Error al actualizar')
      });
    } else {
      this.vendedorService.addVendedor(vendedor).subscribe({
        next: () => {
          this.loadVendedores();
          this.cancelEdit();
        },
        error: (err) => this.error.set('Error al crear')
      });
    }
  }

  editVendedor(vendedor: Vendedor) {
    this.editingId.set(vendedor.id!);
    this.formData = {
      name: vendedor.name,
      email: vendedor.email,
      telefono: vendedor.telefono,
      comision: vendedor.comision,
      codigoEmpleado: vendedor.codigoEmpleado
    };
  }

  deleteVendedor(id: string) {
    if (confirm('¿Está seguro de eliminar este vendedor?')) {
      this.vendedorService.deleteVendedor(id).subscribe({
        next: () => this.loadVendedores(),
        error: (err) => this.error.set('Error al eliminar')
      });
    }
  }

  cancelEdit() {
    this.editingId.set(null);
    this.formData = {
      name: '',
      email: '',
      telefono: '',
      comision: 0,
      codigoEmpleado: ''
    };
  }
}
