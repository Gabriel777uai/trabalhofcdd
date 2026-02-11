import { jwtDecode } from "jwt-decode";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("acessToken");
  if (!token) return;

  try {
    const decodedToken = jwtDecode(token);
    const userRole = parseInt(decodedToken.role) || 1;

    const menuItems = document.querySelectorAll(
      "#menuLateral .menu-opcoes li[data-role]",
    );
    if (userRole < document.getElementById("menuLateral").getAttribute("data-role")) {
      document.body.innerHTML = "";
    }
    menuItems.forEach((item) => {
      const requiredRole = parseInt(item.getAttribute("data-role"));
      if (userRole < requiredRole) {
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
