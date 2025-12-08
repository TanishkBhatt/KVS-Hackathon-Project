// State Management
let currentUser = null;
let tasks = [];
let currentView = 'register';

// DOM Elements
const registerView = document.getElementById('registerView');
const dashboardView = document.getElementById('dashboardView');
const analysisView = document.getElementById('analysisView');
const mobileNav = document.getElementById('mobileNav');
const userSection = document.getElementById('userSection');
const currentUsername = document.getElementById('currentUsername');
const confirmModal = document.getElementById('confirmModal');

// Registration Elements
const regUsername = document.getElementById('regUsername');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const regMessage = document.getElementById('regMessage');
const createAccountBtn = document.getElementById('createAccountBtn');
const guestBtn = document.getElementById('guestBtn');

// Login Elements
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginMessage = document.getElementById('loginMessage');
const loginBtn = document.getElementById('loginBtn');

// Task Elements
const taskTitle = document.getElementById('taskTitle');
const taskDuration = document.getElementById('taskDuration');
const taskCategory = document.getElementById('taskCategory');
const addTaskBtn = document.getElementById('addTaskBtn');
const studyTasks = document.getElementById('studyTasks');
const exerciseTasks = document.getElementById('exerciseTasks');
const healthTasks = document.getElementById('healthTasks');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');

// Notes Elements
const noteText = document.getElementById('noteText');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const clearNoteBtn = document.getElementById('clearNoteBtn');

// Analysis Elements
const analysisSummary = document.getElementById('analysisSummary');
const analysisCompletion = document.getElementById('analysisCompletion');
const analysisSuggestions = document.getElementById('analysisSuggestions');
const runAnalysisBtn = document.getElementById('runAnalysisBtn');
const analysisOutput = document.getElementById('analysisOutput');

// Navigation Elements
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const logoutBtn = document.getElementById('logoutBtn');
const routineBtn = document.getElementById('routineBtn');
const analysisToggleBtn = document.getElementById('analysisToggleBtn');
const routineBtn2 = document.getElementById('routineBtn2');
const analysisToggleBtn2 = document.getElementById('analysisToggleBtn2');

// Modal Elements
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');
let taskToDelete = null;

// Initialize App
function init() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        loadUserData(savedUser);
        showView('dashboard');
        updateUserDisplay();
    }
    attachEventListeners();
}

// Event Listeners
function attachEventListeners() {
    // Registration & Login
    createAccountBtn.addEventListener('click', handleRegister);
    loginBtn.addEventListener('click', handleLogin);
    guestBtn.addEventListener('click', handleGuest);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Tasks
    addTaskBtn.addEventListener('click', addTask);
    
    // Notes
    saveNoteBtn.addEventListener('click', saveNote);
    clearNoteBtn.addEventListener('click', () => {
        noteText.value = '';
        saveNote();
    });
    
    // Analysis
    runAnalysisBtn.addEventListener('click', runAnalysis);
    
    // Navigation
    menuBtn.addEventListener('click', () => mobileNav.classList.add('active'));
    closeBtn.addEventListener('click', () => mobileNav.classList.remove('active'));
    
    // View Toggle Buttons
    routineBtn.addEventListener('click', () => toggleDashboardView('routine'));
    analysisToggleBtn.addEventListener('click', () => toggleDashboardView('analysis'));
    routineBtn2.addEventListener('click', () => toggleDashboardView('routine'));
    analysisToggleBtn2.addEventListener('click', () => toggleDashboardView('analysis'));
    
    // Modal
    modalCancel.addEventListener('click', closeModal);
    modalConfirm.addEventListener('click', confirmDeleteTask);
    
    // Mobile Nav Links
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const action = e.target.dataset.action;
            if (action === 'dashboard') {
                toggleDashboardView('routine');
            } else if (action === 'analysis') {
                toggleDashboardView('analysis');
            }
            mobileNav.classList.remove('active');
        });
    });
    
    // Auto-save notes
    noteText.addEventListener('input', () => {
        if (currentUser) {
            localStorage.setItem(`${currentUser}_notes`, noteText.value);
        }
    });
    
    // Enter key handlers
    regPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleRegister();
    });
    loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    taskTitle.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
}

// View Management
function showView(view) {
    currentView = view;
    registerView.classList.remove('active');
    dashboardView.classList.remove('active');
    analysisView.classList.remove('active');
    
    if (view === 'register') {
        registerView.classList.add('active');
    } else if (view === 'dashboard') {
        dashboardView.classList.add('active');
    } else if (view === 'analysis') {
        analysisView.classList.add('active');
    }
}

function toggleDashboardView(type) {
    if (type === 'routine') {
        showView('dashboard');
        routineBtn.classList.add('active');
        analysisToggleBtn.classList.remove('active');
    } else {
        showView('analysis');
        routineBtn2.classList.remove('active');
        analysisToggleBtn2.classList.add('active');
    }
}

// User Management
function handleRegister() {
    const username = regUsername.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();
    
    if (!username || !email || !password) {
        regMessage.textContent = 'Please fill all fields';
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
        regMessage.textContent = 'Username already exists';
        return;
    }
    
    users[username] = { email, password };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', username);
    
    currentUser = username;
    regMessage.textContent = 'Account created successfully!';
    regMessage.style.color = '#10b981';
    
    setTimeout(() => {
        showView('dashboard');
        updateUserDisplay();
        regMessage.textContent = '';
        regMessage.style.color = '';
    }, 1000);
}

