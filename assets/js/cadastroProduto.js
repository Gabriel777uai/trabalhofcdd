import { jwtDecode } from "jwt-decode";
const token = localStorage.getItem("acessToken");
const decodedToken = jwtDecode(token);
const userRole = parseInt(decodedToken.role) || 1;

if (userRole < 2) {
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

  const form = document.getElementById("formCadastroProduto");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      // Gather form data
      const produtoByInput = document.getElementById("produto");
      const descricaoByInput = document.getElementById("descricao");
      const quantidadeByInput = document.getElementById("quantidade"); // Estoque
      const grupoByInput = document.getElementById("grupo");
      const quantidadeIdealByInput = document.getElementById("quantidadeIdeal");
      const quantidadeMinByInput = document.getElementById("quantidadeMin");
      const quantidadeEmbalagemByInput = document.getElementById(
        "quantidadeEmbalagem",
      );
      const imgByInput = document.getElementById("img");
      const valorByInput = document.getElementById("valor");

      const data = {
        produto: produtoByInput.value,
        descricao: descricaoByInput.value,
        quantidade: parseInt(quantidadeByInput.value) || 0,
        grupo: grupoByInput.value,
        quantidadeIdeal: parseInt(quantidadeIdealByInput.value) || 0,
        quantidadeMin: parseInt(quantidadeMinByInput.value) || 0,
        quantidadeEmbalagem: parseInt(quantidadeEmbalagemByInput.value) || 0,
        img: imgByInput.value,
        valor: parseFloat(valorByInput.value) || 0,
      };

      try {
        const response = await fetch(`${url_base}api/v1/cadastro/produtos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Sucesso!",
            text: "Produto cadastrado com sucesso!",
            confirmButtonColor: "#4a90e2",
          });
          form.reset();
        } else {
          console.error("Erro na resposta:", result);
          Swal.fire({
            icon: "error",
            title: "Erro ao cadastrar",
            text: result.status || "Erro desconhecido",
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
