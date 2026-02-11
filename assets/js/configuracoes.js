let usename = document.getElementById("user");
let user = localStorage.getItem("usuario");
if (usename && user) {
  usename.innerHTML = user;
}

const userId = localStorage.getItem("id");
let API_BASE_URL;
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("Testes em Desenvolvimento");
  API_BASE_URL = "http://localhost:8000/api/v1";
} else {
  console.log("Rodando em Produção");
  API_BASE_URL = "https://trabalhofcdd-backend.onrender.com/api/v1";
}

document.addEventListener("DOMContentLoaded", async function () {
  if (!userId) {
    Swal.fire({
      icon: "error",
      title: "Não identificado",
      text: "Erro: Usuário não identificado. Faça login novamente.",
      confirmButtonColor: "#4a90e2",
    }).then(() => {
      window.location.href = "../index.html";
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/userforid/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });

    const data = await response.json();

    const userData = Array.isArray(data) ? data[0] : data;

    if (userData) {
      document.getElementById("nome").value = userData.ia_nomeusuario || "";
      document.getElementById("sobrenome").value = userData.ia_sobrenome || "";
      document.getElementById("email").value = userData.ia_email || "";
      document.getElementById("telefone").value = userData?.ia_numero || "";
      document.getElementById("endereco").value = userData?.ia_endereco || "";
      document.getElementById("dataNasc").value =
        userData?.ia_datanascimento || "";
    }
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    Swal.fire({
      icon: "error",
      title: "Erro de conexão",
      text: "Erro ao carregar seus dados. Verifique a conexão.",
      confirmButtonColor: "#4a90e2",
    });
  }
});

document
  .getElementById("formConfiguracoes")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const updateData = {
      newName: document.getElementById("nome").value,
      newSobrenome: document.getElementById("sobrenome").value,
      newEmail: document.getElementById("email").value,
      newTel: document.getElementById("telefone").value,
      newAdress: document.getElementById("endereco").value,
      newDateNasc: document.getElementById("dataNasc").value,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/update/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Dados atualizados com sucesso!",
          confirmButtonColor: "#4a90e2",
        });
        // Update local storage name if changed
        if (updateData.newName) {
          localStorage.setItem("usuario", updateData.newName);
          if (usename) usename.innerHTML = updateData.newName;
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro ao atualizar",
          text: result.status || "Erro desconhecido",
          confirmButtonColor: "#4a90e2",
        });
      }
    } catch (error) {
      console.error("Erro na atualização:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao tentar salvar as alterações.",
        confirmButtonColor: "#4a90e2",
      });
    }
  });

document.getElementById("btnCollapse").addEventListener("click", function () {
  let icon = document.getElementById("arow");
  icon.innerHTML =
    icon.innerHTML === '<i class="bi bi-chevron-down"></i>'
      ? '<i class="bi bi-chevron-up"></i>'
      : '<i class="bi bi-chevron-down"></i>';
});

document.getElementById("mostrarSenha").addEventListener("click", function () {
  let senha = document.getElementById("senha");
  let senha2 = document.getElementById("passNow");
  let senha3 = document.getElementById("passConfirm");
  if (senha.type === "password") {
    senha.type = "text";
    senha2.type = "text";
    senha3.type = "text";
  } else {
    senha.type = "password";
    senha2.type = "password";
    senha3.type = "password";
  }
});

document
  .getElementById("alterarPass")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let form = new FormData(event.target);

    let senha = form.get("senha");
    let passNow = form.get("passNow");
    let passConfirm = form.get("passConfirm");
    let userId = localStorage.getItem("id");

    console.log(senha, passNow, passConfirm);

    if (passNow !== passConfirm) {
      let r = document.getElementById("res");
      r.innerHTML = "A nova senha não é igual a senha da confirmação!";
      r.classList.add("alert", "alert-danger");
      setTimeout(() => {
        r.innerHTML = "";
        r.classList.remove("alert", "alert-danger");
      }, 3000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/updatepassword/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
        body: JSON.stringify({
          senha,
          passNow,
          passConfirm,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: result.output,
          confirmButtonColor: "#4a90e2",
        });
        document.getElementById("alterarPass").reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro ao atualizar",
          text: result.status || "Erro desconhecido",
          confirmButtonColor: "#4a90e2",
        });
      }
    } catch (error) {
      console.error("Erro na atualização:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao tentar salvar as alterações.",
        confirmButtonColor: "#4a90e2",
      });
    }
  });
