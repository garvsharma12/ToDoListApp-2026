//select DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-List');

// Try to load saved tasks from localStorage
const savedTasks = localStorage.getItem('tasks');
const todos = savedTasks ? JSON.parse(savedTasks) : [];

function saveToDos() {
    localStorage.setItem('tasks', JSON.stringify(todos));
}

function createNode(taskList, index){
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!taskList.completed;
    checkbox.addEventListener("change", ()=> {
        taskList.completed = checkbox.checked;
    })

    saveToDos();
}

function renderTasks(){
    taskList.innerHTML = '';
    todos.forEach((task, index) => {
        const node = createNode(taskList, index);
        taskList.appendChild(node);
    });
}