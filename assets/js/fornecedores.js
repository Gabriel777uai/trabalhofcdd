document.addEventListener("DOMContentLoaded", () => {
  let user = localStorage.getItem("usuario");
  if (document.getElementById("user")) {
    document.getElementById("user").innerHTML = user;
  }

  // Initialize Suppliers Page
  carregarFornecedores();
});

let API_BASE_URL;
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  API_BASE_URL = "http://localhost:8000/api/v1/";
} else {
  API_BASE_URL = "https://trabalhofcdd-backend.onrender.com/api/v1/";
}

async function carregarFornecedores() {
  document.querySelector(".overlay-carregamento").classList.add("active");
  try {
    const tbody = document.getElementById("listaFornecedores");

    const response = await fetch(
      `${API_BASE_URL}fornecedores/${localStorage.getItem("id")}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
      },
    );

    const data = await response.json();

    console.log(data);
    let list = [];
    data.forEach((itens) => {
      list.push(
        `<tr>
          <th scope="row">${itens.cd_fornecedor}</th>
          <td>${itens.cpf || itens.cnpj}</td>
          <td>${itens.fantasia}</td>
          <td>
            <button class="btn btn-warning p-1">
              <i style="font-size: 10px;" class="bi bi-pencil"></i>
            </button>
            <button onclick="excluir(${itens.cd_fornecedor})" class="btn btn-danger p-1 ms-1">
              <i style="font-size: 10px;" class="bi bi-trash"></i>
            </button>
          </td>
        </tr>`,
      );
    });

    tbody.innerHTML = list.join("");
  } catch (error) {
    console.error("Erro ao carregar fornecedores:", error);
  } finally {
    document.querySelector(".overlay-carregamento").classList.remove("active");
  }
}

document
  .getElementById("formFornecedor")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    try {
      let payload = {
        fantasia: document.getElementById("fantasia").value,
        cpf: document.getElementById("cpf").value || "",
        cnpj: document.getElementById("cnpj").value || "",
        name: document.getElementById("name").value,
        cd_cadastrante: localStorage.getItem("id"),
      };

      console.log(payload);
      const reponse = await fetch(`${API_BASE_URL}fornecedores/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await reponse.json();

      if (data.response == true) {
        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: data.output,
          confirmButtonColor: "#4a90e2",
        });
        this.reset();
        bootstrap.Modal.getInstance(
          document.getElementById("modalCadastroFornecedor"),
        ).hide();

        carregarFornecedores();
      }
    } catch (err) {
      console.error("Falha ao cadastar o fornecedor: " + err);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao cadastrar fornecedor.",
        confirmButtonColor: "#4a90e2",
      });
    }
  });

async function excluir(id) {
  const result = await Swal.fire({
    title: "Tem certeza?",
    text: "Deseja realmente excluir o cadastro desse fornecedor?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, excluir!",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const reponse = await fetch(`${API_BASE_URL}fornecedores/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
      });

      const data = await reponse.json();

      if (data.response) {
        Swal.fire({
          title: "Operaçaõ finalizada!",
          text: "O cadastro do fornecedor foi excluido com sucesso!",
          icon: "success",
          confirmButtonText: "ok",
        });

        carregarFornecedores();
      }
    } catch (err) {
      Swal.fire({
          title: "Falha ao finalizar a operação!",
          text: "Ouve algum problema ao excluir dados, favor entrar em contato com o desenvolvedor!",
          icon: "error",
          confirmButtonText: "ok",
        });
    }
  }
}
