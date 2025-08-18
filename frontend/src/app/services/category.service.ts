import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, CreateCategoryRequest, UpdateCategoryRequest, CategoryResponse } from '../models/category.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/v1/categories';
  
  // Array de colores predefinidos para las categorías (mismo que TaskService)
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

  getCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map((response: any) => {
        // Asignar colores a las categorías
        if (response.data && Array.isArray(response.data)) {
          response.data = response.data.map((category: any) => ({
            ...category,
            color: this.assignColorToCategory(category.id)
          }));
        }
        return response;
      })
    );
  }

  getCategoryById(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map((response: any) => {
        // Asignar color a la categoría
        if (response.data && !Array.isArray(response.data)) {
          response.data.color = this.assignColorToCategory(response.data.id);
        }
        return response;
      })
    );
  }

  createCategory(category: CreateCategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(`${this.apiUrl}/`, category, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map((response: any) => {
        // Asignar color a la nueva categoría
        if (response.data && !Array.isArray(response.data)) {
          response.data.color = this.assignColorToCategory(response.data.id);
        }
        return response;
      })
    );
  }

  updateCategory(id: number, category: UpdateCategoryRequest): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.apiUrl}/${id}`, category, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map((response: any) => {
        // Asignar color a la categoría actualizada
        if (response.data && !Array.isArray(response.data)) {
          response.data.color = this.assignColorToCategory(response.data.id);
        }
        return response;
      })
    );
  }

  deleteCategory(id: number): Observable<CategoryResponse> {
    return this.http.delete<CategoryResponse>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
