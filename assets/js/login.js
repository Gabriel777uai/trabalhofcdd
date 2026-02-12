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
      let redirect_recuperacao = document.createElement("a");
      redirect_recuperacao.href = "recuperation.html";
      redirect_recuperacao.textContent = "Esqueci minha senha";
      redirect_recuperacao.classList.add("mt-3");
      formLogin.appendChild(redirect_recuperacao);

      document.querySelector("button[type='submit']").disabled = false;

      localStorage.setItem("userErrorPassword", formData.get("login"));
      
      Swal.fire({
        icon: "error",
        title: "Erro ao fazer login",
        text: data.status,
        confirmButtonColor: "#4a90e2",
      });

    }
  } catch (error) {
    console.error("Erro:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Credenciais inválidas",
      confirmButtonColor: "#4a90e2",
    });
  }
});
