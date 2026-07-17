// select DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-List');

// Try to load saved tasks from localStorage
const savedTasks = localStorage.getItem('tasks');
const todos = savedTasks ? JSON.parse(savedTasks) : [];

function saveToDos() {
    localStorage.setItem('tasks', JSON.stringify(todos));
}

function createNode(task, index) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!task.completed;

    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveToDos();
        renderTasks();
    });

    const textSpan = document.createElement('span');
    textSpan.textContent = task.text;
    textSpan.style.margin = '0 10px';

    if (task.completed) {
        textSpan.style.textDecoration = 'line-through';
    }

    textSpan.addEventListener('dblclick', () => {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            textSpan.textContent = task.text;
            saveToDos();
            renderTasks();
        }
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        saveToDos();
        renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(delBtn);

    return li;
}

function renderTasks() {
    taskList.innerHTML = '';
    todos.forEach((task, index) => {
        const node = createNode(task, index);
        taskList.appendChild(node);
    });
}

addBtn.addEventListener('click', () => {
    const newTaskText = taskInput.value.trim();
    if (newTaskText) {
        todos.push({ text: newTaskText, completed: false });
        taskInput.value = '';
        saveToDos();
        renderTasks();
    }
});

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addBtn.click();
    }
});

renderTasks();
