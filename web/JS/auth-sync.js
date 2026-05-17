document.addEventListener("DOMContentLoaded", () => {
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (userStr && token) {
    try {
      const user = JSON.parse(userStr);

      const loginLinks = document.querySelectorAll('.nav-link[href*="login.html"]');
      loginLinks.forEach(loginLink => {
        const li = loginLink.parentElement;

        li.classList.add("ms-4");
        li.classList.add("d-flex");
        li.classList.add("align-items-center");
        li.classList.add("gap-3");

        const userSpan = document.createElement("span");
        userSpan.className = "nav-link fw-bold p-0";
        userSpan.textContent = user.name.split(' ')[0];

        const signOutBtn = document.createElement("a");
        signOutBtn.className = "nav-link text-danger p-0 d-flex align-items-center";
        signOutBtn.href = "#";
        signOutBtn.title = "Sair";
        signOutBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/><path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/></svg>`;
        signOutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.href = "/index.html";
        });

        li.innerHTML = '';
        li.appendChild(userSpan);
        li.appendChild(signOutBtn);
      });

      if (user.role === 'admin') {
        const certLinks = document.querySelectorAll('.nav-link[href*="certificados.html"]');
        certLinks.forEach(link => {
          if (link.parentElement) {
            link.parentElement.style.display = 'none';
          }
        });

        const adminActions = document.getElementById('admin-actions');
        if (adminActions) {
          adminActions.style.display = 'block';

          const novoCursoBtn = adminActions.querySelector('button');
          if (novoCursoBtn) {
            novoCursoBtn.addEventListener('click', () => {
              const form = document.getElementById("createCourseForm");
              if (form) form.reset();
              const idField = document.getElementById("courseId");
              if (idField) idField.value = "";

              const label = document.getElementById("courseModalLabel");
              if (label) label.textContent = "Criar Novo Curso";

              const delBtn = document.getElementById("deleteCourseBtn");
              if (delBtn) delBtn.style.display = "none";

              const errDiv = document.getElementById("modal-error");
              if (errDiv) errDiv.style.display = "none";
            });
          }
        }
      }
    } catch (e) {
      console.error("Error parsing user data from localStorage", e);
    }
  }
});
