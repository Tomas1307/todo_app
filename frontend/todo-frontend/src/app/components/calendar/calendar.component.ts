import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Task, TaskStatus } from '../../models/task.model';
import { Category } from '../../models/category.model';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  tasks: Task[];
  isToday: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTabsModule
  ],
  template: `
    <div class="calendar-container">
      <div class="header">
        <div class="title-section">
          <mat-icon class="title-icon">calendar_month</mat-icon>
          <h1>Calendario</h1>
        </div>
      </div>

      <mat-tab-group [(selectedIndex)]="selectedTabIndex" class="calendar-tabs">
        <!-- Week View -->
        <mat-tab label="Semana">
          <div class="week-view">
            <div class="week-header">
              <button mat-icon-button (click)="previousWeek()">
                <mat-icon>chevron_left</mat-icon>
              </button>
              <h2>{{getCurrentWeekRange()}}</h2>
              <button mat-icon-button (click)="nextWeek()">
                <mat-icon>chevron_right</mat-icon>
              </button>
            </div>

            <div class="week-grid">
              <div class="week-day" *ngFor="let day of weekDays" [class.today]="day.isToday">
                <div class="day-header">
                  <span class="day-name">{{day.dayName}}</span>
                  <span class="day-number" [class.today-number]="day.isToday">{{day.dayNumber}}</span>
                </div>
                
                <div class="day-tasks">
                  <div class="task-item" *ngFor="let task of day.tasks" 
                       [class.completed]="task.status === TaskStatus.FINALIZADA">
                    <div class="task-checkbox">
                      <mat-checkbox 
                        [checked]="task.status === TaskStatus.FINALIZADA"
                        (change)="toggleTaskComplete(task, $event.checked)"
                        [color]="'primary'"
                        class="mini-checkbox">
                      </mat-checkbox>
                    </div>
                    
                    <div class="task-content">
                      <div class="task-text" [class.strikethrough]="task.status === TaskStatus.FINALIZADA">
                        {{task.text}}
                      </div>
                      
                      <mat-chip 
                        *ngIf="task.category"
                        class="category-chip mini-chip"
                        [style.background-color]="task.category.color"
                        [style.color]="getContrastColor(task.category.color)">
                        {{task.category.name}}
                      </mat-chip>
                    </div>
                  </div>
                  
                  <div class="no-tasks-day" *ngIf="day.tasks.length === 0">
                    <span>Sin tareas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Month View -->
        <mat-tab label="Mes">
          <div class="month-view">
            <div class="month-header">
              <button mat-icon-button (click)="previousMonth()">
                <mat-icon>chevron_left</mat-icon>
              </button>
              <h2>{{getCurrentMonthYear()}}</h2>
              <button mat-icon-button (click)="nextMonth()">
                <mat-icon>chevron_right</mat-icon>
              </button>
            </div>

            <div class="month-grid">
              <div class="weekday-headers">
                <div class="weekday-header" *ngFor="let day of weekdayNames">{{day}}</div>
              </div>
              
              <div class="calendar-grid">
                <div class="calendar-day" 
                     *ngFor="let day of calendarDays" 
                     [class.other-month]="!day.isCurrentMonth"
                     [class.today]="day.isToday">
                  
                  <div class="day-number" [class.today-number]="day.isToday">
                    {{day.date.getDate()}}
                  </div>
                  
                  <div class="day-tasks">
                    <div class="task-dot" 
                         *ngFor="let task of day.tasks.slice(0, 3)" 
                         [style.background-color]="task.category?.color || '#9e9e9e'"
                         [title]="task.text">
                    </div>
                    <div class="more-tasks" *ngIf="day.tasks.length > 3">
                      +{{day.tasks.length - 3}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .calendar-container {
      padding: 24px;
      max-width: 1200px;
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
      color: #ff9800;
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

    .calendar-tabs {
      min-height: 600px;
    }

    /* Week View Styles */
    .week-view {
      padding: 20px 0;
    }

    .week-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .week-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #202124;
    }

    .week-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background: #dadce0;
      border-radius: 8px;
      overflow: hidden;
    }

    .week-day {
      background: white;
      min-height: 200px;
      padding: 12px;
    }

    .week-day.today {
      background: #e8f5e8;
    }

    .day-header {
      text-align: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f1f3f4;
    }

    .day-name {
      display: block;
      font-size: 12px;
      color: #5f6368;
      font-weight: 500;
      text-transform: uppercase;
    }

    .day-number {
      display: block;
      font-size: 16px;
      font-weight: 600;
      color: #202124;
      margin-top: 4px;
    }

    .day-number.today-number {
      color: #4caf50;
    }

    .day-tasks {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .task-item {
      display: flex;
      align-items: flex-start;
      padding: 6px;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 12px;
      border-left: 3px solid transparent;
    }

    .task-item.completed {
      opacity: 0.6;
    }

    .task-checkbox {
      margin-right: 6px;
    }

    .mini-checkbox {
      transform: scale(0.8);
    }

    .task-content {
      flex: 1;
      overflow: hidden;
    }

    .task-text {
      font-size: 11px;
      line-height: 1.3;
      color: #202124;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .task-text.strikethrough {
      text-decoration: line-through;
      color: #5f6368;
    }

    .mini-chip {
      height: 16px;
      font-size: 10px;
      margin-top: 2px;
    }

    .no-tasks-day {
      text-align: center;
      color: #9e9e9e;
      font-size: 11px;
      padding: 20px 8px;
    }

    /* Month View Styles */
    .month-view {
      padding: 20px 0;
    }

    .month-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .month-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #202124;
    }

    .month-grid {
      background: white;
      border-radius: 8px;
      border: 1px solid #dadce0;
      overflow: hidden;
    }

    .weekday-headers {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: #f8f9fa;
    }

    .weekday-header {
      padding: 12px;
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: #5f6368;
      text-transform: uppercase;
      border-right: 1px solid #dadce0;
    }

    .weekday-header:last-child {
      border-right: none;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    .calendar-day {
      min-height: 100px;
      padding: 8px;
      border-right: 1px solid #f1f3f4;
      border-bottom: 1px solid #f1f3f4;
      background: white;
    }

    .calendar-day:nth-child(7n) {
      border-right: none;
    }

    .calendar-day.other-month {
      background: #f8f9fa;
      color: #9e9e9e;
    }

    .calendar-day.today {
      background: #e8f5e8;
    }

    .calendar-day .day-number {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .calendar-day .today-number {
      color: #4caf50;
    }

    .calendar-day .day-tasks {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      align-items: flex-start;
    }

    .task-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .more-tasks {
      font-size: 10px;
      color: #5f6368;
      font-weight: 500;
    }
  `]
})
export class CalendarComponent implements OnInit {
  TaskStatus = TaskStatus;
  selectedTabIndex = 0;
  
