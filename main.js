let savedEvents = [];

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    initSPA();
    renderFooter();
    const addEventForm = document.getElementById('add-event-form');
    if (addEventForm) {
        addEventForm.addEventListener('submit', handleAddEvent);
    }
});

function fetchEvents() {
    fetch('https://yourapi.com/events')
        .then(response => response.json())
        .then(data => {
            savedEvents = data;
        })
        .catch(error => console.error('Error fetching events:', error));
}

function initSPA() {
    if (!window.location.hash) {
        window.location.hash = '#login';
    }
    navigateToPage(window.location.hash.substring(1));
    window.addEventListener('hashchange', () => {
        navigateToPage(window.location.hash.substring(1));
    });
}

function navigateToPage(page) {
    if (!isLoggedIn() && page !== 'login') {
        renderAccessDeniedPage();
        return;
    }
    switch (page) {
        case 'add-event':
            renderAddEventPage();
            break;
        case 'view-events':
            renderViewEventsPage();
            break;
        case 'home':
            renderHomePage();
            break;
        case 'login':
            renderLoginPage();
            break;
        default:
            renderLoginPage();
            break;
    }
}

function renderAccessDeniedPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="access-denied">
            <h2>Zugriff verweigert</h2>
            <p>Sie müssen angemeldet sein, um diese Seite zu sehen.</p>
            <button class="button" onclick="window.location.hash='login'">Zur Anmeldung</button>
        </div>
    `;
}

function isLoggedIn() {
    return localStorage.getItem('loggedInUser') != null;
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username.length < 4 || password.length < 4) {
        alert('Bitte stellen Sie sicher, dass Benutzername und Passwort mindestens 4 Zeichen lang sind.');
        return;
    }

    const user = JSON.parse(localStorage.getItem(username));
    if (user && user.password === password) {
        localStorage.setItem('loggedInUser', username);
        renderHomePage();
        updateNavVisibility();
    } else {
        alert('Falscher Benutzername oder Passwort!');
    }
    window.location.hash = '#home';
}

function register() {
    const firstname = document.getElementById('register-firstname').value;
    const lastname = document.getElementById('register-lastname').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (
        firstname.length < 4 ||
        lastname.length < 4 ||
        username.length < 4 ||
        password.length < 4
    ) {
        alert('Bitte stellen Sie sicher, dass Vorname, Nachname, Benutzername und Passwort mindestens 4 Zeichen lang sind.');
        return;
    }

    const newUser = { firstname, lastname, username, password };

    if (localStorage.getItem(username)) {
        alert('Ein Benutzer mit diesem Benutzernamen existiert bereits.');
    } else {
        localStorage.setItem(username, JSON.stringify(newUser));

        const userList = JSON.parse(localStorage.getItem('userList')) || [];

        userList.push(username);

        localStorage.setItem('userList', JSON.stringify(userList));

        alert('Registrierung erfolgreich. Sie können sich jetzt anmelden.');
        renderLoginPage();
    }
    window.location.hash = '#login';
}

function getUserList() {
    const userList = JSON.parse(localStorage.getItem('userList')) || [];
    return userList;
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.hash = '#login';
}

function renderLoginPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-container">
            <h2 class="centered-title">Anmeldung</h2>
            <input type="text" id="login-username" class="form-input" placeholder="Benutzername" required>
            <input type="password" id="login-password" class="form-input" placeholder="Passwort" required>
            <button class="button" onclick="login()">Anmelden</button>
            
            <h2 class="centered-title">Registrierung</h2>
            <input type="text" id="register-firstname" class="form-input" placeholder="Vorname" required>
            <input type="text" id="register-lastname" class="form-input" placeholder="Nachname" required>
            <input type="text" id="register-username" class="form-input" placeholder="Benutzername" required>
            <input type="password" id="register-password" class="form-input" placeholder="Passwort" required>
            <button class="button" onclick="register()">Registrieren</button>
        </div>
    `;
    if (isLoggedIn()) {
        app.innerHTML += `
            <div class="logout-section">
                <button class="button logout-button" onclick="logout()">Abmelden</button>
            </div>
        `;
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    updateNavVisibility();
    window.location.hash = '#login';
    renderLoginPage();
}

