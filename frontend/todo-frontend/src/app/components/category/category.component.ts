import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Task, TaskStatus } from '../../models/task.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  template: `
    <div class="category-container" *ngIf="category">
      <div class="header">
        <div class="title-section">
          <div class="category-icon" [style.background-color]="category.color">
            <mat-icon>folder</mat-icon>
          </div>
          <div class="title-info">
            <h1>{{category.name}}</h1>
            <p class="category-description" *ngIf="category.description">
              {{category.description}}
            </p>
          </div>
          <span class="task-count">{{categoryTasks.length}}</span>
        </div>
      </div>

      <!-- Task Statistics -->
      <div class="stats-section" *ngIf="categoryTasks.length > 0">
        <div class="stat-item">
          <span class="stat-number">{{getTasksByStatus(TaskStatus.SIN_EMPEZAR).length}}</span>
          <span class="stat-label">Sin empezar</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{getTasksByStatus(TaskStatus.EMPEZADA).length}}</span>
          <span class="stat-label">En progreso</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{getTasksByStatus(TaskStatus.FINALIZADA).length}}</span>
          <span class="stat-label">Completadas</span>
        </div>
      </div>

      <!-- Tasks by Status -->
      <div class="tasks-sections">
        <!-- Pending Tasks -->
        <div class="task-section" *ngIf="getTasksByStatus(TaskStatus.SIN_EMPEZAR).length > 0">
          <div class="section-header">
            <mat-icon class="section-icon">radio_button_unchecked</mat-icon>
            <h3>Sin empezar</h3>
            <span class="section-count">{{getTasksByStatus(TaskStatus.SIN_EMPEZAR).length}}</span>
          </div>
          
          <div class="tasks-list">
            <div class="task-item" *ngFor="let task of getTasksByStatus(TaskStatus.SIN_EMPEZAR)">
              <div class="task-checkbox">
                <mat-checkbox 
                  [checked]="false"
                  (change)="toggleTaskComplete(task, $event.checked)"
                  [color]="'primary'">
                </mat-checkbox>
              </div>
              
              <div class="task-content">
                <div class="task-text">{{task.text}}</div>
                
                <div class="task-meta" *ngIf="task.dueDate">
                  <span class="due-date" [class.overdue]="isOverdue(task)">
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
        </div>

        <!-- In Progress Tasks -->
        <div class="task-section" *ngIf="getTasksByStatus(TaskStatus.EMPEZADA).length > 0">
          <div class="section-header">
            <mat-icon class="section-icon" style="color: #ff9800;">schedule</mat-icon>
            <h3>En progreso</h3>
            <span class="section-count">{{getTasksByStatus(TaskStatus.EMPEZADA).length}}</span>
          </div>
          
          <div class="tasks-list">
            <div class="task-item" *ngFor="let task of getTasksByStatus(TaskStatus.EMPEZADA)">
              <div class="task-checkbox">
                <mat-checkbox 
                  [checked]="false"
                  (change)="toggleTaskComplete(task, $event.checked)"
                  [color]="'primary'">
                </mat-checkbox>
              </div>
              
              <div class="task-content">
                <div class="task-text">{{task.text}}</div>
                
                <div class="task-meta" *ngIf="task.dueDate">
                  <span class="due-date" [class.overdue]="isOverdue(task)">
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
        </div>

        <!-- Completed Tasks -->
        <div class="task-section" *ngIf="getTasksByStatus(TaskStatus.FINALIZADA).length > 0">
          <div class="section-header">
            <mat-icon class="section-icon" style="color: #4caf50;">check_circle</mat-icon>
            <h3>Completadas</h3>
            <span class="section-count">{{getTasksByStatus(TaskStatus.FINALIZADA).length}}</span>
          </div>
          
          <div class="tasks-list">
            <div class="task-item completed" *ngFor="let task of getTasksByStatus(TaskStatus.FINALIZADA)">
              <div class="task-checkbox">
                <mat-checkbox 
                  [checked]="true"
                  (change)="toggleTaskComplete(task, $event.checked)"
                  [color]="'primary'">
                </mat-checkbox>
              </div>
              
              <div class="task-content">
                <div class="task-text strikethrough">{{task.text}}</div>
                
                <div class="task-meta" *ngIf="task.dueDate">
                  <span class="due-date">
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
        </div>
      </div>

      <!-- No Tasks Message -->
      <div class="no-tasks" *ngIf="categoryTasks.length === 0">
        <div class="category-icon-large" [style.background-color]="category.color">
          <mat-icon>folder_open</mat-icon>
        </div>
        <h3>No hay tareas en {{category.name}}</h3>
        <p>Agrega tu primera tarea a esta categoría.</p>
      </div>
    </div>
  `,
  styles: [`
    .category-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;
    }

    .title-section {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .category-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .title-info {
      flex: 1;
    }

    .title-info h1 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 700;
      color: #202124;
    }

    .category-description {
      margin: 0;
      color: #5f6368;
      font-size: 14px;
    }

    .task-count {
      background: #f1f3f4;
      color: #5f6368;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      margin-top: 8px;
    }

    .stats-section {
      display: flex;
      gap: 24px;
      margin-bottom: 32px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #202124;
    }

    .stat-label {
      font-size: 12px;
      color: #5f6368;
      text-transform: uppercase;
      font-weight: 500;
    }

    .tasks-sections {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .task-section {
      background: white;
      border-radius: 8px;
      border: 1px solid #dadce0;
      overflow: hidden;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: #f8f9fa;
      border-bottom: 1px solid #dadce0;
    }

    .section-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #5f6368;
    }

    .section-header h3 {
      margin: 0;
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: #202124;
    }

    .section-count {
      background: #e8eaed;
      color: #5f6368;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 500;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
    }

    .task-item {
      display: flex;
      align-items: flex-start;
      padding: 16px 20px;
      border-bottom: 1px solid #f1f3f4;
      transition: background-color 0.2s ease;
    }

    .task-item:last-child {
      border-bottom: none;
    }

    .task-item:hover {
      background-color: #f8f9fa;
    }

    .task-item.completed {
      opacity: 0.7;
    }

    .task-checkbox {
      margin-right: 16px;
      margin-top: 2px;
    }

    .task-content {
      flex: 1;
    }

    .task-text {
      font-size: 16px;
      color: #202124;
      line-height: 1.4;
      margin-bottom: 4px;
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
    }

    .due-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #5f6368;
      padding: 2px 6px;
      background: #f1f3f4;
      border-radius: 4px;
    }

    .due-date.overdue {
      color: #d32f2f;
      background: #ffebee;
    }

    .date-icon {
      font-size: 12px;
      width: 12px;
      height: 12px;
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
      padding: 64px 24px;
      color: #5f6368;
    }

    .category-icon-large {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin: 0 auto 20px auto;
    }

    .category-icon-large mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
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
export class CategoryComponent implements OnInit {
  TaskStatus = TaskStatus;
  category: Category | null = null;
  categoryTasks: Task[] = [];
  categoryId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      if (this.categoryId) {
        this.loadCategory();
        this.loadCategoryTasks();
      }
    });
  }

  loadCategory() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        if (response.status_code === 200) {
          this.category = response.data.find((cat: Category) => cat.id === this.categoryId);
        }
      },
      error: (error) => console.error('Error loading category:', error)
    });
  }

  loadCategoryTasks() {
    this.taskService.getTasks().subscribe({
      next: (response: any) => {
        if (response.status_code === 200) {
          this.categoryTasks = response.data.filter((task: Task) => 
            task.categoryId === this.categoryId
          );
        }
      },
      error: (error) => console.error('Error loading tasks:', error)
    });
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.categoryTasks.filter(task => task.status === status);
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
          this.loadCategoryTasks();
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

  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== TaskStatus.FINALIZADA;
  }
}
