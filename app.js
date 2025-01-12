// Pegando os elementos do DOM para que eu possa interagir com a interface
const userList = document.getElementById("user-list");
const loadingIndicator = document.getElementById("loading");
const noResults = document.getElementById("no-results");
const searchInput = document.getElementById("search");
const filterCity = document.getElementById("filter-city");
const clearButton = document.getElementById("clear-button");
const addUserButton = document.getElementById("add-user-button");
const addUserModal = document.getElementById("add-user-modal");
const addUserForm = document.getElementById("add-user-form");
const closeModalButton = document.getElementById("close-modal-button");

// Crio um elemento para exibir mensagens de erro, mas deixo ele escondido no início
const errorMessage = document.createElement("div");
errorMessage.id = "error-message";
errorMessage.classList.add("hidden", "error-message");
addUserForm.appendChild(errorMessage);

// Inicializo arrays para armazenar os dados dos usuários e os filtrados
let users = [];
let filteredUsers = [];

// Defino a URL da API onde os dados dos usuários serão carregados
const apiUrl = "https://jsonplaceholder.typicode.com/users";

// Remove a classe hidden
function showLoading() {
  loadingIndicator.classList.remove("hidden");
}

// Função para exibir os usuários na tela
function displayUsers(userArray) {
  userList.innerHTML = ""; // Limpo a lista de usuários antes de adicionar novos
  if (userArray.length === 0) {
    noResults.classList.remove("hidden"); // Exibo uma mensagem se não houver resultados
    return;
  }
  noResults.classList.add("hidden"); // Caso haja resultados, escondo a mensagem de "sem resultados"
  userArray.forEach((user) => {
    // Para cada usuário, crio um item na lista
    const li = document.createElement("li");
    li.className = "user-card";
    li.innerHTML = `
      <div class="user-info">
        <span><strong>Nome:</strong> ${user.name}</span>
        <span><strong>E-mail:</strong> ${user.email}</span>
        <span><strong>Cidade:</strong> ${user.address.city}</span>
      </div>
      <button class="remove-button">Remover</button>
    `;
    userList.appendChild(li); // Adiciono o item à lista de usuários
  });
}

// Função para preencher o filtro de cidades
function populateCityFilter() {
  const cities = [...new Set(users.map((user) => user.address.city))]; // Crio uma lista única de cidades
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    filterCity.appendChild(option); // Adiciono as opções de cidade ao filtro
  });
}

function restoreStateFromLocalStorage() {
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    users = JSON.parse(storedUsers); // Recupero os usuários armazenados
    filteredUsers = [...users]; // Faço uma cópia dos usuários para aplicar filtros
    displayUsers(filteredUsers); // Exibo os usuários
  }
}

// Função assíncrona para carregar os usuários da API
async function fetchUsers() {
  try {
    showLoading(); // Exibo o indicador de carregamento enquanto os dados estão sendo carregados
    const response = await fetch(apiUrl); // Faço a requisição para a API
    if (!response.ok) throw new Error("Erro ao carregar os dados"); // Caso a resposta da API não seja bem-sucedida, lanço um erro
    users = await response.json(); // Salvo os dados dos usuários recebidos
    filteredUsers = [...users]; // Crio uma cópia dos usuários para aplicar filtros
    displayUsers(users); // Exibo os usuários na tela
    populateCityFilter(); // Preencho o filtro de cidade com as opções disponíveis
    restoreStateFromLocalStorage(); // Tento restaurar os dados salvos no localStorage, se houver
  } catch (error) {
    showError(error.message); // Se ocorrer um erro, mostro uma mensagem de erro
  } finally {
    hideLoading(); // Ao final, escondo o indicador de carregamento
  }
}

// Função para exibir uma mensagem de erro
function showError(message) {
  errorMessage.textContent = message; // Defino o texto da mensagem de erro
  errorMessage.classList.remove("hidden"); // Exibo a mensagem de erro
}

// Função para mostrar um modal de confirmação (exemplo de uso de Promise)
function showConfirmModal(message) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.classList.add('confirm-modal');
    modal.innerHTML = `
      <div class="confirm-modal-content">
        <p>${message}</p>
        <button class="confirm-yes btn-yes">Sim</button>
        <button class="confirm-no btn-no">Não</button>
      </div>
    `;
    document.body.appendChild(modal);

    // Resolvo a Promise dependendo do botão clicado
    modal.querySelector('.confirm-yes').addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(true); // Se o usuário clicar em "Sim", resolve com true
    });
    modal.querySelector('.confirm-no').addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(false); // Se o usuário clicar em "Não", resolve com false
    });
  });
}

