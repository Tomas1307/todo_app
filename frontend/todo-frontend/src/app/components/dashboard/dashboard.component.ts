import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
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

          <!-- Quick Actions -->
          <div class="quick-actions">
            <button mat-button class="add-task-btn" (click)="quickAddTask()">
              <mat-icon>add</mat-icon>
              <span>Agregar tarea</span>
            </button>
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
                 routerLink="/dashboard/upcoming" 
                 routerLinkActive="active-link"
                 class="nav-item">
                <mat-icon matListIcon class="nav-icon upcoming-icon">upcoming</mat-icon>
                <span class="nav-text">Próximo</span>
                <span class="task-badge" *ngIf="upcomingTasksCount > 0">{{upcomingTasksCount}}</span>
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
                <button mat-icon-button class="add-category-btn" (click)="addCategory()" [matMenuTriggerFor]="categoryMenu">
                  <mat-icon>add</mat-icon>
                </button>
              </div>

              <div class="categories-list" *ngIf="categories.length > 0">
                <a *ngFor="let category of categories" 
                   mat-list-item
                   [routerLink]="'/dashboard/category/' + category.id"
                   routerLinkActive="active-link"
                   class="nav-item category-item">
                  
                  <div class="category-color" [style.background-color]="category.color"></div>
                  <span class="nav-text">{{category.name}}</span>
                  <span class="task-badge" *ngIf="getCategoryTaskCount(category.id) > 0">
                    {{getCategoryTaskCount(category.id)}}
                  </span>
                </a>
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
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" placeholder="Ej: Trabajo, Personal...">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <input matInput formControlName="description" placeholder="Descripción opcional">
            </mat-form-field>

            <div class="color-picker">
              <label>Color:</label>
              <div class="color-options">
                <div *ngFor="let color of colorOptions" 
                     class="color-option" 
                     [class.selected]="categoryForm.get('color')?.value === color"
                     [style.background-color]="color"
                     (click)="selectColor(color)">
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" [mat-menu-trigger-for]="null">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="categoryForm.invalid">
                Crear
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

    /* Quick Actions */
    .quick-actions {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    .add-task-btn {
      width: 100%;
      justify-content: flex-start;
      padding: 8px 16px;
      border-radius: 8px;
      color: #4caf50;
      font-weight: 500;
    }

    .add-task-btn mat-icon {
      margin-right: 8px;
    }

    /* Navigation Menu */
    .nav-menu {
      flex: 1;
      padding: 12px 0;
      overflow-y: auto;
    }

    .menu-section {
      margin-bottom: 24px;
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
      width: 24px;
      height: 24px;
      line-height: 24px;
    }

    .add-category-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
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

    .upcoming-icon {
      color: #9c27b0;
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
      max-height: 200px;
      overflow-y: auto;
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
      padding: 12px 8px;
      border-top: 1px solid #e0e0e0;
    }

    .logout-btn {
      width: 100%;
      color: #d32f2f !important;
      text-align: left !important;
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
      width: 300px;
    }

    .category-form h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #202124;
    }

    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }

    .color-picker {
      margin-bottom: 16px;
    }

    .color-picker label {
      display: block;
      font-size: 12px;
      color: #5f6368;
      margin-bottom: 8px;
    }

    .color-options {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .color-option {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .color-option:hover {
      transform: scale(1.1);
    }

    .color-option.selected {
      border-color: #4caf50;
      transform: scale(1.1);
    }

    .form-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidenav {
        width: 260px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  categories: Category[] = [];
  allTasks: Task[] = [];
  
  // Task counts for badges
  todayTasksCount = 0;
  upcomingTasksCount = 0;
  
  // Category form
  categoryForm: FormGroup;
  colorOptions = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
  ];
  
  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      color: ['#4caf50', Validators.required]
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
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
          
          // Create sample categories if none exist
          if (this.categories.length === 0) {
            this.createSampleCategories();
          }
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // If categories fail to load, try to create sample ones
        this.createSampleCategories();
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
      }
    });
  }

  calculateTaskCounts() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Count today tasks
    this.todayTasksCount = this.allTasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(today)
    ).length;
    
    // Count upcoming tasks (today + this week)
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    
    this.upcomingTasksCount = this.allTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate <= endOfWeek;
    }).length;
  }

  getCategoryTaskCount(categoryId: number): number {
    return this.allTasks.filter(task => task.categoryId === categoryId).length;
  }

  createSampleCategories() {
    const sampleCategories = [
      { name: 'Trabajo', color: '#2196f3', description: 'Tareas relacionadas con el trabajo' },
      { name: 'Personal', color: '#4caf50', description: 'Tareas personales' },
      { name: 'Estudios', color: '#ff9800', description: 'Aprendizaje y educación' },
      { name: 'Salud', color: '#f44336', description: 'Salud y ejercicio' }
    ];

    let categoriesCreated = 0;
    sampleCategories.forEach(category => {
      this.categoryService.createCategory(category).subscribe({
        next: (response: any) => {
          if (response.status_code === 201) {
            console.log('Sample category created:', category.name);
            categoriesCreated++;
            if (categoriesCreated === sampleCategories.length) {
              this.loadCategories();
              setTimeout(() => {
                this.createSampleTasks();
              }, 1000);
            }
          }
        },
        error: (error) => {
          console.log('Error creating sample category:', error);
          categoriesCreated++;
          if (categoriesCreated === sampleCategories.length) {
            this.loadCategories();
          }
        }
      });
    });
  }

  createSampleTasks() {
    if (this.categories.length > 0) {
      const sampleTasks = [
        {
          text: 'Caso de Estudio - Arquitectura de Infraestructura',
          categoryId: this.categories.find(c => c.name === 'Estudios')?.id || this.categories[0].id,
          status: TaskStatus.SIN_EMPEZAR,
          dueDate: '2025-08-10'
        },
        {
          text: 'Responder emails importantes',
          categoryId: this.categories.find(c => c.name === 'Trabajo')?.id || this.categories[0].id,
          status: TaskStatus.SIN_EMPEZAR
        },
        {
          text: 'Enviar Propuesta de Trabajo',
          categoryId: this.categories.find(c => c.name === 'Trabajo')?.id || this.categories[0].id,
          status: TaskStatus.SIN_EMPEZAR,
          dueDate: '2025-08-11'
        },
        {
          text: 'Ejercicio matutino',
          categoryId: this.categories.find(c => c.name === 'Salud')?.id || this.categories[0].id,
          status: TaskStatus.SIN_EMPEZAR,
          dueDate: '2025-08-10'
        }
      ];

      // Create sample tasks only if we don't have any tasks yet
      setTimeout(() => {
        if (this.allTasks.length === 0) {
          sampleTasks.forEach(task => {
            this.taskService.createTask(task).subscribe({
              next: (response: any) => {
                if (response.status_code === 201) {
                  console.log('Sample task created:', task.text);
                }
              },
              error: (error) => {
                console.log('Error creating sample task:', error);
              }
            });
          });
          
          // Reload tasks after creating samples
          setTimeout(() => {
            this.loadTasks();
          }, 2000);
        }
      }, 500);
    }
  }

  quickAddTask() {
    // Navigate to today view and trigger add task
    this.router.navigate(['/dashboard/today']);
    // TODO: Implement a service to communicate with TodayComponent to show add task form
  }

  addCategory() {
    // This will be handled by the mat-menu
  }

  selectColor(color: string) {
    this.categoryForm.patchValue({ color });
  }

  createCategory() {
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: (response: any) => {
          if (response.status_code === 201) {
            this.loadCategories();
            this.categoryForm.reset();
            this.categoryForm.patchValue({ color: '#4caf50' });
          }
        },
        error: (error) => {
          console.error('Error creating category:', error);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