function renderHomePage() {
    if (!isLoggedIn()) {
        renderLoginPage();
    } else {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="startpage-container">
                <h1 class="startpage-header">Willkommen beim Eventplaner</h1>
                <p class="startpage-description">Planen und verwalten Sie Ihre Events effizient und einfach.</p>
                <div class="startpage-buttons">
                    <button class="button" onclick="navigateToAddEvent()">Event Hinzufügen</button>
                    <button class="button" onclick="navigateToViewEvents()">Events Anzeigen</button>
                    <button class="button logout-button" onclick="logout()">Abmelden</button>
                </div>
            </div>
        `;
    }
}

function accessDenied() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="access-denied">
            <h2>Zugriff verweigert</h2>
            <p>Sie müssen angemeldet sein, um diese Seite zu sehen.</p>
            <button class="button" onclick="window.location.hash='login'">Zur Anmeldung</button>
        </div>
    `;
}

function updateNavVisibility() {
    const navbar = document.getElementById('navbar');
    if (isLoggedIn()) {
        navbar.style.display = 'flex';
    } else {
        navbar.style.display = 'none';
    }
}

function renderNavbar() {
    const navbar = document.createElement('nav');
    navbar.id = 'navbar';
    navbar.innerHTML = `
        <ul>
            <li><a href="#login">Anmeldung</a></li>
            <li><a href="#home">Startseite</a></li>
            <li><a href="#add-event">Event Hinzufügen</a></li>
            <li><a href="#view-events">Events Anzeigen</a></li>
        </ul>
    `;
    document.body.insertBefore(navbar, document.body.firstChild);
    updateNavVisibility();
}

function renderAddEventPage() {
    if (!isLoggedIn()) {
        accessDenied();
    } else {
        const app = document.getElementById('app');
        app.innerHTML = `
    <div class="form-container"> <!-- Hinzugefügter Container mit Klasse für das Styling -->
    <h1 class="centered-title">Event hinzufügen</h1>
            <form id="add-event-form">
                <label for="event-title">Event Titel:</label>
                <input type="text" id="event-title" class="form-input" required>

                <label for="event-date">Datum:</label>
                <input type="date" id="event-date" class="form-input" required>

                <label for="event-time">Uhrzeit:</label>
                <input type="time" id="event-time" class="form-input">

                <label for="event-description">Beschreibung (optional):</label>
                <textarea id="event-description" class="form-input"></textarea>

                <button type="submit" class="button">Event Hinzufügen</button>
            </form>
        </div>
    `;
    }

    document.getElementById('add-event-form').addEventListener('submit', handleAddEvent);
}

function isDateAndTimeValid(dateString, timeString) {
    const currentDate = new Date();
    const inputDateTime = new Date(dateString + 'T' + timeString);
    if (inputDateTime <= currentDate) {
        return false;
    }

    return true;
}

function handleAddEvent(e) {
    e.preventDefault();

    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const description = document.getElementById('event-description').value;
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser) {
        alert('Sie sind nicht angemeldet.');
        return;
    }

    if (!isDateAndTimeValid(date, time)) {
        alert('Das eingegebene Datum und die Zeit sind ungültig. Bitte wählen Sie ein Datum in der Zukunft oder stellen Sie sicher, dass die Zeit noch nicht vergangen ist.');
        return;
    }

    const userEvents = JSON.parse(localStorage.getItem(`${loggedInUser}_events`)) || [];
    const newEvent = { title, date, time, description };
    userEvents.push(newEvent);
    localStorage.setItem(`${loggedInUser}_events`, JSON.stringify(userEvents));
    showNotification('Event wurde erfolgreich hinzugefügt');
    window.location.hash = '#view-events';
    renderViewEventsPage();
}

