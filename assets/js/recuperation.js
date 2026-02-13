const CONFIG = {
  URL_BASE:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:8000/"
      : "https://trabalhofcdd-backend.onrender.com/",
};

const apiService = {
  async getUserData(login) {
    const response = await fetch(
      `${CONFIG.URL_BASE}api/v1/forgotpassword/${login}`,
    );
    return await response.json();
  },

  async requestRecoveryCode(formData) {
    const response = await fetch(`${CONFIG.URL_BASE}api/v1/forgotpassword`, {
      method: "POST",
      body: formData,
    });
    return await response.json();
  },

  async validateCode(userId, formData) {
    const response = await fetch(
      `${CONFIG.URL_BASE}api/v1/forgotpassword/${userId}/validate`,
      {
        method: "POST",
        body: formData,
      },
    );
    return await response.json();
  },

  async updatePassword(userId, password) {
    const response = await fetch(
      `${CONFIG.URL_BASE}api/v1/forgotpassword/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify({ password: `${password}` }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return await response.json();
  },
};

const uiService = {
  showSuccess(title, text) {
    return Swal.fire({
      icon: "success",
      title: title,
      text: text,
      confirmButtonColor: "#4a90e2",
    });
  },

  showError(title, text = "") {
    return Swal.fire({
      icon: "error",
      title: title,
      text: text,
      confirmButtonColor: "#4a90e2",
    });
  },

  renderValidationForm(email) {
    const html = `
      <form id="valida-code">
          <label for="code">Digite o código de verificação que foi enviado para o seu email</label>
          <input type="text" id="code" name="code" placeholder="Digite seu código" required/>
          <p style="font-size: 10px;">Código enviado para: <span id="email-user">${email}</span></p>
          <button id="btnRecuperar" type="submit">Recuperar</button>
      </form>
    `;
    document.getElementById("container").innerHTML = html;
  },

  renderResetPasswordForm() {
    const html = `
      <form id="form-reset-password">
          <label for="password">Nova Senha</label>
          <input type="password" id="password" name="password" placeholder="Digite sua nova senha" required minlength="4"/>
          
          <label for="confirm_password">Confirmar Nova Senha</label>
          <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirme sua nova senha" required minlength="4"/>
          
          <button id="btnResetPassword" type="submit">Redefinir Senha</button>
      </form>
    `;
    document.getElementById("container").innerHTML = html;
  },
};

let currentUserId = null;
let currentUserEmail = null;

document.addEventListener("DOMContentLoaded", async () => {
  const loginInput = document.getElementById("login");
  const userLocalStorage = localStorage.getItem("userErrorPassword");

  if (userLocalStorage) {
    loginInput.value = userLocalStorage;
  }

  try {
    const dataUser = await apiService.getUserData(
      userLocalStorage || loginInput.value,
    );

    if (dataUser.response) {
      currentUserEmail = dataUser.output?.email;
      currentUserId = dataUser.output?.id;

      document.getElementById("email-user").textContent = currentUserEmail;

      const formRecuperacao = document.getElementById("form-recuperacao");
      if (formRecuperacao) {
        formRecuperacao.addEventListener("submit", handleRecoverySubmit);
      }
    } else {
      uiService.showError(
        "Favor consulte um administrador para ter acesso!",
        "Os dados enviados para o servidor não existem em nosso sistema!",
      );
    }
  } catch (error) {
    console.error("Initialization error:", error);
    document.getElementById("container").innerHTML =
      "Usuário não encontrado! Entre em contato com o administrador do sistema. <br><a href='index.html'>Voltar</a>";
  }
});

async function handleRecoverySubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  try {
    const data = await apiService.requestRecoveryCode(formData);
    console.log("Recovery request result:", data);

    if (data.response) {
      await uiService.showSuccess(
        "Código de verificação enviado!",
        "Verifique seu email para redefinir a senha.",
      );

      uiService.renderValidationForm(currentUserEmail);

      const validaCodeForm = document.getElementById("valida-code");
      if (validaCodeForm) {
        validaCodeForm.addEventListener("submit", handleCodeValidationSubmit);
      }
    } else {
      uiService.showError(data.status || "Erro ao processar solicitação.");
    }
  } catch (error) {
    console.error("Recovery submit error:", error);
    uiService.showError("Erro", "Erro ao conectar com o servidor.");
  }
}

async function handleCodeValidationSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  try {
    const data = await apiService.validateCode(currentUserId, formData);
    console.log("Validation result:", data);

    if (data.response) {
      await uiService.showSuccess(
        "Código validado!",
        "Agora você pode redefinir sua senha.",
      );

      uiService.renderResetPasswordForm();

      const resetPasswordForm = document.getElementById("form-reset-password");
      if (resetPasswordForm) {
        resetPasswordForm.addEventListener("submit", handlePasswordResetSubmit);
      }
    } else {
      uiService.showError(data.status || "Código inválido.");
    }
  } catch (error) {
    console.error("Validation submit error:", error);
    uiService.showError("Erro", "Erro ao conectar com o servidor.");
  }
}

async function handlePasswordResetSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm_password");

  if (password !== confirmPassword) {
    uiService.showError("Erro", "As senhas não coincidem.");
    return;
  }

  try {
    const data = await apiService.updatePassword(currentUserId, password);
    console.log("Password reset result:", data);

    if (data.response) {
      await uiService.showSuccess(
        "Sucesso!",
        "Sua senha foi redefinida com sucesso.",
      );
      localStorage.removeItem("userErrorPassword");
      window.location.href = "index.html";
    } else {
      uiService.showError(data.status || "Erro ao redefinir senha.");
    }
  } catch (error) {
    console.error("Password reset error:", error);
    uiService.showError("Erro", "Erro ao conectar com o servidor.");
  }
}
