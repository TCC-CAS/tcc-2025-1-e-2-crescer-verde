document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const email = params.get("email");

  const successDiv = document.getElementById("reset-success");
  const errorDiv = document.getElementById("reset-error");
  const fieldsDiv = document.getElementById("reset-fields");

  if (!token || !email) {
    fieldsDiv.style.display = "none";
    errorDiv.textContent = "Link inválido. Solicite um novo link de redefinição de senha.";
    errorDiv.style.display = "block";
    return;
  }

  const resetForm = document.getElementById("reset-form");
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorDiv.style.display = "none";
    successDiv.style.display = "none";

    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
      errorDiv.textContent = "As senhas não coincidem.";
      errorDiv.style.display = "block";
      return;
    }

    if (newPassword.length < 6) {
      errorDiv.textContent = "A senha deve ter pelo menos 6 caracteres.";
      errorDiv.style.display = "block";
      return;
    }

    const submitBtn = resetForm.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "Redefinindo...";

    try {
      const res = await fetch(API_BASE + "/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        fieldsDiv.style.display = "none";
        successDiv.innerHTML =
          "✅ " + data.message + "<br><br>" +
          "<a href=\"/HTML/login.html\" class=\"btn btn-success btn-sm mt-2\">Ir para o Login</a>";
        successDiv.style.display = "block";
      } else {
        errorDiv.textContent = data.message || "Erro ao redefinir senha.";
        errorDiv.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.textContent = "Redefinir senha";
      }
    } catch (err) {
      errorDiv.textContent = "Erro de conexão com o servidor.";
      errorDiv.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.textContent = "Redefinir senha";
    }
  });
});