function showNotification(message) {
    alert(message);
}

document.getElementById('add-event-form').addEventListener('submit', handleAddEvent);

function cancelEdit() {
    isEditing = false;
    editingIndex = -1;
    document.getElementById('add-event-form').reset();
    const cancelButton = document.querySelector('.cancel-button');
    if (cancelButton) cancelButton.remove();
    document.querySelector('button[type="submit"]').textContent = 'Event Hinzufügen';
}

function showNotification(message) {
    alert(message);
}

function renderViewEventsPage() {
    if (!isLoggedIn()) {
        renderAccessDeniedPage();
        return;
    }
    const app = document.getElementById('app');
    app.innerHTML = '<h1 class="centered-title">Events Anzeigen</h1>';
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userEvents = JSON.parse(localStorage.getItem(`${loggedInUser}_events`)) || [];
    if (userEvents.length === 0) {
        app.innerHTML += `<div class="no-events">Es sind noch keine Events vorhanden.</div>`;
        return;
    }
    const eventsList = document.createElement('div');
    eventsList.className = 'events-list';

    userEvents.forEach((event, index) => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';

        if (!isDateAndTimeValid(event.date, event.time)) {
            eventItem.innerHTML = `
                <p style="color: red;">Event abgelaufen: ${event.title}</p>
                <button class="small-button delete-button" onclick="deleteEvent(${index})">Löschen</button>
            `;
        } else {
            eventItem.innerHTML = `
                <h3>${event.title}</h3>
                <p>Datum: ${event.date}, Uhrzeit: ${event.time}</p>
                <p>${event.description}</p>
                <button class="small-button edit-button">Bearbeiten</button>
                <button class="small-button delete-button">Löschen</button>
                <div id="edit-form-container-${index}" class="edit-form-container" style="display: none;">
                    <input type="text" id="edit-title-${index}" value="${event.title}">
                    <input type="date" id="edit-date-${index}" value="${event.date}">
                    <input type="time" id="edit-time-${index}" value="${event.time}">
                    <textarea id="edit-description-${index}">${event.description}</textarea>
                    <button type="button" onclick="saveUpdatedEvent(${index})">Speichern</button>
                    <button type="button" onclick="toggleEditForm(${index}, false)">Abbrechen</button>
                </div>
            `;
        }
        eventsList.appendChild(eventItem);
    });

    app.appendChild(eventsList);
    addEventListenersToButtons();
}

function toggleEditForm(index, show) {
    const editFormContainer = document.getElementById(`edit-form-container-${index}`);
    editFormContainer.style.display = show ? 'block' : 'none';
}

function addEventListenersToButtons() {
    document.querySelectorAll('.edit-button').forEach((button, index) => {
        button.addEventListener('click', () => toggleEditForm(index, true));
    });

    document.querySelectorAll('.delete-button').forEach((button, index) => {
        button.addEventListener('click', () => deleteEvent(index));
    });
}

function saveUpdatedEvent(index) {
    const updatedEvent = {
        title: document.getElementById(`edit-title-${index}`).value,
        date: document.getElementById(`edit-date-${index}`).value,
        time: document.getElementById(`edit-time-${index}`).value,
        description: document.getElementById(`edit-description-${index}`).value
    };

    const loggedInUser = localStorage.getItem('loggedInUser');
    const userEvents = JSON.parse(localStorage.getItem(`${loggedInUser}_events`)) || [];
    userEvents[index] = updatedEvent;
    localStorage.setItem(`${loggedInUser}_events`, JSON.stringify(userEvents));
    toggleEditForm(index, false);
    renderViewEventsPage();
}

