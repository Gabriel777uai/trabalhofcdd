import { jwtDecode } from "jwt-decode";
const token = localStorage.getItem("acessToken");
const decodedToken = jwtDecode(token);
const userRole = parseInt(decodedToken.role) || 1;

if (userRole < 3) {
  document.getElementById("conteudo").innerHTML = "<h1 id='msg'>Você não tem permissão para acessar esta página!<br><span>consulte um administrador para mais informações.<br> <a href='inicial.html'>Voltar para a página inicial</a></span></h1>";
  throw new Error("Sem permissão para acessar esta página!");
}