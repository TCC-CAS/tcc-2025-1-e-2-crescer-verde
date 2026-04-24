const originalFetch = window.fetch;
window.fetch = async function () {
  const response = await originalFetch.apply(this, arguments);
  console.log("FETCH", response);
  if (response.status === 401 || response.status === 400) {
    const clone = response.clone();
    try {
      const data = await clone.json();
      console.log("DATA", data);
      if (data.expired) {
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        if (!window.location.pathname.endsWith("/login.html")) {
          window.location.href = "/HTML/login.html";
        }
      }
    } catch (e) {
      // Ignorar erros de parse JSON
    }
  }
  return response;
};

document.addEventListener("DOMContentLoaded", () => {
  const navUsuarios = document.getElementById("nav-usuarios");

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  let isAdmin = false;

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === "admin") {
        isAdmin = true;
      }
    } catch (e) {
      console.error("Erro ao ler dados do usuário:", e);
    }

    if (isAdmin && navUsuarios) {
      navUsuarios.style.display = "block";
    }
  } else {
    if (navUsuarios) {
      navUsuarios.style.display = "none";
    }
  }
});
