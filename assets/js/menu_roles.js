import { jwtDecode } from "jwt-decode";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("acessToken");
  const role = localStorage.getItem("role");
  if (!token) return;

  try {
    const menuItems = document.querySelectorAll(
      "#menuLateral .menu-opcoes li[data-role]",
    );
    if (
      parseInt(jwtDecode(token).role) <
      document.getElementById("menuLateral").getAttribute("data-role")
    ) {
      document.body.innerHTML = "";
    }
    if (role == "vendedor") {
      menuItems[0].remove();
      menuItems[1].remove();
      menuItems[2].remove();
      menuItems[5].remove();
    }

    if (role === "adimin") {
      document.getElementById("menuLateral").classList.add("admin");
    }

    if (role === "user") {
      menuItems.forEach((item) => {
        const requiredRole = parseInt(item.getAttribute("data-role"));
        if (parseInt(jwtDecode(token).role) < requiredRole) {
          item.remove();
        }
      });
    }
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
  }
});
