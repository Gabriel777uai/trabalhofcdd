import { jwtDecode } from "jwt-decode";
const token = localStorage.getItem("acessToken");
const decodedToken = jwtDecode(token);
const userRole = parseInt(decodedToken.role) || 1;

if (userRole < 5) {
  document.getElementById("conteudo").innerHTML = "<h1 id='msg'>Você não tem permissão para acessar esta página!<br><span>consulte um administrador para mais informações.<br> <a href='inicial.html'>Voltar para a página inicial</a></span></h1>";
  throw new Error("Sem permissão para acessar esta página!");
}
let url_base;

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("Testes em Desenvolvimento");
  url_base = "http://localhost:8000/";
} else {
  console.log("Rodando em Produção");
  url_base = "https://trabalhofcdd-backend.onrender.com/";
}

document.addEventListener("DOMContentLoaded", () => {
  let usename = document.getElementById("user");
  let user = localStorage.getItem("usuario");
  if (usename && user) {
    usename.innerHTML = user;
  }

  const form = document.getElementById("formCadastroUsuario");

  // Auto-fill cargo based on group
  const grupoSelect = document.getElementById("grupoAcesso");
  const cargoInput = document.getElementById("cargo");

  if (grupoSelect && cargoInput) {
    grupoSelect.addEventListener("change", function () {
      const grupo = this.value;
      let cargo = "";
      switch (grupo) {
        case "0":
          cargo = "Vendedor";
          break;
        case "1":
          cargo = "Funcinario normal";
          break;
        case "2":
          cargo = "Encarregado";
          break;
        case "3":
          cargo = "Gerente de Estoque";
          break;
        case "5":
          cargo = "Adiministrador T.I";
          break;
        default:
          cargo = "";
      }

      cargoInput.value = cargo;
    });
  }

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
        document
        .querySelector(".overlay-carregamento")
        .classList.add("active");
      // Gather form data
      const name = document.getElementById("name").value;
      const sobrenome = document.getElementById("sobrenome").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      const dataNasc = document.getElementById("dataNasc").value;
      let grupoAcesso = document.getElementById("grupoAcesso").value;
      let cargo = document.getElementById("cargo").value;
      const adress = document.getElementById("adress").value;
      const numero = document.getElementById("numero").value;
      let role = "user";
      if (grupoAcesso == 0) {
        role = "vendedor";
        cargo = "Vendedor";
        grupoAcesso = 3;
      }
      if (grupoAcesso == 5) {
        role = "adimin";
        grupoAcesso = 5;
      }

      // Construct payload matching PHP expectation
      const data = {
        name: name,
        sobrenome: sobrenome,
        email: email,
        senha: senha,
        dataNasc: dataNasc,
        grupoAcesso: grupoAcesso,
        cargo: cargo,
        adress: adress,
        numero: numero,
        role: role
      };
      const dataEmail = {
        emailuser: data.email,
        senha: data.senha,
        login: data.name,
        nameUser: data.name,
      }
      if (role == "user") {
        const sendEmail = await fetch('https://n8n-3dg1.onrender.com/webhook/605cfe06-1915-4739-b60c-d43b776dc2b5', {
          method: 'POST',
          body: JSON.stringify(dataEmail)
        });
      }
      if (role == "vendedor") {
        const sendEmail = await fetch('https://n8n-3dg1.onrender.com/webhook/605cfe06-1915-4739-b60c-d43b776dc2b6', {
          method: 'POST',
          body: JSON.stringify(dataEmail)
        });
      }

      try {
        const response = await fetch(`${url_base}api/v1/cadastro/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.response) {
        document.querySelector(".overlay-carregamento").classList.remove("active");
          Swal.fire({
            icon: "success",
            title: "Sucesso!",
            text: "Usuário cadastrado com sucesso!",
            confirmButtonColor: "#4a90e2",
          });
          form.reset();
        } else {
          console.error("Erro na resposta:", result);
          Swal.fire({
            icon: "error",
            title: "Erro ao cadastrar",
            text: result.output || "Erro desconhecido",
            confirmButtonColor: "#4a90e2",
          });
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        Swal.fire({
          icon: "error",
          title: "Erro de comunicação",
          text: "Erro na comunicação com o servidor. Verifique o console para mais detalhes.",
          confirmButtonColor: "#4a90e2",
        });
      }
    });
  }
});
