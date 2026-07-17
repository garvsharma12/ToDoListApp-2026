class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.filter = 'all';
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        this.render();
    }

    attachEventListeners() {
        document.getElementById('addBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
        document.getElementById('exportTasks').addEventListener('click', () => this.exportTasks());
        
        document.querySelectorAll('input[name="filter"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filter = e.target.value;
                this.render();
            });
        });
    }

    updateDateTime() {
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        document.getElementById('dateTime').textContent = now.toLocaleDateString('en-US', options);
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const taskText = input.value.trim();

        if (taskText === '') {
            this.showToast('Please enter a task!', 'warning');
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.tasks.push(task);
        this.saveTasks();
        input.value = '';
        input.focus();
        this.showToast('Task added successfully!', 'success');
        this.render();
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.showToast('Task deleted!', 'danger');
            this.render();
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.showToast(task.completed ? 'Task completed!' : 'Task uncompleted!', 'success');
            this.render();
        }
    }

    clearCompleted() {
        if (confirm('Clear all completed tasks?')) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.showToast('Completed tasks cleared!', 'success');
            this.render();
        }
    }

    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        this.showToast('Tasks exported successfully!', 'success');
    }

    getFilteredTasks() {
        if (this.filter === 'active') return this.tasks.filter(t => !t.completed);
        if (this.filter === 'completed') return this.tasks.filter(t => t.completed);
        return this.tasks;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
    }

    render() {
        const tasksList = document.getElementById('tasksList');
        const filtered = this.getFilteredTasks();

        this.updateStats();

        if (filtered.length === 0) {
            tasksList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="bi bi-inbox"></i>
                    </div>
                    <p class="empty-text">No tasks to display</p>
                    <p class="empty-subtext">${this.filter === 'completed' ? 'Complete some tasks to see them here' : 'Add a task to get started'}</p>
                </div>
            `;
            return;
        }

        tasksList.innerHTML = filtered.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-content">
                    <input type="checkbox" class="form-check-input" 
                           ${task.completed ? 'checked' : ''} 
                           onchange="app.toggleTask(${task.id})">
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                </div>
                <div class="task-actions">
                    <button class="btn-task-action btn-complete" onclick="app.toggleTask(${task.id})" title="Mark complete">
                        <i class="bi bi-check-circle"></i>
                    </button>
                    <button class="btn-task-action btn-delete" onclick="app.deleteTask(${task.id})" title="Delete task">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('liveToast');
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.textContent = message;
        toast.className = `toast align-items-center text-white border-0 bg-${type}`;
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const app = new TodoApp();