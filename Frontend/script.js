// =====================================================================
//           THE FINAL, COMPLETE SCRIPT.JS (To match the Demo Backend)
// =====================================================================

// ------------------ GLOBAL STATE & CONSTANTS ------------------
const API_URL = 'http://localhost:5000/api';
let habits = [];

// ------------------ DOM ELEMENT SELECTION ------------------
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register-link');
const showLoginLink = document.getElementById('show-login-link');
const authMessage = document.getElementById('auth-message');
const logoutButton = document.getElementById('logout-button');
const habitInput = document.getElementById('habitInput');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitList = document.getElementById('habitList');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const motivationMsg = document.getElementById('motivationMsg');
const themeToggle = document.getElementById('themeToggle');
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const profileButton = document.getElementById('profile-button');
const profilePopup = document.getElementById('profilePopup');
const closeProfilePopup = document.getElementById('closeProfilePopup');
const profileEmail = document.getElementById('profile-email');
const profileBadges = document.getElementById('profile-badges');

// ------------------ VIEW MANAGEMENT ------------------
function showLoginView() { /* ... unchanged ... */ }
function showRegisterView() { /* ... unchanged ... */ }
async function showAppView() { /* ... unchanged ... */ }
// (Copying unchanged functions for completeness)
function showLoginView() { authContainer.classList.remove('hidden'); appContainer.classList.add('hidden'); loginView.classList.remove('hidden'); registerView.classList.add('hidden'); }
function showRegisterView() { authContainer.classList.remove('hidden'); appContainer.classList.add('hidden'); loginView.classList.add('hidden'); registerView.classList.remove('hidden'); }
async function showAppView() { authContainer.classList.add('hidden'); appContainer.classList.remove('hidden'); await fetchHabits(); }

// ------------------ AUTHENTICATION LOGIC ------------------
async function handleRegister(e) { /* ... unchanged ... */ }
async function handleLogin(e) { /* ... unchanged ... */ }
function handleLogout() { /* ... unchanged ... */ }
// (Copying unchanged functions for completeness)
async function handleRegister(e) { e.preventDefault(); const button = e.target.querySelector('button[type="submit"]'); authMessage.textContent = ''; const email = document.getElementById('register-email').value; const password = document.getElementById('register-password').value; button.disabled = true; button.textContent = 'Registering...'; try { const res = await fetch(`${API_URL}/users/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }), }); if (!res.ok) { const error = await res.json(); throw new Error(error.msg); } authMessage.style.color = 'green'; authMessage.textContent = 'Registration successful! Please login.'; setTimeout(showLoginView, 2000); } catch (err) { authMessage.style.color = 'red'; authMessage.textContent = err.message; } finally { button.disabled = false; button.textContent = 'Register'; } }
async function handleLogin(e) { e.preventDefault(); const button = e.target.querySelector('button[type="submit"]'); authMessage.textContent = ''; const email = document.getElementById('login-email').value; const password = document.getElementById('login-password').value; button.disabled = true; button.textContent = 'Logging In...'; try { const res = await fetch(`${API_URL}/users/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }), }); if (!res.ok) { const error = await res.json(); throw new Error(error.msg); } const { token } = await res.json(); localStorage.setItem('token', token); showAppView(); } catch (err) { authMessage.style.color = 'red'; authMessage.textContent = err.message; } finally { button.disabled = false; button.textContent = 'Login'; } }
function handleLogout() { if (window.confirm("Are you sure you want to log out?")) { localStorage.removeItem('token'); habits = []; showLoginView(); } }

