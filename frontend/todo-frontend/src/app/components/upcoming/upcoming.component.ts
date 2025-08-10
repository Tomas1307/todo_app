import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Task, TaskStatus } from '../../models/task.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-upcoming',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  template: `
    <div class="upcoming-container">
      <div class="header">
        <div class="title-section">
          <mat-icon class="title-icon">upcoming</mat-icon>
          <h1>Próximo</h1>
          <span class="task-count">{{getTotalUpcomingTasks()}}</span>
        </div>
      </div>

      <!-- Today Section -->
      <div class="time-section" *ngIf="todayTasks.length > 0">
        <div class="section-header">
          <h2>
            <mat-icon class="section-icon today-icon">today</mat-icon>
            Hoy
          </h2>
          <span class="section-date">{{formatSectionDate(today)}}</span>
        </div>
        
        <div class="tasks-list">
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
              
              <div class="task-meta" *ngIf="task.category">
                <mat-chip 
                  class="category-chip"
                  [style.background-color]="task.category.color"
                  [style.color]="getContrastColor(task.category.color)"
                  [style.border]="'2px solid ' + task.category.color">
                  <span class="category-name">{{task.category.name}}</span>
                </mat-chip>
              </div>
            </div>

            <button mat-icon-button (click)="deleteTask(task.id)" class="task-action">
              <mat-icon>delete_outline</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Tomorrow Section -->
      <div class="time-section" *ngIf="tomorrowTasks.length > 0">
        <div class="section-header">
          <h2>
            <mat-icon class="section-icon tomorrow-icon">wb_sunny</mat-icon>
            Mañana
          </h2>
          <span class="section-date">{{formatSectionDate(getTomorrow())}}</span>
        </div>
        
        <div class="tasks-list">
          <div class="task-item" *ngFor="let task of tomorrowTasks" [class.completed]="task.status === TaskStatus.FINALIZADA">
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
              
              <div class="task-meta" *ngIf="task.category">
                <mat-chip 
                  class="category-chip"
                  [style.background-color]="task.category.color"
                  [style.color]="getContrastColor(task.category.color)"
                  [style.border]="'2px solid ' + task.category.color">
                  <span class="category-name">{{task.category.name}}</span>
                </mat-chip>
              </div>
            </div>

            <button mat-icon-button (click)="deleteTask(task.id)" class="task-action">
              <mat-icon>delete_outline</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- This Week Section -->
      <div class="time-section" *ngIf="thisWeekTasks.length > 0">
        <div class="section-header">
          <h2>
            <mat-icon class="section-icon week-icon">date_range</mat-icon>
            Esta semana
          </h2>
          <span class="section-date">{{getWeekRange()}}</span>
        </div>
        
        <div class="tasks-list">
          <div class="task-item" *ngFor="let task of thisWeekTasks" [class.completed]="task.status === TaskStatus.FINALIZADA">
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
              
              <div class="task-meta">
                <span class="due-date">
                  <mat-icon class="date-icon">schedule</mat-icon>
                  {{formatDate(task.dueDate!)}}
                </span>
                
                <mat-chip 
                  *ngIf="task.category"
                  class="category-chip"
                  [style.background-color]="task.category.color"
                  [style.color]="getContrastColor(task.category.color)"
                  [style.border]="'2px solid ' + task.category.color">
                  <span class="category-name">{{task.category.name}}</span>
                </mat-chip>
              </div>
            </div>

            <button mat-icon-button (click)="deleteTask(task.id)" class="task-action">
              <mat-icon>delete_outline</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- No Tasks Message -->
      <div class="no-tasks" *ngIf="getTotalUpcomingTasks() === 0">
        <mat-icon class="no-tasks-icon">event_available</mat-icon>
        <h3>Todo está al día</h3>
        <p>No tienes tareas programadas próximamente.</p>
      </div>
    </div>
  `,
  styles: [`
    .upcoming-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .title-icon {
      color: #9c27b0;
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

    .time-section {
      margin-bottom: 32px;
      background: #fafafa;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #f0f0f0;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e0e0e0;
    }

    .section-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #202124;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-date {
      font-size: 13px;
      color: #5f6368;
      font-weight: 500;
      background: white;
      padding: 4px 8px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .section-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .today-icon {
      color: #4caf50;
    }

    .tomorrow-icon {
      color: #ff9800;
    }

    .week-icon {
      color: #2196f3;
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
      border-color: #9c27b0;
      box-shadow: 0 2px 8px rgba(156, 39, 176, 0.1);
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

    .task-action {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .task-item:hover .task-action {
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
      color: #9c27b0;
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
export class UpcomingComponent implements OnInit {
  TaskStatus = TaskStatus;
  todayTasks: Task[] = [];
  tomorrowTasks: Task[] = [];
  thisWeekTasks: Task[] = [];
  categories: Category[] = [];
  
  today = new Date();
  tomorrow = new Date();

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  }

  ngOnInit() {
    this.loadCategories();
    this.loadUpcomingTasks();
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

  loadUpcomingTasks() {
    this.taskService.getTasks().subscribe({
      next: (response: any) => {
        if (response.status_code === 200) {
          const tasks = response.data.filter((task: Task) => task.dueDate);
          this.organizeTasksByTime(tasks);
        }
      },
      error: (error) => console.error('Error loading tasks:', error)
    });
  }

  organizeTasksByTime(tasks: Task[]) {
    console.log('All tasks received:', tasks);
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Tareas de hoy
    this.todayTasks = tasks.filter(task => {
      if (!task.dueDate || !task.id) {
        console.warn('Task missing dueDate or id:', task);
        return false;
      }
      const taskDateStr = task.dueDate.split('T')[0];
      return taskDateStr === todayStr;
    });

    // Tareas de mañana
    this.tomorrowTasks = tasks.filter(task => {
      if (!task.dueDate || !task.id) return false;
      const taskDateStr = task.dueDate.split('T')[0];
      return taskDateStr === tomorrowStr;
    });

    // Tareas de esta semana (excluyendo hoy y mañana)
    this.thisWeekTasks = tasks.filter(task => {
      if (!task.dueDate || !task.id) return false;
      const taskDate = new Date(task.dueDate);
      const taskDateStr = task.dueDate.split('T')[0];
      return taskDate > tomorrow && taskDate <= endOfWeek && 
             taskDateStr !== todayStr && 
             taskDateStr !== tomorrowStr;
    });

    console.log('Organized tasks:');
    console.log('Today tasks:', this.todayTasks.length, this.todayTasks);
    console.log('Tomorrow tasks:', this.tomorrowTasks.length, this.tomorrowTasks);
    console.log('This week tasks:', this.thisWeekTasks.length, this.thisWeekTasks);
  }

  getTotalUpcomingTasks(): number {
    return this.todayTasks.length + this.tomorrowTasks.length + this.thisWeekTasks.length;
  }

  getTomorrow(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  formatSectionDate(date: Date): string {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short' 
    });
  }

  getWeekRange(): string {
    const today = new Date();
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    
    return `${dayAfterTomorrow.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`;
  }

  toggleTaskComplete(task: Task, completed: boolean) {
    if (!task || !task.id) {
      console.error('Invalid task or task ID:', task);
      return;
    }

    console.log('Toggling task complete:', { taskId: task.id, completed, currentStatus: task.status });
    
    const newStatus = completed ? TaskStatus.FINALIZADA : TaskStatus.SIN_EMPEZAR;
    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => {
        task.status = newStatus;
        console.log('Task updated successfully');
      },
      error: (error) => {
        console.error('Error updating task:', error);
        console.error('Task data:', task);
      }
    });
  }

  deleteTask(taskId: number) {
    if (!taskId) {
      console.error('Invalid task ID:', taskId);
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      console.log('Deleting task with ID:', taskId);
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          console.log('Task deleted successfully');
          this.loadUpcomingTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          console.error('Task ID:', taskId);
        }
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
