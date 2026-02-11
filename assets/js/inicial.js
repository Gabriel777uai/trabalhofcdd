let usename = document.getElementById("user");
let user = localStorage.getItem("usuario");
usename.innerHTML = user;

let API_BASE_URL;
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("Testes em Desenvolvimento");
  console.log(window.location.hostname);
  API_BASE_URL = "http://localhost:8000/api/v1/products";
} else {
  console.log("Rodando em Produção");
  API_BASE_URL = "https://trabalhofcdd-backend.onrender.com/api/v1/products";
}
async function getDataApi(url) {
  const request = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
    },
  });
  const data = await request.json();

  let list = $("#listaProdutos");
  list.html("");
  for (let i = 0; i < data.length; i++) {
    list.append(`
    <div class="card h-100">
    <img src="${
      data[i].ia_imagenslink ||
      "https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-103.png?ssl=1"
    }" class="card-img-top" alt="${data[i].ia_nomeproduto}">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${data[i].ia_nomeproduto}</h5>
      <p class="card-text truncate">${data[i].ia_descricaoproduto || ""}</p>
      <p class="mt-auto"><small>Estoque: <strong>${
        data[i].ia_quantidadeproduto ?? 0
      }</strong></small></p>
      </div>
      <div class="card-footer d-flex gap-2">
      <button class="btn btn-sm btn-primary" onclick="visualizarProduto('${data[i].ia_idproduto}')">Visualizar</button>
      <button class="btn btn-sm btn-warning" onclick="editarProduto('${data[i].ia_idproduto}')">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="excluirProduto('${data[i].ia_idproduto}')">Excluir</button>
      </div>
    </div>
    `);
  }
}
getDataApi(API_BASE_URL);

let search = document.getElementById("pesquisaProduto");
search.addEventListener("keyup", () => {
  let list = $("#listaProdutos");

  list.html("Pesquisando...");
});
search.addEventListener("keyup", async () => {
  let list = $("#listaProdutos");
  if (search.value.length > 0) {
    let pesquisaFeita = `${API_BASE_URL}/${search.value}`;
    const request = await fetch(pesquisaFeita, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });
    const data = await request.json();

    list.html("");
    for (let i = 0; i < data.length; i++) {
      list.append(`
    <div class="card h-100">
    <img src="${
      data[i].ia_imagenslink ||
      "https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-103.png?ssl=1"
    }" class="card-img-top" alt="${data[i].ia_nomeproduto}">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${data[i].ia_nomeproduto}</h5>
      <p class="card-text truncate">${data[i].ia_descricaoproduto || ""}</p>
      <p class="mt-auto"><small>Estoque: <strong>${
        data[i].ia_quantidadeproduto ?? 0
      }</strong></small></p>
      </div>
      <div class="card-footer d-flex gap-2">
      <button class="btn btn-sm btn-primary" onclick="visualizarProduto('${data[i].ia_idproduto}')">Visualizar</button>
      <button class="btn btn-sm btn-warning" onclick="editarProduto('${data[i].ia_idproduto}')">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="excluirProduto('${data[i].ia_idproduto}')">Excluir</button>
      </div>
    </div>
    `);
    }
  } else {
    let pesquisaFeita = `${API_BASE_URL}`;
    const request = await fetch(pesquisaFeita, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });
    const data = await request.json();

    list.html("");
    for (let i = 0; i < data.length; i++) {
      list.append(`
    <div class="card h-100">
    <img src="${
      data[i].ia_imagenslink ||
      "https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-103.png?ssl=1"
    }" class="card-img-top" alt="${data[i].ia_nomeproduto}">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${data[i].ia_nomeproduto}</h5>
      <p class="card-text truncate">${data[i].ia_descricaoproduto || ""}</p>
      <p class="mt-auto"><small>Estoque: <strong>${
        data[i].ia_quantidadeproduto ?? 0
      }</strong></small></p>
      </div>
      <div class="card-footer d-flex gap-2">
      <button class="btn btn-sm btn-primary btn-visualizar" onclick="visualizarProduto('${data[i].ia_idproduto}')">Visualizar</button>
      <button class="btn btn-sm btn-warning btn-editar" onclick="editarProduto('${data[i].ia_idproduto}')">Editar</button>
      <button class="btn btn-sm btn-danger btn-excluir" onclick="excluirProduto('${data[i].ia_idproduto}')">Excluir</button>
      </div>
    </div>
    `);
    }
  }
});

