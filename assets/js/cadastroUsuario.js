let url_base;
if (window.location.hostname === "localhost"  || "127.0.0.1") {
  console.log('Testes em Desenvolvimento');
  url_base = "http://localhost:8000/";
} else {
  console.log('Rodando emProdução');
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

      // Gather form data
      const name = document.getElementById("name").value;
      const sobrenome = document.getElementById("sobrenome").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      const dataNasc = document.getElementById("dataNasc").value;
      const grupoAcesso = document.getElementById("grupoAcesso").value;
      const cargo = document.getElementById("cargo").value;
      const adress = document.getElementById("adress").value;
      const numero = document.getElementById("numero").value;

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
      };

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
          alert("Usuário cadastrado com sucesso!");
          form.reset();
        } else {
          console.error("Erro na resposta:", result);
          alert("Erro ao cadastrar: " + (result.output || "Erro desconhecido"));
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert(
          "Erro na comunicação com o servidor. Verifique o console para mais detalhes.",
        );
      }
    });
  }
});
