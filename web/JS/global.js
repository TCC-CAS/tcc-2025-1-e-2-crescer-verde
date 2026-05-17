/* ── Interceptor de fetch para sessão expirada ── */
const originalFetch = window.fetch;
window.fetch = async function () {
  const response = await originalFetch.apply(this, arguments);
  if (response.status === 401 || response.status === 400) {
    const clone = response.clone();
    try {
      const data = await clone.json();
      if (data.expired) {
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        if (!window.location.pathname.endsWith("/login.html")) {
          window.location.href = "/HTML/login.html";
        }
      }
    } catch (e) {
      // ignorar erros de parse JSON
    }
  }
  return response;
};

document.addEventListener("DOMContentLoaded", () => {
  /* ── 1. Scroll shadow na navbar ── */
  const navbar = document.getElementById("main-nav");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 10);
    }, { passive: true });
  }

  /* ── 2. Hamburger menu ── */
  const hamburger = document.getElementById("nav-hamburger");
  const navLinks  = document.getElementById("nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
    });

    /* Fecha ao clicar em qualquer link do menu */
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });

    /* Fecha ao clicar fora */
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ── 3. Visibilidade do link de Usuários (admin) ── */
  const navUsuariosLi = document.getElementById("nav-usuarios-li");

  const token   = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  let isAdmin = false;

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === "admin") isAdmin = true;
    } catch (e) {
      console.error("Erro ao ler dados do usuário:", e);
    }

    if (isAdmin && navUsuariosLi) {
      navUsuariosLi.style.display = "flex";
    }

    /* Mostrar ações de admin na listagem */
    const adminActions = document.getElementById("admin-actions");
    if (isAdmin && adminActions) {
      adminActions.style.display = "block";

      const novoCursoBtn = adminActions.querySelector("button");
      if (novoCursoBtn) {
        novoCursoBtn.addEventListener("click", () => {
          const form    = document.getElementById("createCourseForm");
          const idField = document.getElementById("courseId");
          const label   = document.getElementById("courseModalLabel");
          const delBtn  = document.getElementById("deleteCourseBtn");
          const errDiv  = document.getElementById("modal-error");

          if (form)    form.reset();
          if (idField) idField.value = "";
          if (label)   label.textContent = "Criar Novo Curso";
          if (delBtn)  delBtn.style.display = "none";
          if (errDiv)  errDiv.style.display = "none";
        });
      }
    }
  } else {
    if (navUsuariosLi) navUsuariosLi.style.display = "none";
  }

  /* ── 4. Marca o link ativo no nav conforme a URL atual ── */
  document.querySelectorAll("#nav-links .nav-link").forEach(link => {
    try {
      const href = new URL(link.href, window.location.origin).pathname;
      if (href === window.location.pathname) {
        link.classList.add("active");
      }
    } catch (_) {}
  });
});