// Global functions for inline onclick calls
window.visualizarProduto = async function (id) {
  if (!window.bootstrap) {
    console.error("Bootstrap não foi carregado corretamente.");
    return;
  }

  try {
    const response = await fetch(
      `https://trabalhofcdd-backend.onrender.com/api/v1/productsforid/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
      },
    );
    const data = await response.json();

    const produto = data[0];

    if (produto) {
      document.getElementById("viewImg").src =
        produto.ia_imagenslink ||
        "https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-103.png?ssl=1";
      document.getElementById("viewNome").textContent = produto.ia_nomeproduto;
      document.getElementById("viewCodigo").textContent =
        produto.ia_codigoproduto;
      document.getElementById("viewGrupo").textContent =
        produto.ia_grupoproduto;
      document.getElementById("viewDescricao").textContent =
        produto.ia_descricaoproduto;
      document.getElementById("viewPreco").textContent =
        "R$ " + (parseFloat(produto.ia_valor) || 0).toFixed(2);
      document.getElementById("viewEstoque").textContent =
        produto.ia_quantidadeproduto;
      document.getElementById("viewMin").textContent = produto.ia_quantidademin;
      document.getElementById("viewIdeal").textContent =
        produto.ia_quantidadeideal;
      document.getElementById("viewEmbalagem").textContent =
        produto.ia_quantidadeembalagem;
      document.getElementById("viewCadastro").textContent =
        produto.ia_cadastroproduto;

      const modal = new window.bootstrap.Modal(
        document.getElementById("modalVisualizarProduto"),
      );
      modal.show();
    }
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
  }
};

window.editarProduto = async function (id) {
  if (!window.bootstrap) {
    console.error("Bootstrap não foi carregado corretamente.");
    return;
  }

  try {
    const response = await fetch(
      `https://trabalhofcdd-backend.onrender.com/api/v1/productsforid/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
      },
    );
    const data = await response.json();

    const produto = data[0];

    if (produto) {
      document.getElementById("editId").value = produto.ia_idproduto;
      document.getElementById("editNome").value = produto.ia_nomeproduto;
      document.getElementById("editCodigo").value = produto.ia_codigoproduto;
      document.getElementById("editDescricao").value =
        produto.ia_descricaoproduto;

      const editGrupo = document.getElementById("editGrupo");
      if (editGrupo) editGrupo.value = produto.ia_grupoproduto;

      document.getElementById("editPreco").value = produto.ia_valor;
      document.getElementById("editEstoque").value =
        produto.ia_quantidadeproduto;
      document.getElementById("editMin").value = produto.ia_quantidademin;
      document.getElementById("editIdeal").value = produto.ia_quantidadeideal;
      document.getElementById("editEmbalagem").value =
        produto.ia_quantidadeembalagem;
      document.getElementById("editImg").value = produto.ia_imagenslink;

      const modal = new window.bootstrap.Modal(
        document.getElementById("modalEditarProduto"),
      );
      modal.show();
    }
  } catch (error) {
    console.error("Erro ao buscar produto para edição:", error);
  }
};

window.salvarProduto = async function () {
  const id = document.getElementById("editId").value;
  if (!id) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro: ID do produto não encontrado.",
      confirmButtonColor: "#4a90e2",
    });
    return;
  }

  const dados = {
    newName: document.getElementById("editNome").value,
    newDescricao: document.getElementById("editDescricao").value,
    newQuantIdeal: document.getElementById("editIdeal").value,
    newValor: document.getElementById("editPreco").value,
    newImage: document.getElementById("editImg").value,
    newGrupo: document.getElementById("editGrupo").value,
  };

  try {
    const response = await fetch(
      `https://trabalhofcdd-backend.onrender.com/api/v1/update/produto/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
        body: JSON.stringify(dados),
      },
    );

    const result = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Produto atualizado com sucesso!",
        confirmButtonColor: "#4a90e2",
      });
      // Fechar modal
      const modalElement = document.getElementById("modalEditarProduto");
      const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      // Recarregar lista
      getDataApi(API_BASE_URL);
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro ao atualizar",
        text: result.status || "Erro desconhecido",
        confirmButtonColor: "#4a90e2",
      });
    }
  } catch (error) {
    console.error("Erro na requisição de atualização:", error);
    Swal.fire({
      icon: "error",
      title: "Erro de conexão",
      text: "Erro de conexão ao tentar atualizar o produto.",
      confirmButtonColor: "#4a90e2",
    });
  }
};

window.excluirProduto = async function (id) {
  const result = await Swal.fire({
    title: "Tem certeza?",
    text: "Deseja realmente excluir este produto?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, excluir!",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(
        `https://trabalhofcdd-backend.onrender.com/api/v1/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
          },
        },
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Excluído!",
          text: "Produto excluído com sucesso!",
          confirmButtonColor: "#4a90e2",
        });
        getDataApi(API_BASE_URL);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao excluir produto.",
          confirmButtonColor: "#4a90e2",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao tentar excluir o produto.",
        confirmButtonColor: "#4a90e2",
      });
    }
  }
};
