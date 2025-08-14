import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Task, TaskStatus } from '../../models/task.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Sidebar -->
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav 
          #drawer 
          class="sidenav" 
          fixedInViewport="true"
          [opened]="true"
          mode="side">
          
          <!-- User Section -->
          <div class="user-section">
            <div class="user-avatar">
              <mat-icon>account_circle</mat-icon>
            </div>
            <div class="user-info">
              <div class="user-name">{{currentUser?.username || 'Usuario'}}</div>
              <div class="user-email">{{currentUser?.email}}</div>
            </div>
          </div>

          <!-- Navigation Menu -->
          <div class="nav-menu">
            <!-- Tasks Section -->
            <div class="menu-section">
              <div class="section-title">TAREAS</div>
              
              <a mat-list-item 
                 routerLink="/dashboard/today" 
                 routerLinkActive="active-link"
                 class="nav-item">
                <mat-icon matListIcon class="nav-icon today-icon">today</mat-icon>
                <span class="nav-text">Hoy</span>
                <span class="task-badge" *ngIf="todayTasksCount > 0">{{todayTasksCount}}</span>
              </a>

              <a mat-list-item 
                 routerLink="/dashboard/calendar" 
                 routerLinkActive="active-link"
                 class="nav-item">
                <mat-icon matListIcon class="nav-icon calendar-icon">calendar_month</mat-icon>
                <span class="nav-text">Calendario</span>
              </a>
            </div>

            <!-- Categories Section -->
            <div class="menu-section">
              <div class="section-header">
                <div class="section-title">CATEGORÍAS</div>
                <button mat-icon-button class="add-category-btn" (click)="addCategory()" [matMenuTriggerFor]="categoryMenu" #menuTrigger="matMenuTrigger">
                  <mat-icon>add</mat-icon>
                </button>
              </div>

              <div class="categories-list" *ngIf="categories.length > 0">
                <div *ngFor="let category of categories" class="category-item-wrapper">
                  <a mat-list-item
                     [routerLink]="'/dashboard/category/' + category.id"
                     routerLinkActive="active-link"
                     class="nav-item category-item">
                    
                    <div class="category-color" [style.background-color]="category.color"></div>
                    <span class="nav-text">{{category.name}}</span>
                    <span class="task-badge" *ngIf="getCategoryTaskCount(category.id) > 0">
                      {{getCategoryTaskCount(category.id)}}
                    </span>
                  </a>
                  <button mat-icon-button 
                          class="delete-category-btn" 
                          (click)="confirmDeleteCategory(category)"
                          [attr.title]="'Eliminar categoría: ' + category.name">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <div class="no-categories" *ngIf="categories.length === 0">
                <p>No hay categorías</p>
                <button mat-button class="create-first-category" (click)="addCategory()">
                  <mat-icon>add</mat-icon>
                  Crear primera categoría
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Section -->
          <div class="sidebar-bottom">
            <button mat-list-item class="logout-btn" (click)="logout()">
              <mat-icon matListIcon>logout</mat-icon>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </mat-sidenav>

        <!-- Main Content -->
        <mat-sidenav-content class="main-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>

      <!-- Category Menu -->
      <mat-menu #categoryMenu="matMenu">
        <div class="category-form" (click)="$event.stopPropagation()">
          <h3>Nueva Categoría</h3>
          <form [formGroup]="categoryForm" (ngSubmit)="createCategory()">
            
            <!-- Color Picker at the top -->
            <div class="color-picker">
              <label>Selecciona un color:</label>
              <div class="color-options">
                <div *ngFor="let color of colorOptions" 
                     class="color-option" 
                     [class.selected]="categoryForm.get('color')?.value === color"
                     [style.background-color]="color"
                     (click)="selectColor(color)"
                     [attr.title]="color">
                </div>
              </div>
            </div>

            <mat-form-field appearance="outline" class="full-width compact-field">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" placeholder="Ej: Trabajo, Personal...">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width compact-field">
              <mat-label>Descripción (opcional)</mat-label>
              <input matInput formControlName="description" placeholder="Breve descripción">
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancelCategoryCreation()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="categoryForm.invalid">
                Crear Categoría
              </button>
            </div>
          </form>
        </div>
      </mat-menu>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      overflow: hidden;
    }

    .sidenav-container {
      height: 100%;
    }

    .sidenav {
      width: 280px;
      background: #fafafa;
      border-right: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    /* User Section */
    .user-section {
      padding: 20px 16px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background: #4caf50;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .user-avatar mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      font-weight: 600;
      color: #202124;
      font-size: 14px;
    }

    .user-email {
      font-size: 12px;
      color: #5f6368;
    }

    /* Navigation Menu */
    .nav-menu {
      flex: 1;
      padding: 12px 0;
      overflow-y: auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .menu-section {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
    }

    .menu-section:last-of-type {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: #5f6368;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      padding: 0 16px;
    }

    .add-category-btn {
      width: 32px;
      height: 32px;
      line-height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .add-category-btn:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .add-category-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Navigation Items */
    .nav-item {
      height: auto !important;
      padding: 8px 16px !important;
      margin: 2px 8px;
      border-radius: 8px !important;
      display: flex !important;
      align-items: center !important;
      color: #5f6368 !important;
      text-decoration: none !important;
      transition: all 0.2s ease;
    }

    .nav-item:hover {
      background-color: #f1f3f4 !important;
      color: #202124 !important;
    }

    .nav-item.active-link {
      background-color: #e8f5e8 !important;
      color: #4caf50 !important;
      font-weight: 600 !important;
    }

    .nav-icon {
      margin-right: 12px !important;
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
    }

    .today-icon {
      color: #4caf50;
    }

    .calendar-icon {
      color: #ff9800;
    }

    .nav-text {
      flex: 1;
      font-size: 14px;
    }

    .task-badge {
      background: #4caf50;
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 16px;
      text-align: center;
    }

    .nav-item.active-link .task-badge {
      background: #2e7d32;
    }

    /* Category Items */
    .category-item {
      align-items: center !important;
    }

    .category-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .categories-list {
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 4px;
      flex: 1;
      min-height: 0;
    }

    .category-item-wrapper {
      display: flex;
      align-items: center;
      margin: 2px 4px 2px 8px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
      position: relative;
      max-width: 100%;
      overflow: hidden;
    }

    .category-item-wrapper:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .category-item-wrapper:hover .delete-category-btn {
      opacity: 1;
    }

    .category-item-wrapper .category-item {
      flex: 1;
      margin: 0 !important;
      border-radius: 8px !important;
      min-width: 0;
      overflow: hidden;
    }

    .category-item-wrapper .category-item .nav-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .delete-category-btn {
      width: 24px;
      height: 24px;
      min-width: 24px;
      opacity: 0;
      transition: all 0.2s ease;
      color: #f44336;
      margin-left: 2px;
      flex-shrink: 0;
      border-radius: 50%;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 !important;
    }

    .delete-category-btn:hover {
      background-color: rgba(244, 67, 54, 0.1);
      color: #d32f2f;
    }

    .delete-category-btn mat-icon {
      font-size: 14px !important;
      width: 14px !important;
      height: 14px !important;
      line-height: 14px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .no-categories {
      padding: 16px;
      text-align: center;
      color: #5f6368;
    }

    .no-categories p {
      margin: 0 0 8px 0;
      font-size: 12px;
    }

    .create-first-category {
      font-size: 12px;
      color: #4caf50;
    }

    .create-first-category mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    /* Bottom Section */
    .sidebar-bottom {
      padding: 16px 8px 16px 8px;
      border-top: 1px solid #e0e0e0;
      flex-shrink: 0;
      background: #fafafa;
      position: sticky;
      bottom: 0;
    }

    .logout-btn {
      width: 100%;
      color: #d32f2f !important;
      text-align: left !important;
      padding: 12px 16px !important;
      border-radius: 8px !important;
      margin: 0 !important;
      transition: background-color 0.2s ease;
    }

    .logout-btn:hover {
      background-color: rgba(211, 47, 47, 0.08) !important;
    }

    .logout-btn mat-icon {
      color: #d32f2f !important;
    }

    /* Main Content */
    .main-content {
      background: #ffffff;
    }

    .content-wrapper {
      height: 100vh;
      overflow-y: auto;
    }

    /* Category Form */
    .category-form {
      padding: 16px;
      width: 280px;
      background: white;
      border-radius: 8px;
      max-height: 400px;
      max-width: 280px;
      overflow: hidden !important;
      box-sizing: border-box;
    }

    /* Force no scroll on mat-menu */
    ::ng-deep .mat-mdc-menu-panel {
      overflow: hidden !important;
      max-width: 320px !important;
    }

    ::ng-deep .mat-mdc-menu-content {
      overflow: hidden !important;
      padding: 0 !important;
    }

    .category-form h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 500;
      color: #202124;
      text-align: center;
    }

    .full-width {
      width: 100%;
      margin-bottom: 10px;
      max-width: 248px;
      overflow: hidden;
    }

    .compact-field {
      font-size: 14px;
    }

    .compact-field .mat-mdc-form-field-infix {
      min-height: 44px;
    }

    ::ng-deep .category-form .mat-mdc-form-field {
      width: 100% !important;
      max-width: 248px !important;
    }

    .color-picker {
      margin-bottom: 16px;
      text-align: center;
    }

    .color-picker label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #202124;
      margin-bottom: 8px;
    }

    .color-options {
      display: flex;
      gap: 4px;
      justify-content: center;
      flex-wrap: wrap;
      max-width: 240px;
      margin: 0 auto;
      overflow: hidden;
    }

    .color-option {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s ease;
      position: relative;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
    }

    .color-option:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .color-option.selected {
      border-color: #1976d2;
      transform: scale(1.15);
      box-shadow: 0 2px 6px rgba(25, 118, 210, 0.4);
    }

    .color-option.selected::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    }

    .form-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 12px;
    }

    .form-actions button {
      min-width: 70px;
      font-size: 13px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidenav {
        width: 260px;
      }
    }

    /* Snackbar Styles */
    ::ng-deep .success-snackbar {
      background-color: #4caf50 !important;
      color: white !important;
    }

    ::ng-deep .error-snackbar {
      background-color: #f44336 !important;
      color: white !important;
    }

    ::ng-deep .mat-mdc-snack-bar-container .mdc-snackbar__surface {
      border-radius: 8px !important;
    }
  `]
})
export class DashboardComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  
  currentUser: any = null;
  categories: Category[] = [];
  allTasks: Task[] = [];
  
  // Task counts for badges
  todayTasksCount = 0;
  
    // Category form
  categoryForm: FormGroup;
  colorOptions = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#00bcd4', '#009688', 
    '#4caf50', '#8bc34a', '#ffc107', '#ff5722'
  ];
  
  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      color: [this.colorOptions[0], Validators.required]
    });
  }

  ngOnInit() {
    // Check authentication first
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No authentication token found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      console.log('No current user found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    // Load data only if authenticated
    this.loadCategories();
    this.loadTasks();
    
    // Navigate to Today by default
    if (this.router.url === '/dashboard' || this.router.url === '/dashboard/') {
      this.router.navigate(['/dashboard/today']);
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        if (response.status_code === 200) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // If unauthorized, redirect to login
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (response: any) => {
        if (response.status_code === 200) {
          this.allTasks = response.data;
          this.calculateTaskCounts();
        }
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        // If unauthorized, redirect to login
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          // Reset tasks on other errors
          this.allTasks = [];
          this.calculateTaskCounts();
        }
      }
    });
  }

  calculateTaskCounts() {
    const today = new Date().toISOString().split('T')[0];
    
    // Count today tasks
    this.todayTasksCount = this.allTasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(today)
    ).length;
  }

  getCategoryTaskCount(categoryId: number): number {
    return this.allTasks.filter(task => task.categoryId === categoryId).length;
  }

  // Removed automatic sample data creation methods
  // createSampleCategories() and createSampleTasks() have been disabled
  // to prevent automatic data creation on dashboard load

  addCategory() {
    // This will be handled by the mat-menu
  }

  selectColor(color: string) {
    this.categoryForm.patchValue({ color });
  }

  cancelCategoryCreation() {
    this.categoryForm.reset();
    this.categoryForm.patchValue({ color: this.colorOptions[0] });
    this.menuTrigger.closeMenu();
  }

  confirmDeleteCategory(category: Category) {
    const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`);
    if (confirmDelete) {
      this.deleteCategory(category.id);
    }
  }

  deleteCategory(categoryId: number) {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (response: any) => {
        if (response.status_code === 200 || response.status_code === 204) {
          this.snackBar.open(
            'Categoría eliminada exitosamente', 
            'Cerrar', 
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            }
          );
          this.loadCategories();
          this.loadTasks(); // Recargar tareas por si había tareas en esa categoría
        }
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.snackBar.open(
          'Error al eliminar la categoría. Inténtalo de nuevo.', 
          'Cerrar', 
          {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  createCategory() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      this.categoryService.createCategory(categoryData).subscribe({
        next: (response: any) => {
          if (response.status_code === 201) {
            // Cerrar el menú
            this.menuTrigger.closeMenu();
            
            // Mostrar confirmación
            this.snackBar.open(
              `Categoría "${categoryData.name}" creada exitosamente`, 
              'Cerrar', 
              {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
              }
            );
            
            // Recargar categorías
            this.loadCategories();
            
            // Resetear formulario
            this.categoryForm.reset();
            this.categoryForm.patchValue({ color: this.colorOptions[0] });
          }
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.snackBar.open(
            'Error al crear la categoría. Inténtalo de nuevo.', 
            'Cerrar', 
            {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
