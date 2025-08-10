import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskResponse, TaskStatus } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/v1/tasks';
  
  // Array de colores predefinidos para las categorías
  private categoryColors = [
    '#4CAF50', // Verde
    '#2196F3', // Azul
    '#FF9800', // Naranja
    '#9C27B0', // Púrpura
    '#F44336', // Rojo
    '#00BCD4', // Cian
    '#8BC34A', // Verde claro
    '#FF5722', // Rojo-naranja
    '#795548', // Marrón
    '#607D8B', // Azul gris
    '#E91E63', // Rosa
    '#CDDC39', // Lima
    '#3F51B5', // Índigo
    '#009688', // Teal
    '#FFC107'  // Ámbar
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Función para asignar un color a una categoría basándose en su ID
  private assignColorToCategory(categoryId: number): string {
    const colorIndex = categoryId % this.categoryColors.length;
    return this.categoryColors[colorIndex];
  }

  getTasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/user`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map((response: any) => {
        // Transform backend snake_case to frontend camelCase
        if (response.data && Array.isArray(response.data)) {
          response.data = response.data.map((task: any) => ({
            ...task,
            dueDate: task.due_date,
            categoryId: task.category_id,
            userId: task.user_id,
            createdAt: task.created_at,
            updatedAt: task.updated_at,
            // Asignar color a la categoría si existe
            category: task.category ? {
              ...task.category,
              color: this.assignColorToCategory(task.category.id)
            } : null
          }));
        }
        return response;
      })
    );
  }

  getTaskById(id: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getTasksByCategory(categoryId: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/?categoryId=${categoryId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createTask(task: CreateTaskRequest): Observable<TaskResponse> {
    // Transform camelCase to snake_case for backend
    const backendTask = {
      text: task.text,
      status: task.status,
      due_date: task.dueDate,
      category_id: task.categoryId
    };
    
    return this.http.post<TaskResponse>(`${this.apiUrl}/`, backendTask, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<TaskResponse> {
    // Transform camelCase to snake_case for backend
    const backendTask: any = {};
    if (task.text !== undefined) backendTask.text = task.text;
    if (task.status !== undefined) backendTask.status = task.status;
    if (task.dueDate !== undefined) backendTask.due_date = task.dueDate;
    if (task.categoryId !== undefined) backendTask.category_id = task.categoryId;
    
    return this.http.put<TaskResponse>(`${this.apiUrl}/${id}`, backendTask, {
      headers: this.authService.getAuthHeaders()
    });
  }

  toggleTaskComplete(id: number, completed: boolean): Observable<TaskResponse> {
    const status = completed ? TaskStatus.FINALIZADA : TaskStatus.SIN_EMPEZAR;
    return this.updateTask(id, { status });
  }

  deleteTask(id: number): Observable<TaskResponse> {
    return this.http.delete<TaskResponse>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
