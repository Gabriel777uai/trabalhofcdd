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
    // This is a placeholder until the actual API endpoint is ready
    // For now, let's just show an empty list or mock data
    const tbody = document.getElementById("listaFornecedores");
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center">Nenhum fornecedor encontrado (Simulação).</td></tr>';
  } catch (error) {
    console.error("Erro ao carregar fornecedores:", error);
  } finally {
    document.querySelector(".overlay-carregamento").classList.remove("active");
  }
}

window.salvarFornecedor = async function () {
  const nome = document.getElementById("nomeFornecedor").value;
  const doc = document.getElementById("documentoFornecedor").value;

  if (!nome || !doc) {
    Swal.fire("Erro", "Nome e Documento são obrigatórios.", "error");
    return;
  }

  Swal.fire(
    "Sucesso",
    "Fornecedor cadastrado com sucesso (Simulação)!",
    "success",
  );
  bootstrap.Modal.getInstance(
    document.getElementById("modalCadastroFornecedor"),
  ).hide();
};