function deleteEvent(index) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userEvents = JSON.parse(localStorage.getItem(`${loggedInUser}_events`)) || [];
    if (index >= 0 && index < userEvents.length) {
        userEvents.splice(index, 1);
        localStorage.setItem(`${loggedInUser}_events`, JSON.stringify(userEvents));
        renderViewEventsPage();
    }
}

let isEditing = false;
let editingIndex = -1;

function editEvent(eventIndex) {
    isEditing = true;
    editingIndex = eventIndex;
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userEvents = JSON.parse(localStorage.getItem(`${loggedInUser}_events`)) || [];
    const eventToEdit = userEvents[eventIndex];
    document.getElementById('event-title').value = eventToEdit.title;
    document.getElementById('event-date').value = eventToEdit.date;
    document.getElementById('event-time').value = eventToEdit.time;
    document.getElementById('event-description').value = eventToEdit.description;
    document.querySelector('#add-event-form button[type="submit"]').textContent = 'Event Aktualisieren';
    window.location.hash = '#add-event';
}

function renderEditEventPage(eventIndex) {
    const app = document.getElementById('app');
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userEvents = JSON.parse(localStorage.getItem(loggedInUser + '_events')) || [];
    const eventToEdit = userEvents[eventIndex];

    app.innerHTML = `
        <div class="form-container">
            <h1 class="centered-title">Event bearbeiten</h1>
            <form id="edit-event-form">
                <label for="event-title">Event Titel:</label>
                <input type="text" id="event-title" class="form-input" value="${eventToEdit.title}" required>

                <label for="event-date">Datum:</label>
                <input type="date" id="event-date" class="form-input" value="${eventToEdit.date}" required>

                <label for="event-time">Uhrzeit:</label>
                <input type="time" id="event-time" class="form-input" value="${eventToEdit.time}">

                <label for="event-description">Beschreibung (optional):</label>
                <textarea id="event-description" class="form-input">${eventToEdit.description}</textarea>

                <button type="button" class="button" onclick="updateEvent(${eventIndex})">Aktualisieren</button>
                <button type="button" class="button cancel-button" onclick="cancelEdit()">Abbrechen</button>
            </form>
        </div>
    `;
    const updateButton = document.getElementById('edit-event-form').querySelector('.button');
    updateButton.addEventListener('click', function () {
        handleAddEvent(eventIndex);
    });
}

function updateEvent(eventIndex) {
    const updatedEvent = {
        title: document.getElementById('event-title').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        description: document.getElementById('event-description').value
    };
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userEvents = JSON.parse(localStorage.getItem(loggedInUser + '_events')) || [];
    userEvents[eventIndex] = updatedEvent;
    localStorage.setItem(loggedInUser + '_events', JSON.stringify(userEvents));
    isEditing = false;
    editingIndex = -1;
    showNotification('Event wurde erfolgreich aktualisiert');
    window.location.hash = '#view-events';
    renderViewEventsPage();
}

function renderHomePage() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const user = loggedInUser ? JSON.parse(localStorage.getItem(loggedInUser)) : null;

    if (!user) {
        renderLoginPage();
    } else {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="startpage-container">
                <h1 class="startpage-header">Willkommen ${user.firstname} ${user.lastname} beim Eventplaner</h1>
                <p class="startpage-description">Planen und verwalten Sie Ihre Events effizient und einfach.</p>
                <div class="startpage-buttons">
                    <button class="button" onclick="navigateToAddEvent()">Event Hinzufügen</button>
                    <button class="button" onclick="navigateToViewEvents()">Events Anzeigen</button>
                </div>
            </div>
        `;
    }
}

function navigateToAddEvent() {
    window.location.hash = '#add-event';
}

function navigateToViewEvents() {
    window.location.hash = '#view-events';
}

function renderFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <a href="#">Impressum</a> | <a href="#">Datenschutzerklärungen</a><br>
        © 2023 Denis Jashari
    `;
    document.body.appendChild(footer);
}
