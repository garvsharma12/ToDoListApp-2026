const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
const storage = isBrowser && window.localStorage ? window.localStorage : null;

const taskInput = isBrowser ? document.getElementById('taskInput') : null;
const addBtn = isBrowser ? document.getElementById('add-btn') : null;
const taskList = isBrowser ? document.getElementById('task-List') : null;

const savedTasks = storage ? storage.getItem('tasks') : null;
const todos = savedTasks ? JSON.parse(savedTasks) : [];

function saveToDos() {
    if (storage) {
        storage.setItem('tasks', JSON.stringify(todos));
    }
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
    if (!taskList) return;

    taskList.innerHTML = '';
    todos.forEach((task, index) => {
        const node = createNode(task, index);
        taskList.appendChild(node);
    });
}

function addTask() {
    if (!taskInput || !addBtn) return;

    const text = taskInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        taskInput.value = '';
        saveToDos();
        renderTasks();
    }
}

if (isBrowser) {
    addBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTask();
        }
    });

    renderTasks();
}