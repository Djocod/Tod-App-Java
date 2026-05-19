import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = { title: '', completed: false };
  filter: 'all' | 'active' | 'done' = 'all';

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAll().subscribe((data) => {
      this.tasks = data;
      this.cdr.detectChanges();
    });
  }

  addTask() {
    if (!this.newTask.title.trim()) return;

    this.taskService.create(this.newTask).subscribe(() => {
      this.newTask = { title: '', completed: false };
      this.loadTasks();
    });
  }

  toggleComplete(task: Task) {
    task.completed = !task.completed;
    this.taskService.update(task.id!, task).subscribe(() => this.cdr.detectChanges());
  }

  deleteTask(id: number) {
    this.taskService.delete(id).subscribe(() => this.loadTasks());
  }

  get filteredTask() {
    if (this.filter === 'active') return this.tasks.filter((t) => !t.completed);
    if (this.filter === 'done') return this.tasks.filter((t) => t.completed);
    return this.tasks;
  }

  get remaining() {
    return this.tasks.filter((t) => !t.completed).length;
  }
}
