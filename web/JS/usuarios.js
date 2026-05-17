const API_BASE_URL = (window.API_BASE || "") + "/api";
let currentUserIdToDelete = null;
let globalUsersData = [];

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    window.location.href = "/HTML/login.html";
    return;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      alert("Acesso negado. Apenas administradores podem acessar esta página.");
      window.location.href = "/index.html";
      return;
    }
  } catch (e) {
    window.location.href = "/HTML/login.html";
    return;
  }

  loadUsers();

  document.getElementById("user-form").addEventListener("submit", handleUserFormSubmit);

  document.getElementById("confirm-delete-btn").addEventListener("click", executeDeleteUser);

  // Setup the Copy Password functionality
  const copyBtn = document.getElementById("copyPasswordBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const pwdInput = document.getElementById("generatedPasswordDisplay");
      if (pwdInput && pwdInput.value) {
        navigator.clipboard.writeText(pwdInput.value)
          .then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="bi bi-check2-all me-2"></i>Copiado!';
            copyBtn.classList.replace('btn-success', 'btn-dark');

            setTimeout(() => {
              copyBtn.innerHTML = originalText;
              copyBtn.classList.replace('btn-dark', 'btn-success');
            }, 2000);
          })
          .catch(err => {
            console.error("Failed to copy password: ", err);
            alert("Erro ao copiar senha.");
          });
      }
    });
  }
});

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  };
}

function showMessage(type, text) {
  const errorAlert = document.getElementById("error-message");
  const successAlert = document.getElementById("success-message");

  errorAlert.style.display = "none";
  successAlert.style.display = "none";

  if (type === "error") {
    errorAlert.textContent = text;
    errorAlert.style.display = "block";
  } else {
    successAlert.textContent = text;
    successAlert.style.display = "block";
    setTimeout(() => { successAlert.style.display = "none"; }, 3000);
  }
}

async function loadUsers() {
  const tbody = document.getElementById("users-table-body");
  tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Carregando usuários...</td></tr>';

  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      globalUsersData = data.users || [];
      filterUsersByRole();
    } else {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-danger">Erro: ${data.error || 'Falha ao carregar'}</td></tr>`;
    }
  } catch (error) {
    console.error(error);
    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-danger">Erro de conexão com o servidor.</td></tr>';
  }
}

function filterUsersByRole() {
  const filterVal = document.getElementById("role-filter").value;
  let filteredUsers = globalUsersData;

  if (filterVal !== "all") {
    filteredUsers = globalUsersData.filter(u => u.role === filterVal);
  }

  renderUsers(filteredUsers);
}

function renderUsers(users) {
  const tbody = document.getElementById("users-table-body");
  tbody.innerHTML = "";

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Nenhum usuário encontrado.</td></tr>';
    return;
  }

  users.forEach(user => {
    const displayName = user.name || '(sem nome)';
    const safeName = displayName.replace(/'/g, "\\'");
    const roleBadge = user.role === 'admin'
      ? '<span class="badge bg-light-success border border-success border-opacity-25 rounded-pill shadow-sm"><i class="bi bi-shield-lock-fill me-1"></i>Admin</span>'
      : '<span class="badge bg-light-secondary border border-secondary border-opacity-25 rounded-pill shadow-sm"><i class="bi bi-person-fill me-1"></i>Usuário</span>';

    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="ps-4 fw-medium text-dark">
                <div class="d-flex align-items-center">
                    ${displayName}
                </div>
            </td>
            <td class="text-muted">${user.email || ''}</td>
            <td>${roleBadge}</td>
            <td class="text-end pe-4">
                <button class="btn btn-sm btn-light text-primary border action-btn me-1" onclick="openEditModal('${user._id}')" title="Editar">
                    <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-sm btn-light text-danger border action-btn" onclick="openDeleteModal('${user._id}', '${safeName}')" title="Excluir">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function resetUserModal() {
  document.getElementById("user-form").reset();
  document.getElementById("user-id").value = "";
  document.getElementById("userModalLabel").textContent = "Novo Usuário";
}

async function openEditModal(id) {
  resetUserModal();
  document.getElementById("userModalLabel").textContent = "Editar Usuário";
  document.getElementById("user-id").value = id;

  const pwdContainer = document.getElementById("password-container");
  pwdContainer.style.display = "none";

  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();

    if (response.ok && data.user) {
      document.getElementById("user-name").value = data.user.name;
      document.getElementById("user-email").value = data.user.email;
      document.getElementById("user-role").value = data.user.role;

      const modal = new bootstrap.Modal(document.getElementById('userModal'));
      modal.show();
    } else {
      showMessage("error", "Não foi possível carregar os dados do usuário.");
    }
  } catch (error) {
    console.error(error);
    showMessage("error", "Erro ao buscar dados do usuário.");
  }
}

async function handleUserFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("user-id").value;
  const name = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;
  const role = document.getElementById("user-role").value;
  const isUpdate = id !== "";

  const payload = { name, email, role };
  let generatedPassword = null;

  if (!isUpdate) {
    generatedPassword = generateRandomPassword(8);
    payload.password = generatedPassword;
  }
  const url = isUpdate ? `${API_BASE_URL}/users/${id}` : `${API_BASE_URL}/users`;
  const method = isUpdate ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();

      if (isUpdate) {
        showMessage("success", "Usuário atualizado com sucesso!");
      } else {
        // Show the new Password Modal instead of an alert
        document.getElementById("generatedPasswordDisplay").value = generatedPassword;
        const pwdModal = new bootstrap.Modal(document.getElementById('passwordModal'));
        pwdModal.show();

        showMessage("success", "Usuário criado com sucesso!");
      }

      loadUsers();
    } else {
      alert(`Erro: ${data.error || data.message || 'Falha ao salvar'}`);
    }
  } catch (error) {
    console.error(error);
    alert("Erro de conexão ao salvar usuário.");
  }
}

function openDeleteModal(id, name) {
  currentUserIdToDelete = id;
  document.getElementById("delete-user-name").textContent = name;

  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  modal.show();
}

async function executeDeleteUser() {
  if (!currentUserIdToDelete) return;

  try {
    const response = await fetch(`${API_BASE_URL}/users/${currentUserIdToDelete}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
      showMessage("success", "Usuário removido com sucesso!");
      loadUsers();
    } else {
      alert(`Erro: ${data.error || 'Falha ao deletar'}`);
    }
  } catch (error) {
    console.error(error);
    alert("Erro de conexão ao deletar usuário.");
  } finally {
    currentUserIdToDelete = null;
  }
}

function generateRandomPassword(length = 8) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
