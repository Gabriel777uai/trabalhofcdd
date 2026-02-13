import { jwtDecode } from "jwt-decode";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("acessToken");
  if (!token) return;

  try {
    ;

    const menuItems = document.querySelectorAll(
      "#menuLateral .menu-opcoes li[data-role]",
    );
    if (parseInt(jwtDecode(token).role) < document.getElementById("menuLateral").getAttribute("data-role")) {
      document.body.innerHTML = "";
    }
    menuItems.forEach((item) => {
      const requiredRole = parseInt(item.getAttribute("data-role"));
      if (parseInt(jwtDecode(token).role) < requiredRole) {
        item.remove();
      }
    });

    if (userRole === 5) {
      document.getElementById("menuLateral").classList.add("admin");
    }
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
  }
});
