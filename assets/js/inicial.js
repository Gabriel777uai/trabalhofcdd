let usename = document.getElementById("user");
let user = localStorage.getItem("usuario");
usename.innerHTML = user;

let API_BASE_URL;
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  API_BASE_URL = "http://localhost/api/v1/";
} else {
  API_BASE_URL = "https://trabalhofcdd-backend.onrender.com/api/v1/";
}

if (!localStorage.getItem("count")) {
  localStorage.setItem("count", 0);
}

//<notifications>
async function updateListMessage() {
  const response = await fetch(`${API_BASE_URL}notifications/update/viewed`, {
    method: "put",
  });
}

setInterval(() => {
  renderMessages("all");
}, 36000);

async function renderMessages(list) {
  $("#list-notify").html("Carregando lista...");
  const response = await fetch(`${API_BASE_URL}notifications`, {
    method: "get",
  });
  const data = await response.json();

  let arr;
  let string_total;
  let html = [];

  switch (list) {
    case "all":
      string_total = `Total: ${data.output.quantidadeAll}`;
      arr = data.output.all;
      break;
    case "visualizates":
      string_total = `visualizadas: ${data.output.quantidadeVisualizados}`;
      arr = data.output.visualizados;
      break;
    case "opens":
      string_total = `vistas: ${data.output.quantidadeLidos}`;
      arr = data.output.lidos;
      break;
    case "notOpens":
      string_total = `Não lidas: ${data.output.quantidadeNaoLidos}`;
      arr = data.output.naoLidos;
      break;
  }

  if (data.output.qauntidadeNAoVisualizados > 0) {
    document
      .querySelector(".notification-message-count")
      .classList.add("active");
    $(".notification-message-count").html(
      data.output.qauntidadeNAoVisualizados,
    );
  } else {
    document
      .querySelector(".notification-message-count")
      .classList.remove("active");
    $(".notification-message-count").html("");
  }

  for (let i = 0; i < arr.length; i++) {
    let data = arr[i].d_notifi.split(" ")[0];
    let sliptData = data.split("-");
    let dataFormated = `${sliptData[2]}/${sliptData[1]}/${sliptData[0]}`;

    html.push(`
    <article class="card-message d-flex" onclick="openMessage(${arr[i].id})">
      <div class="fist-flex">
          <div>
            <img id="image_agent" src="${arr[i].agent_img}" width="65px" alt="logo_agent">
          </div>
          <div class="img-model">
            <p id="title">${arr[i].cabecalho}</p>
            <p class="model">Agent ${arr[i].agent}</p>
          </div>
      </div>                       
      <div class="d-flex data">
        <p>${dataFormated}</p>
        <p> ${arr[i].type_notifi} </p>
        <span id="icon_open"> ${arr[i].lida ? '<i class="bi bi-envelope-open"></i>' : '<i class="bi bi-envelope"></i>'} </span>
      </div>     
    </article>
    `);
  }

  $("#total_messages").html("");
  $("#total_messages").html(string_total);
  $("#list-notify").html("");
  $("#list-notify").append(html);
}
//defaltValue
renderMessages("all");

async function message(param) {
  let listButton = document.querySelectorAll(".nav-link");
  for (let i = 0; i < listButton.length; i++)
    listButton[i].classList.remove("active");
  document.getElementById(param).classList.add("active");

  return await renderMessages(param);
}

let modal = document.querySelector(".modal-message");

function closeModalMessage() {
  modal.classList.remove("active");
  renderMessages("all");
}

let text_area = document.getElementById("message-text");
let title = document.getElementById("exampleModalLabel-message");
let agent_name = document.getElementById("recipient-name");

async function openMessage(param) {
  modal.classList.add("active");
  console.log(param);
  const response = await fetch(`${API_BASE_URL}notifications/${param}`, {
    method: "get",
  });
  const response_update = await fetch(
    `${API_BASE_URL}notifications/update/read/${param}`,
    {
      method: "put",
    },
  );
  const data = await response.json();
  let result_message = data.output.result;

  text_area.textContent = result_message.message;
  title.textContent = result_message.cabecalho;
  agent_name.textContent = result_message.agent;
}

