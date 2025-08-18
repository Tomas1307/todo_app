import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Task, TaskStatus } from '../../models/task.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatChipsModule,
    MatMenuModule
  ],
  template: `
    <div class="today-container">
      <div class="header">
        <div class="title-section">
          <mat-icon class="title-icon">today</mat-icon>
          <h1>Hoy</h1>
          <span class="task-count">{{todayTasks.length}}</span>
        </div>
        <button mat-icon-button (click)="showAddTask = !showAddTask" class="add-btn">
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <!-- Add Task Form -->
      <div class="add-task-form" *ngIf="showAddTask">
        <div class="form-header">
          <h3>Nueva Tarea</h3>
          <p class="form-subtitle">Agrega una nueva tarea para hoy</p>
        </div>
        
        <form [formGroup]="taskForm" (ngSubmit)="addTask()">
          <mat-form-field appearance="outline" class="full-width compact-field">
            <mat-label>Nombre de la tarea</mat-label>
            <input matInput formControlName="text" placeholder="Ej: Completar informe del proyecto...">
            <mat-icon matSuffix>assignment</mat-icon>
            <mat-error *ngIf="taskForm.get('text')?.hasError('required')">
              El nombre de la tarea es requerido
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width compact-field">
              <mat-label>Categoría</mat-label>
              <mat-select formControlName="categoryId">
                <mat-option *ngFor="let category of categories" [value]="category.id">
                  <div class="category-option">
                    <span class="category-dot" [style.background-color]="category.color"></span>
                    <span class="category-name">{{category.name}}</span>
                  </div>
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>folder</mat-icon>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width compact-field">
            <mat-label>Fecha de vencimiento (opcional - por defecto hoy)</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dueDate" placeholder="Selecciona una fecha">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-hint>Si no seleccionas una fecha, se asignará para hoy</mat-hint>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelAddTask()" class="cancel-btn">
              <mat-icon>close</mat-icon>
              Cancelar
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid" class="submit-btn">
              <mat-icon>add</mat-icon>
              Crear Tarea
            </button>
          </div>
        </form>
      </div>

      <!-- Tasks List -->
      <div class="tasks-list" *ngIf="todayTasks.length > 0; else noTasks">
        <div class="task-item" *ngFor="let task of todayTasks" [class.completed]="task.status === TaskStatus.FINALIZADA">
          <div class="task-status-control">
            <button mat-icon-button 
                    [matMenuTriggerFor]="statusMenu" 
                    class="status-button"
                    [class.status-pending]="task.status === TaskStatus.SIN_EMPEZAR"
                    [class.status-in-progress]="task.status === TaskStatus.EMPEZADA"
                    [class.status-completed]="task.status === TaskStatus.FINALIZADA">
              <mat-icon *ngIf="task.status === TaskStatus.SIN_EMPEZAR">schedule</mat-icon>
              <mat-icon *ngIf="task.status === TaskStatus.EMPEZADA">play_circle</mat-icon>
              <mat-icon *ngIf="task.status === TaskStatus.FINALIZADA">check_circle</mat-icon>
            </button>
            
            <mat-menu #statusMenu="matMenu">
              <button mat-menu-item (click)="changeTaskStatus(task, TaskStatus.SIN_EMPEZAR)">
                <mat-icon class="status-icon pending">schedule</mat-icon>
                <span>Sin Empezar</span>
              </button>
              <button mat-menu-item (click)="changeTaskStatus(task, TaskStatus.EMPEZADA)">
                <mat-icon class="status-icon in-progress">play_circle</mat-icon>
                <span>En Progreso</span>
              </button>
              <button mat-menu-item (click)="changeTaskStatus(task, TaskStatus.FINALIZADA)">
                <mat-icon class="status-icon completed">check_circle</mat-icon>
                <span>Finalizada</span>
              </button>
            </mat-menu>
          </div>
          
          <div class="task-content">
            <div class="task-header">
              <div class="task-text-with-indicator">
                <div class="category-indicator" 
                     *ngIf="task.category"
                     [style.background-color]="task.category.color">
                </div>
                <div class="task-text" [class.strikethrough]="task.status === TaskStatus.FINALIZADA">
                  {{task.text}}
                </div>
                <div class="task-status-badge" 
                     [class.status-pending]="task.status === TaskStatus.SIN_EMPEZAR"
                     [class.status-in-progress]="task.status === TaskStatus.EMPEZADA"
                     [class.status-completed]="task.status === TaskStatus.FINALIZADA">
                  <mat-icon class="status-icon">
                    {{task.status === TaskStatus.SIN_EMPEZAR ? 'schedule' : 
                      task.status === TaskStatus.EMPEZADA ? 'play_circle' : 'check_circle'}}
                  </mat-icon>
                  <span class="status-text">
                    {{task.status === TaskStatus.SIN_EMPEZAR ? 'Pendiente' : 
                      task.status === TaskStatus.EMPEZADA ? 'En Progreso' : 'Completada'}}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="task-meta" *ngIf="task.category || task.dueDate">
              <mat-chip 
                *ngIf="task.category" 
                class="category-chip"
                [style.background-color]="task.category.color"
                [style.color]="getContrastColor(task.category.color)"
                [style.border]="'2px solid ' + task.category.color">
                <span class="category-name">{{task.category.name}}</span>
              </mat-chip>
              
              <span class="due-date" *ngIf="task.dueDate">
                <mat-icon class="date-icon">schedule</mat-icon>
                {{formatDate(task.dueDate)}}
              </span>
            </div>
          </div>

          <div class="task-actions">
            <button mat-icon-button (click)="deleteTask(task.id)">
              <mat-icon>delete_outline</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <ng-template #noTasks>
        <div class="no-tasks">
          <mat-icon class="no-tasks-icon">check_circle_outline</mat-icon>
          <h3>¡Muy bien!</h3>
          <p>No tienes tareas pendientes para hoy.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .today-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .title-icon {
      color: #4caf50;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #202124;
    }

    .task-count {
      background: #f1f3f4;
      color: #5f6368;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
    }

    .add-btn {
      color: #4caf50;
    }

    .add-task-form {
      background: white;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .add-task-form:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .form-header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f0f0f0;
    }

    .form-header h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
      color: #202124;
    }

    .form-subtitle {
      margin: 0;
      color: #5f6368;
      font-size: 14px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }

    .half-width {
      flex: 1;
    }

    .compact-field {
      font-size: 14px;
    }

    .compact-field .mat-mdc-form-field-infix {
      min-height: 52px;
    }

    .compact-field mat-icon {
      color: #5f6368;
    }

    .category-dot {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      margin-right: 12px;
      border: 2px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      flex-shrink: 0;
    }

    .category-option {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 8px 0;
    }

    .category-name {
      font-size: 14px;
      font-weight: 500;
      color: #202124;
    }

    .status-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 0;
      font-size: 14px;
      font-weight: 500;
    }

    .status-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
    }

    .status-icon.pending {
      color: #ff9800;
    }

    .status-icon.in-progress {
      color: #2196f3;
    }

    .status-icon.completed {
      color: #4caf50;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
    }

    .cancel-btn {
      min-width: 120px;
      padding: 0 20px;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .cancel-btn:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .submit-btn {
      min-width: 140px;
      padding: 0 20px;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
      transition: all 0.2s ease;
    }

    .submit-btn:hover:not([disabled]) {
      box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
      transform: translateY(-1px);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      box-shadow: none;
    }

    .form-actions button mat-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    /* Form Field Hover Effects */
    ::ng-deep .add-task-form .mat-mdc-form-field:not(.mat-form-field-disabled):hover .mat-mdc-form-field-outline {
      color: rgba(33, 150, 243, 0.6) !important;
    }

    ::ng-deep .add-task-form .mat-mdc-form-field-focused .mat-mdc-form-field-outline {
      color: #2196f3 !important;
      border-width: 2px !important;
    }

    /* Select Panel Styling */
    ::ng-deep .mat-mdc-select-panel {
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }

    ::ng-deep .mat-mdc-option:hover {
      background-color: rgba(33, 150, 243, 0.08) !important;
    }

    /* Date Picker Styling */
    ::ng-deep .mat-datepicker-toggle {
      color: #5f6368 !important;
    }

    ::ng-deep .mat-datepicker-toggle:hover {
      color: #2196f3 !important;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .add-task-form {
        padding: 20px 16px;
        margin: 16px;
      }

      .form-row {
        flex-direction: column;
        gap: 12px;
      }

      .half-width {
        width: 100%;
      }

      .form-actions {
        flex-direction: column-reverse;
        gap: 12px;
      }

      .form-actions button {
        width: 100%;
        min-width: auto;
      }
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .task-item {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e8eaed;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .task-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, #4caf50, #66bb6a);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .task-item:hover {
      border-color: #4caf50;
      box-shadow: 0 4px 20px rgba(76, 175, 80, 0.15);
      transform: translateY(-2px);
    }

    .task-item:hover::before {
      opacity: 1;
    }

    .task-item.completed {
      opacity: 0.8;
      background: #f8f9fa;
    }

    .task-item.completed::before {
      background: linear-gradient(180deg, #9e9e9e, #bdbdbd);
      opacity: 1;
    }

    .task-status-control {
      margin-right: 12px;
      margin-top: 2px;
    }

    .status-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .status-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      transition: all 0.3s ease;
      opacity: 0;
    }

    .status-button:hover::before {
      opacity: 1;
    }

    .status-button.status-pending {
      color: #ff9800;
      background-color: rgba(255, 152, 0, 0.1);
      border-color: rgba(255, 152, 0, 0.3);
    }

    .status-button.status-pending::before {
      background: linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(255, 193, 7, 0.2));
    }

    .status-button.status-in-progress {
      color: #2196f3;
      background-color: rgba(33, 150, 243, 0.1);
      border-color: rgba(33, 150, 243, 0.3);
    }

    .status-button.status-in-progress::before {
      background: linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(3, 169, 244, 0.2));
    }

    .status-button.status-completed {
      color: #4caf50;
      background-color: rgba(76, 175, 80, 0.1);
      border-color: rgba(76, 175, 80, 0.3);
    }

    .status-button.status-completed::before {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.2));
    }

    .status-button:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .status-button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      z-index: 1;
    }

    .task-content {
      flex: 1;
    }

    .task-header {
      margin-bottom: 4px;
    }

    .task-text-with-indicator {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      width: 100%;
    }

    .task-status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      border: 1px solid transparent;
      margin-left: auto;
      white-space: nowrap;
    }

    .task-status-badge.status-pending {
      background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 193, 7, 0.05));
      color: #ef6c00;
      border-color: rgba(255, 152, 0, 0.2);
    }

    .task-status-badge.status-in-progress {
      background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(3, 169, 244, 0.05));
      color: #1565c0;
      border-color: rgba(33, 150, 243, 0.2);
    }

    .task-status-badge.status-completed {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.05));
      color: #2e7d32;
      border-color: rgba(76, 175, 80, 0.2);
    }

    .task-status-badge .status-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .task-status-badge .status-text {
      font-size: 11px;
      font-weight: 700;
    }

    .category-indicator {
      width: 4px;
      min-height: 20px;
      border-radius: 2px;
      margin-top: 2px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    }

    .task-text {
      font-size: 16px;
      color: #202124;
      line-height: 1.5;
      flex: 1;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .task-text.strikethrough {
      text-decoration: line-through;
      color: #80868b;
      opacity: 0.8;
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      margin-left: 16px;
    }

    .category-chip {
      font-size: 12px;
      height: 26px;
      border-radius: 13px;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }

    .category-chip:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .category-name {
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 11px;
    }

    .due-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #5f6368;
    }

    .date-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .task-actions {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .task-item:hover .task-actions {
      opacity: 1;
    }

    .no-tasks {
      text-align: center;
      padding: 48px 24px;
      color: #5f6368;
    }

    .no-tasks-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #4caf50;
      margin-bottom: 16px;
    }

    .no-tasks h3 {
      margin: 0 0 8px 0;
      color: #202124;
    }

    .no-tasks p {
      margin: 0;
      font-size: 14px;
    }

    /* Status Menu Items */
    ::ng-deep .mat-mdc-menu-panel {
      border-radius: 12px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
    }

    ::ng-deep .mat-mdc-menu-content {
      padding: 8px !important;
    }

    ::ng-deep .mat-mdc-menu-item {
      border-radius: 8px !important;
      margin-bottom: 2px !important;
      transition: all 0.2s ease !important;
      font-size: 14px !important;
      padding: 12px 16px !important;
      min-height: auto !important;
    }

    ::ng-deep .mat-mdc-menu-item:hover {
      background-color: rgba(0, 0, 0, 0.04) !important;
      transform: translateX(2px) !important;
    }

    ::ng-deep .mat-mdc-menu-content .status-icon {
      margin-right: 12px !important;
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
    }

    ::ng-deep .mat-mdc-menu-content .status-icon.pending {
      color: #ff9800 !important;
    }

    ::ng-deep .mat-mdc-menu-content .status-icon.in-progress {
      color: #2196f3 !important;
    }

    ::ng-deep .mat-mdc-menu-content .status-icon.completed {
      color: #4caf50 !important;
    }

    ::ng-deep .mat-mdc-menu-item span {
      font-weight: 500 !important;
      color: #202124 !important;
    }
  `]
})
export class TodayComponent implements OnInit {
  TaskStatus = TaskStatus;
  todayTasks: Task[] = [];
  categories: Category[] = [];
  showAddTask = false;
  taskForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: ['', Validators.required],
      dueDate: [''] // Opcional, se asignará hoy por defecto si está vacío
    });
  }

  ngOnInit() {
    // Only load data if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      this.loadCategories();
      this.loadTodayTasks();
    } else {
      console.log('User not authenticated, skipping data load');
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
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadTodayTasks() {
    this.taskService.getTasks().subscribe({
      next: (response: any) => {
        if (response.status_code === 200) {
          const today = new Date().toISOString().split('T')[0];
          this.todayTasks = response.data.filter((task: Task) => 
            task.dueDate && task.dueDate.split('T')[0] === today
          );
        }
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  addTask() {
    if (this.taskForm.valid) {
      const taskData = { ...this.taskForm.value };
      
      // Si no se especifica fecha, usar hoy
      if (!taskData.dueDate) {
        const today = new Date();
        taskData.dueDate = today.toISOString();
      } else {
        // Convertir la fecha a formato ISO completo que espera el backend
        const date = new Date(taskData.dueDate);
        taskData.dueDate = date.toISOString();
      }
      
      // Asignar estado por defecto como "Sin Empezar"
      taskData.status = TaskStatus.SIN_EMPEZAR;
      
      // Convertir categoryId a number
      if (taskData.categoryId) {
        taskData.categoryId = Number(taskData.categoryId);
      } else {
        // Si no hay categoría seleccionada, usar la primera disponible
        if (this.categories.length > 0) {
          taskData.categoryId = this.categories[0].id;
        }
      }


      this.taskService.createTask(taskData).subscribe({
        next: (response: any) => {
          if (response.status_code === 201) {
            this.taskForm.reset();
            this.showAddTask = false;
            
            // Recargar tareas inmediatamente
            setTimeout(() => {
              this.loadTodayTasks();
            }, 500);
          }
        },
        error: (error) => {
          console.error('Error creating task:', error);
          console.error('Error details:', error.error);
        }
      });
    } else {
      console.log('Form is invalid:', this.taskForm.errors);
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        if (control && control.invalid) {
          console.log(`Field ${key} is invalid:`, control.errors);
        }
      });
    }
  }

  cancelAddTask() {
    this.showAddTask = false;
    this.taskForm.reset();
  }

  changeTaskStatus(task: Task, newStatus: TaskStatus) {
    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => {
        task.status = newStatus;
      },
      error: (error) => console.error('Error updating task:', error)
    });
  }

  deleteTask(taskId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTodayTasks();
        },
        error: (error) => console.error('Error deleting task:', error)
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  }

  getContrastColor(hexColor: string): string {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128 ? '#ffffff' : '#000000';
  }
}
