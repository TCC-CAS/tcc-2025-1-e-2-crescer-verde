document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorDiv = document.getElementById("login-error");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            errorDiv.style.display = "none";
            errorDiv.textContent = "";

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(API_BASE + "/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    if (data.user.role === "guardian") {
                        window.location.href = "/HTML/painel-parental.html";
                    } else {
                        window.location.href = "/HTML/jogos.html";
                    }
                } else {
                    errorDiv.textContent = data.message || "Erro ao fazer login. Verifique suas credenciais.";
                    errorDiv.style.display = "block";
                }
            } catch (error) {
                errorDiv.textContent = "Erro de conexão com o servidor.";
                errorDiv.style.display = "block";
            }
        });
    }

    const forgotLink = document.getElementById("forgot-password-link");
    if (forgotLink) {
        forgotLink.addEventListener("click", (e) => {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.getElementById("forgotPasswordModal"));
            modal.show();
        });
    }

    const forgotForm = document.getElementById("forgot-form");
    if (forgotForm) {
        forgotForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const infoDiv = document.getElementById("forgot-info");
            const errDiv = document.getElementById("forgot-error");
            const submitBtn = document.getElementById("forgot-submit-btn");
            const email = document.getElementById("forgot-email").value.trim();

            infoDiv.style.display = "none";
            errDiv.style.display = "none";
            submitBtn.disabled = true;
            submitBtn.textContent = "Aguarde...";

            try {
                const res = await fetch(API_BASE + "/api/auth/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });

                const data = await res.json();

                infoDiv.textContent = data.message || "Solicitação enviada.";
                infoDiv.style.display = "block";
                forgotForm.style.display = "none";
            } catch (err) {
                errDiv.textContent = "Erro de conexão com o servidor.";
                errDiv.style.display = "block";
                submitBtn.disabled = false;
                submitBtn.textContent = "Enviar link";
            }
        });
    }
});
