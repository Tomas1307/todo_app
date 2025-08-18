import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./components/auth/login/login.component').then(c => c.LoginComponent)
      },
      { 
        path: 'register', 
        loadComponent: () => import('./components/auth/register/register.component').then(c => c.RegisterComponent)
      },
      { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
      }
    ]
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'today',
        loadComponent: () => import('./components/today/today.component').then(c => c.TodayComponent)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./components/calendar/calendar.component').then(c => c.CalendarComponent)
      },
      {
        path: 'category/:id',
        loadComponent: () => import('./components/category/category.component').then(c => c.CategoryComponent)
      },
      {
        path: '',
        redirectTo: 'today',
        pathMatch: 'full'
      }
    ]
  },
  { 
    path: 'tasks', 
    loadComponent: () => import('./components/tasks/task-list/task-list.component').then(c => c.TaskListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'categories', 
    loadComponent: () => import('./components/categories/category-list/category-list.component').then(c => c.CategoryListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/auth/login' 
  }
];
