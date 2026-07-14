//select DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-List');

// Try to load saved tasks from localStorage
const savedTasks = localStorage.getItem('tasks');
const todos = savedTasks ? JSON.parse(savedTasks) : [];

function addTask() {
    localStorage.setItem('tasks', JSON.stringify(todos));
}