// ------------------ API CALLS FOR HABITS ------------------
async function fetchHabits() { /* ... unchanged ... */ }
async function addHabitAPI() { /* ... unchanged ... */ }
async function toggleHabitAPI(habitId) { /* ... unchanged ... */ }
async function deleteHabitAPI(habitId) { /* ... unchanged ... */ }
async function updateHabitAPI(habitId, newName) { /* ... unchanged ... */ }
async function fetchAndShowProfile() { /* ... unchanged ... */ }
// (Copying unchanged functions for completeness)
async function fetchHabits() { try { const token = localStorage.getItem('token'); const res = await fetch(`${API_URL}/habits`, { headers: { 'x-auth-token': token } }); if (!res.ok) throw new Error('Could not fetch habits'); habits = await res.json(); renderHabits(); } catch (err) { console.error(err); handleLogout(); } }
async function addHabitAPI() { const name = habitInput.value.trim(); if (name === '') return; try { const token = localStorage.getItem('token'); const res = await fetch(`${API_URL}/habits`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify({ name }), }); if (!res.ok) throw new Error('Could not add habit'); habitInput.value = ''; await fetchHabits(); } catch (err) { console.error(err); } }
async function toggleHabitAPI(habitId) { try { const token = localStorage.getItem('token'); await fetch(`${API_URL}/habits/${habitId}/complete`, { method: 'POST', headers: { 'x-auth-token': token }, }); await fetchHabits(); } catch (err) { console.error(err); } }
async function deleteHabitAPI(habitId) { try { const token = localStorage.getItem('token'); await fetch(`${API_URL}/habits/${habitId}`, { method: 'DELETE', headers: { 'x-auth-token': token }, }); await fetchHabits(); } catch (err) { console.error(err); } }
async function updateHabitAPI(habitId, newName) { if (!newName.trim()) return; try { const token = localStorage.getItem('token'); await fetch(`${API_URL}/habits/${habitId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify({ name: newName }), }); await fetchHabits(); } catch (err) { console.error('Failed to update habit:', err); } }
async function fetchAndShowProfile() { try { const token = localStorage.getItem('token'); const res = await fetch(`${API_URL}/users/profile`, { headers: { 'x-auth-token': token }, }); if (!res.ok) throw new Error('Could not fetch profile'); const data = await res.json(); profileEmail.textContent = data.email; const badgeEntries = Object.entries(data.badgeCounts); if (badgeEntries.length > 0) { profileBadges.innerHTML = badgeEntries.map(([badge, count]) => { return `<span>${badge} x ${count}</span>`; }).join(''); } else { profileBadges.innerHTML = `<p style="font-size: 0.7em;">No badges earned yet.</p>`; } profilePopup.classList.remove('hidden'); } catch (err) { console.error('Failed to show profile:', err); alert('Could not load your profile.'); } }

// ------------------ HABIT RENDERING & UI LOGIC ------------------
function renderHabits() {
    habitList.innerHTML = '';
    habits.forEach(habit => {
        const isCompletedToday = habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === new Date().toDateString();
        const badge = habit.badge || '';
        const li = document.createElement('li');
        li.className = `habit-item ${isCompletedToday ? 'completed' : ''}`;
        li.setAttribute('data-habit-id', habit._id);
        li.innerHTML = `
            <span class="habit-name" onclick="toggleHabitAPI('${habit._id}')">
                ${habit.name} (Streak: ${habit.streak || 0}) ${badge}
            </span>
            <div class="button-group">
                <button class="edit-btn" onclick="showEditInput('${habit._id}')">✏️</button>
                <button class="delete-btn" onclick="deleteHabitAPI('${habit._id}')">❌</button>
            </div>
        `;
        habitList.appendChild(li);
    });
    updateProgress();
}
function showEditInput(habitId) { /* ... unchanged ... */ }
function saveHabitEdit(habitId) { /* ... unchanged ... */ }
function updateProgress() { /* ... unchanged ... */ }
// (Copying unchanged functions for completeness)
function showEditInput(habitId) { const habitItem = document.querySelector(`[data-habit-id='${habitId}']`); if (!habitItem) return; const habit = habits.find(h => h._id === habitId); if (!habit) return; habitItem.innerHTML = ` <input type="text" class="edit-input" value="${habit.name}"> <div class="button-group"> <button class="save-btn" onclick="saveHabitEdit('${habitId}')">Save</button> </div> `; habitItem.querySelector('.edit-input').focus(); }
function saveHabitEdit(habitId) { const habitItem = document.querySelector(`[data-habit-id='${habitId}']`); if (!habitItem) return; const newName = habitItem.querySelector('.edit-input').value; updateHabitAPI(habitId, newName); }
function updateProgress() { if (habits.length === 0) { progressBar.style.width = '0%'; progressText.textContent = '0% Completed'; motivationMsg.textContent = 'Add a habit to get started!'; return; } const completedCount = habits.filter(h => h.lastCompleted && new Date(h.lastCompleted).toDateString() === new Date().toDateString()).length; const percent = Math.round((completedCount / habits.length) * 100); progressBar.style.width = `${percent}%`; progressText.textContent = `${percent}% Completed`; if (percent === 100) motivationMsg.textContent = "Excellent! You completed all habits! 🎉"; else if (percent >= 70) motivationMsg.textContent = "Great job! Keep it up! 💪"; else if (percent >= 40) motivationMsg.textContent = "Good progress! Stay consistent! 🌱"; else motivationMsg.textContent = "You can do it! 🚀"; }


// ------------------ NON-HABIT FEATURE LOGIC (Chatbot, Theme, Quotes) ------------------
function applyTheme(theme) { /* ... unchanged ... */ }
function showDailyQuote() { /* ... unchanged ... */ }
function addMessage(sender, text) { /* ... unchanged ... */ }
function handleChat() { /* ... unchanged ... */ }
// (Copying unchanged functions for completeness)
function applyTheme(theme) { if (theme === 'dark') { document.body.classList.add('dark-mode'); themeToggle.textContent = '☀️'; } else { document.body.classList.remove('dark-mode'); themeToggle.textContent = '🌑'; } }
const dailyQuotes = ["The secret of getting ahead is getting started.", "Your future is created by what you do today, not tomorrow."]; function showDailyQuote() { const quote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]; const popup = document.getElementById('dailyQuotePopup'); const quoteText = document.getElementById('dailyQuoteText'); if (popup && quoteText) { quoteText.textContent = quote; popup.style.display = 'flex'; document.getElementById('closeQuotePopup').onclick = () => { popup.style.display = 'none'; }; } }
const botGreetings = ["Hey there! 👋", "Hello!", "Hi!"]; const botMotivationalQuotes = ["Every step counts.", "Stay consistent."]; const botTips = ["Tip: Attach your new habit to an existing one!", "Tip: Start small."]; function addMessage(sender, text) { const msg = document.createElement('div'); msg.className = `chat-message ${sender === 'bot' ? 'bot-msg' : 'user-msg'}`; msg.textContent = text; chatWindow.appendChild(msg); chatWindow.scrollTop = chatWindow.scrollHeight; }
function handleChat() { const userText = chatInput.value.trim().toLowerCase(); if (userText === '') return; addMessage('user', chatInput.value); chatInput.value = ''; setTimeout(() => { let botReply = "I'm not sure. Try 'tip' or 'motivation'!"; if (userText.includes('hello') || userText.includes('hi')) botReply = botGreetings[Math.floor(Math.random() * botGreetings.length)]; else if (userText.includes('motivation') || userText.includes('quote')) botReply = botMotivationalQuotes[Math.floor(Math.random() * botMotivationalQuotes.length)]; else if (userText.includes('tip') || userText.includes('help')) botReply = botTips[Math.floor(Math.random() * botTips.length)]; addMessage('bot', botReply); }, 500); }

// ------------------ EVENT LISTENERS ------------------
showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showRegisterView(); });
showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLoginView(); });
registerForm.addEventListener('submit', handleRegister);
loginForm.addEventListener('submit', handleLogin);
logoutButton.addEventListener('click', handleLogout);
addHabitBtn.addEventListener('click', addHabitAPI);
sendBtn.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleChat(); });
themeToggle.addEventListener('click', () => { const isDarkMode = document.body.classList.contains('dark-mode'); if (isDarkMode) { localStorage.setItem('theme', 'light'); applyTheme('light'); } else { localStorage.setItem('theme', 'dark'); applyTheme('dark'); } });
profileButton.addEventListener('click', fetchAndShowProfile);
closeProfilePopup.addEventListener('click', () => profilePopup.classList.add('hidden'));

// ------------------ INITIALIZATION ------------------
function init() {
    const token = localStorage.getItem('token');
    if (token) {
        showAppView();
    } else {
        showLoginView();
    }
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    showDailyQuote();
}

// Run the app!
init();