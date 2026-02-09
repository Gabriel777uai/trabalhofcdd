let usename = document.getElementById("user");
let user = localStorage.getItem("usuario");
if (usename && user) {
  usename.innerHTML = user;
}

const userId = localStorage.getItem("id");
let API_BASE_URL;
if (window.location.hostname === "localhost" || window.location.hostname ===  "127.0.0.1") {
  console.log('Testes em Desenvolvimento');
  API_BASE_URL = "http://localhost:8000/api/v1";
} else {
  console.log('Rodando emProdução');
  API_BASE_URL = "https://trabalhofcdd-backend.onrender.com/api/v1";
}

document.addEventListener("DOMContentLoaded", async function () {
  if (!userId) {
    alert("Erro: Usuário não identificado. Faça login novamente.");
    window.location.href = "../index.html";
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
      document.getElementById("telefone").value = userData.ia_telefone || "";
      document.getElementById("endereco").value = userData.ia_endereco || "";
      document.getElementById("dataNasc").value =
        userData.ia_datanascimento || "";
    }
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    alert("Erro ao carregar seus dados. Verifique a conexão.");
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
        alert("Dados atualizados com sucesso!");
        // Update local storage name if changed
        if (updateData.newName) {
          localStorage.setItem("usuario", updateData.newName);
          if (usename) usename.innerHTML = updateData.newName;
        }
      } else {
        alert("Erro ao atualizar: " + (result.status || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro na atualização:", error);
      alert("Erro ao tentar salvar as alterações.");
    }
  });
