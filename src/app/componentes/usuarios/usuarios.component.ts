import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { UpdatePasswordDialogComponent } from '../../update-password-dialog/update-password-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  paginatedUsers: any[] = [];
  userForm: FormGroup;
  passwordStrength: number = 0;
  passwordStrengthText: string = '';
  passwordStrengthClass: string = '';
  roles: { id: number, nombre: string }[] = [];
  editingUserId: number | null = null;
  hidePassword: boolean = true;
  pageSize = 6;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      rol_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
        this.filteredUsers = data;
        this.updatePaginator();
      },
      error => {
        console.error('Error loading users', error);
      }
    );
  }
  
  loadRoles(): void {
    this.userService.getRoles().subscribe(
      data => {
        this.roles = data;
      },
      error => {
        console.error('Error loading roles', error);
      }
    );
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const userData = { ...this.userForm.value };
  
      if (this.editingUserId) {
        if (!userData.password) {
          delete userData.password;
        }
        this.userService.updateUser(this.editingUserId, userData).subscribe(
          () => {
            this.loadUsers();
            this.resetForm();
          },
          error => console.error('Error updating user', error)
        );
      } else {
        this.userService.createUser(userData).subscribe(
          () => {
            this.loadUsers();
            this.resetForm();
          },
          error => console.error('Error creating user', error)
        );
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }
  
  editUser(user: any): void {
    this.editingUserId = user.id;
    const { password, ...userData } = user;
    this.userForm.patchValue(userData);
    window.scrollTo(0, 0);
  }
  
  deleteUser(id: number): void {
    const confirmDelete = confirm('¿Seguro que quieres eliminar este usuario?');
    if (confirmDelete) {
      this.userService.deleteUser(id).subscribe(
        () => {
          this.loadUsers();
        },
        error => {
          console.error('Error deleting user', error);
        }
      );
    }
  }

  resetForm(): void {
    this.userForm.reset();
    this.editingUserId = null;
    this.passwordStrength = 0;
    this.passwordStrengthText = '';
    this.passwordStrengthClass = '';
  }

  openPasswordDialog(user: any): void {
    const dialogRef = this.dialog.open(UpdatePasswordDialogComponent, {
      width: '250px',
      data: { user }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedUser = { ...user, password: result.password };
        this.userService.updateUser(user.id, updatedUser).subscribe(
          () => {
            this.loadUsers();
          },
          error => console.error('Error updating password', error)
        );
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    this.updatePasswordStrength();
  }

  onPasswordInput(): void {
    this.updatePasswordStrength();
  }

  updatePasswordStrength(): void {
    const password = this.userForm.get('password')?.value;
    if (password) {
      this.passwordStrength = this.calculatePasswordStrength(password);
      this.updatePasswordStrengthText();
    } else {
      this.passwordStrength = 0;
      this.passwordStrengthText = '';
      this.passwordStrengthClass = '';
    }
  }

  calculatePasswordStrength(password: string): number {
    return Math.min(password.length * 10, 100);
  }

  updatePasswordStrengthText(): void {
    if (this.passwordStrength < 40) {
      this.passwordStrengthText = 'Débil';
      this.passwordStrengthClass = 'bg-danger';
    } else if (this.passwordStrength < 70) {
      this.passwordStrengthText = 'Media';
      this.passwordStrengthClass = 'bg-warning';
    } else {
      this.passwordStrengthText = 'Fuerte';
      this.passwordStrengthClass = 'bg-success';
    }
  }

  applyFilter(event: any): void {
    const filterValue = event.target?.value?.trim().toLowerCase();
    if (filterValue) {
      this.filteredUsers = this.users.filter(user =>
        user.nombre.toLowerCase().includes(filterValue)
      );
    } else {
      this.filteredUsers = this.users;
    }
    this.updatePaginator();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginator();
  }

  private updatePaginator(): void {
    if (this.paginator) {
      this.paginator.pageIndex = this.pageIndex;
      this.paginator.pageSize = this.pageSize;
    }
    this.paginateUsers();
  }

  private paginateUsers(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }
}
