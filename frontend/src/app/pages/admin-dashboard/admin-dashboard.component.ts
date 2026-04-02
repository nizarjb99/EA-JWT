import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  error = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.error = '';
    this.authService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar usuarios. Acceso denegado.';
        this.loading = false;
      }
    });
  }

  eliminarUsuario(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar a este usuario del sistema?')) {
      this.authService.deleteUsuario(id).subscribe({
        next: () => {
          // Filtramos mentalmente a este usuario para quitarlo de la tabla una vez borrado en el servidor
          this.usuarios = this.usuarios.filter(u => u._id !== id);
          alert('El usuario ha sido eliminado correctamente.');
        },
        error: (err) => {
          alert('Error al intentar eliminar el usuario: ' + (err.error?.message || 'Acceso Restringido'));
        }
      });
    }
  }
}
