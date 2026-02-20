let usename = document.getElementById("user");
let user = localStorage.getItem("usuario");
usename.innerHTML = user;

let API_BASE_URL;
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  API_BASE_URL = "http://localhost:8000/api/v1/products";
} else {
  API_BASE_URL = "https://trabalhofcdd-backend.onrender.com/api/v1/products";
}

// Global State
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 10;

async function getDataApi(url) {
  document.querySelector(".overlay-carregamento").classList.add("active");
  try {
    const request = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });
    allProducts = await request.json();
    filteredProducts = [...allProducts];
    currentPage = 1;
    renderPage();
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  } finally {
    document.querySelector(".overlay-carregamento").classList.remove("active");
  }
}

function renderPage() {
  const list = $("#listaProdutos");
  list.html("");

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

  if (productsToShow.length === 0) {
    list.html("<p class='text-center w-100'>Nenhum produto encontrado.</p>");
    renderPagination(0);
    return;
  }

  productsToShow.forEach((produto) => {
    let media = produto.ia_quantidadeproduto;
    let estoque = produto.ia_quantidadeideal;
    let message = "Estoque Normal!";
    let classBadge = "bg-success";

    if (media == 0) {
      message = "Estoque zerado!";
      classBadge = "bg-dark";
    } else if (media < estoque / 2) {
      message = "Estoque baixo!";
      classBadge = "bg-warning";
    } else if (media < estoque) {
      message = "Estoque muito baixo!";
      classBadge = "bg-danger";
    }

    list.append(`
      <div class="card h-100">
        <span class="badge ${classBadge}">${message}</span>
        <img src="${produto.ia_imagenslink || "https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-103.png?ssl=1"}" 
             class="card-img-top" alt="${produto.ia_nomeproduto}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${produto.ia_nomeproduto}</h5>
          <p class="card-text truncate">${produto.ia_descricaoproduto || ""}</p>
          <p class="mt-auto"><small>Estoque: <strong>${produto.ia_quantidadeproduto ?? 0}</strong></small></p>
        </div>
        <div class="card-footer d-flex gap-2">
          <button class="btn btn-sm btn-primary" onclick="visualizarProduto('${produto.ia_idproduto}')">Visualizar</button>
          <button class="btn btn-sm btn-warning" onclick="editarProduto('${produto.ia_idproduto}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="excluirProduto('${produto.ia_idproduto}')">Excluir</button>
        </div>
      </div>
    `);
  });

  renderPagination(filteredProducts.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = $("#paginacao");
  paginationContainer.html("");

  if (totalPages <= 1) return;

  const maxVisiblePages = 5; // Number of page buttons to show around current page
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // First Page Button
  if (startPage > 1) {
    paginationContainer.append(`
      <li class="page-item">
        <a class="page-link" href="#" onclick="changePage(1)">1</a>
      </li>
    `);
    if (startPage > 2) {
      paginationContainer.append(
        `<li class="page-item disabled"><span class="page-link">...</span></li>`,
      );
    }
  }

  // Previous Button (Icon)
  paginationContainer.append(`
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1})" aria-label="Anterior">
        <i class="bi bi-chevron-left"></i>
      </a>
    </li>
  `);

  // Page Numbers
  for (let i = startPage; i <= endPage; i++) {
    paginationContainer.append(`
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
      </li>
    `);
  }

  // Next Button (Icon)
  paginationContainer.append(`
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage + 1})" aria-label="Próximo">
        <i class="bi bi-chevron-right"></i>
      </a>
    </li>
  `);

  // Last Page Button
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationContainer.append(
        `<li class="page-item disabled"><span class="page-link">...</span></li>`,
      );
    }
    paginationContainer.append(`
      <li class="page-item">
        <a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a>
      </li>
    `);
  }
}

window.changePage = function (page) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Listeners
document.getElementById("itemsPerPage").addEventListener("change", (e) => {
  itemsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderPage();
});

document.getElementById("pesquisaProduto").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  filteredProducts = allProducts.filter(
    (p) =>
      (p.ia_nomeproduto &&
        p.ia_nomeproduto.toLowerCase().includes(searchTerm)) ||
      (p.ia_codigoproduto &&
        String(p.ia_codigoproduto).toLowerCase().includes(searchTerm)),
  );
  currentPage = 1;
  renderPage();
});

getDataApi(API_BASE_URL);

// Global functions for inline onclick calls
window.visualizarProduto = async function (id) {
  document.querySelector(".overlay-carregamento").classList.add("active");

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
      document
        .querySelector(".overlay-carregamento")
        .classList.remove("active");
      modal.show();
    }
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
  }
};

window.editarProduto = async function (id) {
  document.querySelector(".overlay-carregamento").classList.add("active");
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
      document
        .querySelector(".overlay-carregamento")
        .classList.remove("active");
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
