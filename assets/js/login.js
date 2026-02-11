(function () {
  "use strict";
  const mostrarSenha = document.getElementById("mostrarSenha");
  const campoSenha = document.getElementById("senha");

  // Mostrar/Esconder senha
  mostrarSenha.addEventListener("change", function () {
    campoSenha.type = this.checked ? "text" : "password";
  });
})();

let formLogin = document.getElementById("form-login");
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
formLogin.addEventListener("submit", async function (event) {
  event.preventDefault();

  let formData = new FormData(formLogin);

  try {
    let response = await fetch(`${url_base}api/v1/login`, {
      method: "POST",
      body: formData,
    });

    let data = await response.json();
    if (data.response) {
      localStorage.setItem("acessToken", data.refreshToken);
      localStorage.setItem("id", data.id);
      localStorage.setItem("usuario", data.userName);
      if (localStorage.getItem("acessToken")) {
        window.location.href = "pages/inicial.html";
      }
    } else {
      let alertDiv = document.createElement("div");
      alertDiv.classList.add("alert", "alert-danger", "mt-3");
      alertDiv.textContent = data.status;
      formLogin.appendChild(alertDiv);
      document.querySelector("button[type='submit']").disabled = false;
      carregando.classList.add("d-none");
      textoBotao.textContent = "Entrar";
    }
  } catch (error) {
    console.error("Erro:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Ocorreu um erro. Por favor, tente novamente.",
      confirmButtonColor: "#4a90e2",
    });
  }
});
