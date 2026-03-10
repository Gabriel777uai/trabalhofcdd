document.addEventListener("DOMContentLoaded", () => {
  let user = localStorage.getItem("usuario");
  if (document.getElementById("user")) {
    document.getElementById("user").innerHTML = user;
  }
});
