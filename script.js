const taskInput = document.getElementById('taskInput');
const descriptionInput = document.getElementById('descriptionInput');
const dateInput = document.getElementById('dateInput');
const taskList = document.getElementById('taskList');
const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');
const editDescriptionInput = document.getElementById('editDescriptionInput');
const editDateInput = document.getElementById('editDateInput');
const themeToggle = document.getElementById('themeToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentEditId = null;

// Set today's date
dateInput.valueAsDate = new Date();
renderTasks();
loadTheme();

function addTask() {
    const taskText = taskInput.value.trim();
    const description = descriptionInput.value.trim();
    const date = dateInput.value;

    if (taskText) {
        tasks.push({
            id: Date.now(),
            text: taskText,
            description: description,
            date: date,
            completed: false
        });
        saveTasks();
        renderTasks();
        clearInputs();
    } else {
        alert("Task title cannot be empty.");
    }
}

function clearInputs() {
    taskInput.value = '';
    descriptionInput.value = '';
    dateInput.valueAsDate = new Date();
}

function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        currentEditId = id;
        editTaskInput.value = task.text;
        editDescriptionInput.value = task.description || '';
        editDateInput.value = task.date;
        editModal.style.display = 'block';
    }
}

function closeModal() {
    editModal.style.display = 'none';
    currentEditId = null;
}

function saveEdit() {
    if (currentEditId) {
        tasks = tasks.map(task => {
            if (task.id === currentEditId) {
                return {
                    ...task,
                    text: editTaskInput.value.trim(),
                    description: editDescriptionInput.value.trim(),
                    date: editDateInput.value
                };
            }
            return task;
        });
        saveTasks();
        renderTasks();
        closeModal();
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        taskContent.onclick = () => toggleTask(task.id);

        const title = document.createElement('h3');
        title.textContent = task.text;

        const description = document.createElement('p');
        description.textContent = task.description || 'No description';

        const date = document.createElement('span');
        date.className = 'task-date';
        date.textContent = new Date(task.date).toLocaleDateString();

        const taskDate = new Date(task.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (taskDate < today) {
            date.classList.add('overdue');
        } else if ((taskDate - today) / (1000 * 60 * 60 * 24) < 2) {
            date.classList.add('due-soon');
        }

        taskContent.appendChild(title);
        taskContent.appendChild(description);
        taskContent.appendChild(date);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            openEditModal(task.id);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        };

        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(deleteBtn);

        li.appendChild(taskContent);
        li.appendChild(buttonGroup);
        taskList.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Dark mode toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    themeToggle.textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️ Light Mode';
    }
}

// Add task on Enter key
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target === editModal) closeModal();
};
