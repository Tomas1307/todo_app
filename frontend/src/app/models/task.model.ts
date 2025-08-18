export enum TaskStatus {
  SIN_EMPEZAR = 'Sin Empezar',
  EMPEZADA = 'Empezada', 
  FINALIZADA = 'Finalizada'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high'
}

export interface Task {
  id: number;
  text: string;
  status: TaskStatus;
  dueDate?: string;
  categoryId: number;
  userId: number;
  createdAt?: string;
  category?: {
    id: number;
    name: string;
    color: string;
  };
}

export interface CreateTaskRequest {
  text: string;
  status?: TaskStatus;
  dueDate?: string;
  categoryId: number;
}

export interface UpdateTaskRequest {
  text?: string;
  status?: TaskStatus;
  dueDate?: string;
  categoryId?: number;
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task | Task[];
}
