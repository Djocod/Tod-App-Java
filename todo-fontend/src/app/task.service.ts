import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private api = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Task[]>(this.api);
  }

  create(task: Task) {
    return this.http.post<Task>(this.api, task);
  }

  update(id: number, t: Task) {
    return this.http.put<Task>(`${this.api}/${id}`, t);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