function handleLogin() {
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();
    
    if (!username || !password) {
        loginMessage.textContent = 'Please fill all fields';
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username];
    
    if (!user || user.password !== password) {
        loginMessage.textContent = 'Invalid username or password';
        return;
    }
    
    localStorage.setItem('currentUser', username);
    currentUser = username;
    loadUserData(username);
    showView('dashboard');
    updateUserDisplay();
}

function handleGuest() {
    currentUser = 'Guest';
    localStorage.setItem('currentUser', 'Guest');
    showView('dashboard');
    updateUserDisplay();
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    tasks = [];
    noteText.value = '';
    showView('register');
    userSection.style.display = 'none';
    
    // Clear forms
    regUsername.value = '';
    regEmail.value = '';
    regPassword.value = '';
    loginUsername.value = '';
    loginPassword.value = '';
    regMessage.textContent = '';
    loginMessage.textContent = '';
}

function updateUserDisplay() {
    if (currentUser) {
        userSection.style.display = 'flex';
        currentUsername.textContent = currentUser;
    } else {
        userSection.style.display = 'none';
    }
}

function loadUserData(username) {
    const savedTasks = localStorage.getItem(`${username}_tasks`);
    const savedNotes = localStorage.getItem(`${username}_notes`);
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
        updateProgress();
    }
    
    if (savedNotes) {
        noteText.value = savedNotes;
    }
}

// Task Management
function addTask() {
    const title = taskTitle.value.trim();
    const duration = taskDuration.value.trim() || '30m';
    const category = taskCategory.value;
    
    if (!title) return;
    
    const newTask = {
        id: Date.now(),
        title: title,
        duration: duration,
        category: category,
        done: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateProgress();
    
    taskTitle.value = '';
    taskDuration.value = '';
}

function toggleTaskDone(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        saveTasks();
        renderTasks();
        updateProgress();
    }
}

function deleteTask(id) {
    taskToDelete = id;
    confirmModal.classList.add('active');
}

function confirmDeleteTask() {
    if (taskToDelete) {
        tasks = tasks.filter(t => t.id !== taskToDelete);
        saveTasks();
        renderTasks();
        updateProgress();
        taskToDelete = null;
    }
    closeModal();
}

function closeModal() {
    confirmModal.classList.remove('active');
    taskToDelete = null;
}

function saveTasks() {
    if (currentUser) {
        localStorage.setItem(`${currentUser}_tasks`, JSON.stringify(tasks));
    }
}

function renderTasks() {
    const studyTasksList = tasks.filter(t => t.category === 'study');
    const exerciseTasksList = tasks.filter(t => t.category === 'exercise');
    const healthTasksList = tasks.filter(t => t.category === 'health');
    
    studyTasks.innerHTML = renderTaskList(studyTasksList, 'No study tasks yet. Add one above!');
    exerciseTasks.innerHTML = renderTaskList(exerciseTasksList, 'No exercise tasks yet. Add one above!');
    healthTasks.innerHTML = renderTaskList(healthTasksList, 'No health tasks yet. Add one above!');
}

function renderTaskList(taskList, emptyMessage) {
    if (taskList.length === 0) {
        return `<p class="empty-state">${emptyMessage}</p>`;
    }
    
    return taskList.map(task => `
        <div class="task-item ${task.done ? 'done' : ''}">
            <div class="task-header">
                <div class="task-icon ${task.done ? 'done' : ''}">${task.duration}</div>
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <span class="task-duration">${task.duration}</span>
                </div>
            </div>
            <div class="task-buttons">
                <button class="btn-done" onclick="toggleTaskDone(${task.id})">
                    ${task.done ? '✓ Done' : 'Mark Done'}
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function updateProgress() {
    if (tasks.length === 0) {
        progressFill.style.width = '0%';
        progressPercent.textContent = '0%';
        return;
    }
    
    const completedTasks = tasks.filter(t => t.done).length;
    const progress = Math.round((completedTasks / tasks.length) * 100);
    
    progressFill.style.width = `${progress}%`;
    progressPercent.textContent = `${progress}%`;
}

// Notes Management
function saveNote() {
    if (currentUser) {
        localStorage.setItem(`${currentUser}_notes`, noteText.value);
    }
}

// Analysis
function runAnalysis() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const studyTasksCount = tasks.filter(t => t.category === 'study').length;
    const exerciseTasksCount = tasks.filter(t => t.category === 'exercise').length;
    const healthTasksCount = tasks.filter(t => t.category === 'health').length;
    
    let suggestions = [];
    if (studyTasksCount < 3) suggestions.push('Add more study tasks to your routine');
    if (exerciseTasksCount < 2) suggestions.push('Include more exercise activities');
    if (healthTasksCount < 2) suggestions.push('Focus on your health routine');
    if (progress < 50) suggestions.push('Try to complete at least 50% of your tasks');
    
    // Update analysis cards
    analysisSummary.textContent = `You have completed ${completed} out of ${total} tasks`;
    analysisCompletion.textContent = `Completion: ${progress}%`;
    analysisSuggestions.innerHTML = suggestions.length > 0 
        ? '• ' + suggestions.join('<br>• ')
        : 'Great job! Keep up the good work!';
    
    // Generate full analysis
    const fullAnalysisText = `
ROUTINE ANALYSIS

Total Tasks: ${total}
Completed: ${completed}
Progress: ${progress}%

Category Breakdown:
- Study Tasks: ${studyTasksCount}
- Exercise Tasks: ${exerciseTasksCount}
- Health Tasks: ${healthTasksCount}

Suggestions:
${suggestions.map(s => `• ${s}`).join('\n') || '• Great job! Keep up the good work!'}

Keep track of your routine and stay consistent!
    `;
    
    analysisOutput.textContent = fullAnalysisText;
    analysisOutput.style.display = 'block';
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();

}