// Funções de filtro
function filterByName() {
  const query = searchInput.value.toLowerCase();
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query) // Filtro os usuários pelo nome
  );
  filterByCity(); // Aplico o filtro de cidade após o de nome
}

function filterByCity() {
  const selectedCity = filterCity.value;
  const results = filteredUsers.filter((user) =>
    selectedCity ? user.address.city === selectedCity : true // Filtro de acordo com a cidade selecionada
  );
  displayUsers(results); // Exibo os resultados filtrados
}

function hideLoading() {
  loadingIndicator.classList.add("hidden");
}

// Funções de salvar e restaurar o estado no localStorage
function saveStateToLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users)); // Salvo os dados dos usuários
}

// Inicializo os dados ao carregar a página
window.addEventListener("load", () => {
  fetchUsers();
});

// Ao clicar no botão de adicionar usuário, mostro o modal para preencher os dados
addUserButton.addEventListener("click", () => {
  addUserModal.classList.remove("hidden"); // Exibo o modal
});

// Quando o botão de fechar o modal é clicado, verifico se os campos foram preenchidos
closeModalButton.addEventListener("click", () => {
  const name = document.getElementById("user-name").value.trim();
  const email = document.getElementById("user-email").value.trim();
  const city = document.getElementById("user-city").value.trim();

  if (name || email || city) {
    // Se algum campo foi preenchido, mostro um modal perguntando se deseja fechar sem salvar
    showConfirmModal("Alguns campos foram preenchidos, mas não foram salvos. Deseja realmente fechar?")
      .then((confirmClose) => {
        if (confirmClose) {
          addUserModal.classList.add("hidden");
          errorMessage.classList.add("hidden"); // Escondo a mensagem de erro
          errorMessage.textContent = "";
          addUserForm.reset(); // Reseto o formulário
        }
      });
  } else {
    // Se os campos estão vazios, fecho o modal normalmente
    addUserModal.classList.add("hidden");
    errorMessage.classList.add("hidden");
    errorMessage.textContent = "";
  }
});

// Adiciono os ouvintes de eventos para os filtros
searchInput.addEventListener("input", filterByName);
filterCity.addEventListener("change", filterByCity);

clearButton.addEventListener("click", () => {
  // Limpa o campo de busca e reseta o filtro de cidade
  searchInput.value = "";
  filterCity.value = "";

  // Restaura a lista de usuários completa
  filteredUsers = [...users];
  displayUsers(filteredUsers);

  // Esconde a mensagem de "sem resultados" se necessário
  noResults.classList.add("hidden");
});

// Função para lidar com a remoção de um usuário
userList.addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("remove-button")) {
    const userItem = event.target.closest("li");
    userItem.classList.add("fade-out"); // Adiciono uma animação de fade-out
    setTimeout(() => userItem.remove(), 500); // Removo o item após a animação

    // Removo o usuário dos arrays de usuários
    const userName = userItem.querySelector(".user-info span strong").nextElementSibling.textContent;
    users = users.filter(user => user.name !== userName);
    filteredUsers = filteredUsers.filter(user => user.name !== userName);
    saveStateToLocalStorage(); // Atualizo o localStorage após a remoção
  }
});

// Função que é chamada quando o formulário de adicionar um novo usuário é enviado
addUserForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Evito que o formulário seja enviado e a página seja recarregada

  const name = document.getElementById("user-name").value.trim();
  const email = document.getElementById("user-email").value.trim();
  const city = document.getElementById("user-city").value.trim();

  // Função para validar o nome (permitindo apenas letras, espaços e hífens)
  function isValidName(name) {
    const regex = /^[a-zA-ZÀ-ÿ\s-]+$/;
    return regex.test(name);
  }

  // Valido se o nome contém ao menos o primeiro e o sobrenome
  if (!name.includes(" ") || name.split(" ").length < 2) {
    showError("Por favor, insira nome e sobrenome!");
    return;
  }

  // Se o nome for inválido, mostro uma mensagem de erro
  if (!isValidName(name)) {
    showError("O nome e sobrenome devem conter apenas letras!");
    return;
  }

  // Limpo qualquer mensagem de erro e limpo o formulário
  errorMessage.classList.add("hidden");
  errorMessage.textContent = "";

  // Crio um novo objeto de usuário
  const newUser = {
    name,
    email,
    address: {
      city,
    },
  };

  // Adiciono o novo usuário aos arrays de usuários
  users.push(newUser);
  filteredUsers.push(newUser);
  displayUsers(filteredUsers); // Exibo a lista atualizada de usuários
  addUserModal.classList.add("hidden"); // Fecho o modal
  addUserForm.reset(); // Reseto o formulário
  saveStateToLocalStorage(); // Salvo o estado atualizado no localStorage
});
