document.addEventListener("DOMContentLoaded", () => {
  let user = localStorage.getItem("usuario");
  if (document.getElementById("user")) {
    document.getElementById("user").innerHTML = user;
  }

  document.getElementById("dataCompra").valueAsDate = new Date();
});

window.adicionarItem = function () {
  const produto = document.getElementById("idProduto").value;
  const qtd = document.getElementById("qtdCompra").value;

  if (!produto || !qtd) {
    Swal.fire("Ops", "Selecione o produto e a quantidade.", "info");
    return;
  }

  const tbody = document.getElementById("itensCompra");
  const row = `<tr><td>${produto}</td><td>${qtd}</td><td><button class="btn btn-sm btn-danger" onclick="this.closest('tr').remove()"><i class="bi bi-trash"></i></button></td></tr>`;
  tbody.insertAdjacentHTML("beforeend", row);
};

window.finalizarCompra = function () {
  Swal.fire("Sucesso", "Compra registrada com sucesso (Simulação)!", "success");
};