  // Week view
  currentWeekStart: Date = new Date();
  weekDays: WeekDay[] = [];
  
  // Month view
  currentMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];
  weekdayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  allTasks: Task[] = [];
  categories: Category[] = [];

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {
    this.setWeekStart();
  }

  ngOnInit() {
    this.loadCategories();
    this.loadTasks();
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

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (response: any) => {
        if (response.status_code === 200) {
          this.allTasks = response.data;
          this.generateWeekView();
          this.generateMonthView();
        }
      },
      error: (error) => console.error('Error loading tasks:', error)
    });
  }

  setWeekStart() {
    const today = new Date();
    const day = today.getDay();
    this.currentWeekStart = new Date(today);
    this.currentWeekStart.setDate(today.getDate() - day);
  }

  generateWeekView() {
    this.weekDays = [];
    const today = new Date();
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + i);
      
      const dayTasks = this.getTasksForDate(date);
      
      this.weekDays.push({
        date: date,
        dayName: dayNames[i],
        dayNumber: date.getDate(),
        tasks: dayTasks,
        isToday: this.isSameDay(date, today)
      });
    }
  }

  generateMonthView() {
    this.calendarDays = [];
    const today = new Date();
    
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    
    // Start from the first Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === this.currentMonth.getMonth();
      const dayTasks = this.getTasksForDate(date);
      
      this.calendarDays.push({
        date: date,
        isCurrentMonth: isCurrentMonth,
        isToday: this.isSameDay(date, today),
        tasks: dayTasks
      });
    }
  }

  getTasksForDate(date: Date): Task[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.allTasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(dateStr)
    );
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  // Week navigation
  previousWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateWeekView();
  }

  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateWeekView();
  }

  getCurrentWeekRange(): string {
    const endDate = new Date(this.currentWeekStart);
    endDate.setDate(this.currentWeekStart.getDate() + 6);
    
    return `${this.currentWeekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }

  // Month navigation
  previousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateMonthView();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateMonthView();
  }

  getCurrentMonthYear(): string {
    return this.currentMonth.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
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

  getContrastColor(hexColor: string): string {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128 ? '#ffffff' : '#000000';
  }
}