if (localStorage.getItem("count") == 0) {
  let div = document.createElement("div");
  div.innerHTML = "<strong>Seja Bem vindo(a)!</strong>";
  div.classList.add("messageInitial");
  div.style.position = "fixed";
  div.style.left = "45%";
  div.style.top = "190%";
  div.style.background = "#0087bdee";
  div.style.color = "#ffffffff";
  div.style.padding = "4px";
  div.style.boxShadow = "2px 1px 10px #696969b9";
  div.style.borderRadius = "4px";
  document.body.append(div);
  console.log("estou na condição!");

  setTimeout(() => {
    div.style.transition = "1s";
    div.style.top = "90%";
  }, 100);
  setTimeout(() => {
    div.style.transition = "2s";
    div.style.top = "190%";
  }, 4000);
  if (document.querySelector(".messageInitial")) {
    localStorage.setItem("count", 1);
  }
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
    filteredProducts = [...allProducts.result];
    currentPage = 1;

    function showValueAllItensAndQuantity() {
      console.log(allProducts.result);
      const valueAll = allProducts.result.reduce((tot, item) => {
        allValue = tot + item.ia_valor * item.ia_quantidadeproduto;
        return allValue;
      }, 0);
      const ValueFormatBRL = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        useGrouping: true,
      }).format(valueAll);
      return ValueFormatBRL;
    }
    const valorTotalDeTodosItens = showValueAllItensAndQuantity();

    console.log(valorTotalDeTodosItens);
    renderPage();
  } catch (error) {
    Swal.fire({
      title: "Acesso Expirado!",
      text: "Acesso expirado ou teve algum erro no servidor... Entre em contato com um desenvolvedor ou faça login novamente!",
      icon: "error",
      confirmButtonColor: "#3085d6", // Cor do botão de confirmar
      confirmButtonText: "Fazer login novamente!", // Texto do botão
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.href = "../index.html";
      }
    });

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
      <div class="card h-100 widgets" style="cursor: pointer;" onclick="visualizarProduto('${produto.ia_idproduto}')">
        <span class="badge ${classBadge}">${message}</span>
        <img src="${produto.ia_imagenslink || "https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-103.png?ssl=1"}" 
             class="card-img-top" alt="${produto.ia_nomeproduto}" class="loader" onload="this.classList.remove('loader')">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${produto.ia_nomeproduto}</h5>
          <p class="card-text truncate">${produto.ia_descricaoproduto || "Descrição não atribuida"}</p>
          <p class="card-text">Codigo: ${produto.ia_codigoproduto || ""}</p>
          <p class="mt-auto"><small>Estoque: <strong>${produto.ia_quantidadeproduto ?? 0}</strong></small></p>
        </div>
        <div class="card-footer d-flex gap-2">
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
  filteredProducts = allProducts.result.filter(
    (p) =>
      (p.ia_nomeproduto &&
        p.ia_nomeproduto.toLowerCase().includes(searchTerm)) ||
      (p.ia_codigoproduto &&
        String(p.ia_codigoproduto).toLowerCase().includes(searchTerm)),
  );
  currentPage = 1;
  renderPage();
});

getDataApi(`${API_BASE_URL}products`);

// Global functions for inline onclick calls
window.visualizarProduto = async function (id) {
  document.querySelector(".overlay-carregamento").classList.add("active");

  if (!window.bootstrap) {
    console.error("Bootstrap não foi carregado corretamente.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}productsforid/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });
    const data = await response.json();

    console.log(data);

    const produto = data;

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
    const response = await fetch(`${API_BASE_URL}productsforid/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });
    const data = await response.json();

    const produto = data;

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
    const response = await fetch(`${API_BASE_URL}update/produto/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
      body: JSON.stringify(dados),
    });

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
      getDataApi(`${API_BASE_URL}products`);
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
      const response = await fetch(`${API_BASE_URL}delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Excluído!",
          text: "Produto excluído com sucesso!",
          confirmButtonColor: "#4a90e2",
        });
        getDataApi(`${API_BASE_URL}products`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: json.output,
          confirmButtonColor: "#4a90e2",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro de servidor!",
        confirmButtonColor: "#4a90e2",
      });
    }
  }
};
