const apiUrl = 'https://jsonplaceholder.typicode.com/users';
const userList = document.getElementById('user-list');
const loadingIndicator = document.getElementById('loading');
const noResults = document.getElementById('no-results');
const searchInput = document.getElementById('search');
const filterCity = document.getElementById('filter-city');
const clearButton = document.getElementById('clear-button');
const addUserButton = document.getElementById('add-user-button');

const addUserModal = document.getElementById('add-user-modal');
const addUserForm = document.getElementById('add-user-form');
const closeModalButton = document.getElementById('close-modal-button');

let users = [];
let filteredUsers = [];

async function fetchUsers() {
  try {
    showLoading();
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Erro ao carregar os dados');
    users = await response.json();
    filteredUsers = [...users];
    displayUsers(users);
    populateCityFilter();
    restoreStateFromLocalStorage();
  } catch (error) {
    alert(error.message);
  } finally {
    hideLoading();
  }
}

function displayUsers(userArray) {
  userList.innerHTML = '';
  if (userArray.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');
  userArray.forEach(user => {
    const li = document.createElement('li');
    li.className = 'user-card';
    li.innerHTML = `
      <div class="cab">
        <span><strong>Nome:</strong> ${user.name}</span><br>
        <span><strong>E-mail:</strong> ${user.email}</span><br>
        <span><strong>Cidade:</strong> ${user.address.city}</span>
      </div>
      <button class="remove-button">Remover</button>
    `;
    userList.appendChild(li);
  });
}

addUserButton.addEventListener('click', () => {
  addUserModal.classList.remove('hidden');
});

closeModalButton.addEventListener('click', () => {
  addUserModal.classList.add('hidden');
});

addUserForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('user-name').value;
  const email = document.getElementById('user-email').value;
  const city = document.getElementById('user-city').value;

  const newUser = {
    name,
    email,
    address: {
      city,
    },
  };

  users.push(newUser);
  filteredUsers.push(newUser);
  displayUsers(filteredUsers);
  addUserModal.classList.add('hidden');
  addUserForm.reset();
  saveStateToLocalStorage();
});

userList.addEventListener('click', (event) => {
  if (event.target && event.target.classList.contains('remove-button')) {
    const userItem = event.target.closest('li');
    userItem.classList.add('fade-out');
    setTimeout(() => userItem.remove(), 500);
  }
});

function populateCityFilter() {
  const cities = [...new Set(users.map(user => user.address.city))];
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    filterCity.appendChild(option);
  });
}

function filterByName() {
  const query = searchInput.value.toLowerCase();
  filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(query)
  );
  filterByCity();
}

function filterByCity() {
  const selectedCity = filterCity.value;
  const results = filteredUsers.filter(user =>
    selectedCity ? user.address.city === selectedCity : true
  );
  displayUsers(results);
}

function showLoading() {
  loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
  loadingIndicator.classList.add('hidden');
}

function saveStateToLocalStorage() {
  localStorage.setItem('searchQuery', searchInput.value);
  localStorage.setItem('selectedCity', filterCity.value);
  localStorage.setItem('filteredUsers', JSON.stringify(filteredUsers));
}

function restoreStateFromLocalStorage() {
  const savedQuery = localStorage.getItem('searchQuery');
  const savedCity = localStorage.getItem('selectedCity');
  const savedFilteredUsers = localStorage.getItem('filteredUsers');

  if (savedQuery) {
    searchInput.value = savedQuery;
  }

  if (savedCity) {
    filterCity.value = savedCity;
  }

  if (savedFilteredUsers) {
    filteredUsers = JSON.parse(savedFilteredUsers);
    displayUsers(filteredUsers);
  } else {
    filteredUsers = [...users];
    displayUsers(users);
  }
}

clearButton.addEventListener('click', () => {
  searchInput.value = '';
  filterCity.value = '';
  filteredUsers = [...users];
  displayUsers(filteredUsers);
  saveStateToLocalStorage();
});

searchInput.addEventListener('input', () => {
  filterByName();
  saveStateToLocalStorage();
});

filterCity.addEventListener('change', () => {
  filterByCity();
  saveStateToLocalStorage();
});

fetchUsers();