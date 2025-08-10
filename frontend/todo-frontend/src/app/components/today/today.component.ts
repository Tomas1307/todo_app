import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
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
    MatChipsModule
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
        <form [formGroup]="taskForm" (ngSubmit)="addTask()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre de la tarea</mat-label>
            <input matInput formControlName="text" placeholder="Ej: Completar informe...">
            <mat-error *ngIf="taskForm.get('text')?.hasError('required')">
              El nombre de la tarea es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Categoría</mat-label>
            <mat-select formControlName="categoryId">
              <mat-option *ngFor="let category of categories" [value]="category.id">
                <div class="category-option">
                  <span class="category-dot" [style.background-color]="category.color"></span>
                  <span class="category-name">{{category.name}}</span>
                  <span class="category-color-preview" [style.background-color]="category.color"></span>
                </div>
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="status">
              <mat-option [value]="TaskStatus.SIN_EMPEZAR">Sin Empezar</mat-option>
              <mat-option [value]="TaskStatus.EMPEZADA">Empezada</mat-option>
              <mat-option [value]="TaskStatus.FINALIZADA">Finalizada</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Fecha de vencimiento</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dueDate">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelAddTask()">Cancelar</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid">
              Agregar tarea
            </button>
          </div>
        </form>
      </div>

      <!-- Tasks List -->
      <div class="tasks-list" *ngIf="todayTasks.length > 0; else noTasks">
        <div class="task-item" *ngFor="let task of todayTasks" [class.completed]="task.status === TaskStatus.FINALIZADA">
          <div class="task-checkbox">
            <mat-checkbox 
              [checked]="task.status === TaskStatus.FINALIZADA"
              (change)="toggleTaskComplete(task, $event.checked)"
              [color]="'primary'">
            </mat-checkbox>
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
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #dadce0;
      margin-bottom: 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .category-dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
      border: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .category-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 4px 0;
    }

    .category-color-preview {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .task-item {
      display: flex;
      align-items: flex-start;
      padding: 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid #dadce0;
      transition: all 0.2s ease;
    }

    .task-item:hover {
      border-color: #4caf50;
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
    }

    .task-item.completed {
      opacity: 0.7;
    }

    .task-checkbox {
      margin-right: 12px;
      margin-top: 2px;
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
      gap: 12px;
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
      line-height: 1.4;
      flex: 1;
    }

    .task-text.strikethrough {
      text-decoration: line-through;
      color: #5f6368;
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
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: ['', Validators.required],
      status: [TaskStatus.SIN_EMPEZAR],
      dueDate: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadTodayTasks();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        if (response.status_code === 200) {
          this.categories = response.data;
        }
      },
      error: (error) => console.error('Error loading categories:', error)
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
          console.log(`Found ${this.todayTasks.length} tasks for today`);
        }
      },
      error: (error) => console.error('Error loading tasks:', error)
    });
  }

  addTask() {
    if (this.taskForm.valid) {
      const taskData = { ...this.taskForm.value };
      if (taskData.dueDate) {
        // Convertir la fecha a formato ISO completo que espera el backend
        const date = new Date(taskData.dueDate);
        taskData.dueDate = date.toISOString();
      }
      
      // Convertir categoryId a number
      if (taskData.categoryId) {
        taskData.categoryId = Number(taskData.categoryId);
      } else {
        // Si no hay categoría seleccionada, usar la primera disponible
        if (this.categories.length > 0) {
          taskData.categoryId = this.categories[0].id;
        }
      }

      console.log('Sending task data:', taskData);

      this.taskService.createTask(taskData).subscribe({
        next: (response: any) => {
          if (response.status_code === 201) {
            this.taskForm.reset();
            this.taskForm.patchValue({ status: TaskStatus.SIN_EMPEZAR });
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
    this.taskForm.patchValue({ status: TaskStatus.SIN_EMPEZAR });
  }

  toggleTaskComplete(task: Task, completed: boolean) {
    const newStatus = completed ? TaskStatus.FINALIZADA : TaskStatus.SIN_EMPEZAR;
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
