import { jwtDecode } from "jwt-decode";
const token = localStorage.getItem("acessToken");
const decodedToken = jwtDecode(token);
const userRole = parseInt(decodedToken.role) || 1;

if (userRole < 1) {
  document.getElementById("conteudo").innerHTML = "<h1 id='msg'>Você não tem permissão para acessar esta página!<br><span>consulte um administrador para mais informações.<br> <a href='inicial.html'>Voltar para a página inicial</a></span></h1>";
  throw new Error("Sem permissão para acessar esta página!");
}
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

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("user").textContent = localStorage.getItem("usuario");
});

async function listClientsSelect(id) {
  try {
    const response = await fetch(`${url_base}api/v1/getclientsforuser/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar clientes: ${response.status}`);
    }

    const data = await response.json();
    const select = document.getElementById("selectCliente");

    select.innerHTML = '<option value="">Selecione um cliente...</option>';

    data.forEach((client) => {
      const option = document.createElement("option");
      option.value = client.cod_cliente;
      option.textContent = client.nome_cliente;
      select.appendChild(option);
    });

    if (window.TomSelect) {
      new TomSelect("#selectCliente", {
        create: false,
        sortField: {
          field: "text",
          direction: "asc",
        },
        placeholder: "Pesquise por um cliente...",
        noResultsText: "Nenhum cliente encontrado",
      });
    }
  } catch (error) {
    console.error("Falha ao carregar clientes:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("id");
  if (userId) {
    listClientsSelect(userId);
  }
});

document.getElementById("formVenda").addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    let form = document.getElementById("formVenda");
    const formData = new FormData(form);
    const response = await fetch(`${url_base}api/v1/criarpedidovenda`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
      body: JSON.stringify({
        codigo_cliente: formData.get("codigo_cliente"),
        codigo_usuario: localStorage.getItem("id"),
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao gerar pedido: ${response.status}`);
    }

    const data = await response.json();

    document.getElementById("codigoCompra").value = data.numero_pedido;

    document.getElementById("btnFinalizarVenda").disabled = true;
    document
      .getElementById("selectCliente")
      .setAttribute("disabled", "disabled");
    document.getElementById("sectionBuscaProduto").style.display = "block";

    loadOrderItems(data.numero_pedido);
  } catch (error) {
    console.error("Falha ao gerar pedido:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro ao criar pedido. Verifique os dados.",
      confirmButtonColor: "#4a90e2",
    });
  }
});

document.getElementById("inputProduto").addEventListener("keyup", async (e) => {
  const search = e.target.value.trim();
  const resultsContainer = document.getElementById("productResultsContainer");
  const tableBody = document.getElementById("listaProdutosBusca");

  if (search.length > 0) {
    resultsContainer.style.display = "block";
    tableBody.innerHTML =
      '<tr><td colspan="4" class="text-center">Pesquisando...</td></tr>';

    try {
      const response = await fetch(`${url_base}api/v1/products/${search}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Erro na busca");

      const data = await response.json();
      tableBody.innerHTML = "";

      if (data.length === 0) {
        tableBody.innerHTML =
          '<tr><td colspan="4" class="text-center">Nenhum produto encontrado.</td></tr>';
        return;
      }

      data.forEach((product) => {
        const tr = document.createElement("tr");
        const productImg =
          product.ia_imagenslink ||
          product.ia_imagem ||
          "https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-103.png?ssl=1";
        const media = product.ia_quantidadeproduto;
        const estoque = product.ia_quantidadeideal;
        let message = "Estoque Normal!";
        let classBadge = "bg-success";
        if (media < estoque) {
          message = "Estoque baixo!";
          classBadge = "bg-warning";
        }
        if (media < estoque / 2) {
          message = "Estoque muito baixo!";
          classBadge = "bg-danger";
        }
        if (media == 0) {
          message = "Estoque zerado!";
          classBadge = "bg-dark";
        }
        tr.innerHTML = `
        <td><img src="${productImg}" alt="${product.ia_nomeproduto}" class="img-fluid" style="max-width: 50px; max-height: 50px; object-fit: cover; border-radius: 5px;"></td>
        <span class="badge ${classBadge}" style="color: #fffffff5">${message}</span>
                    <td>${product.ia_nomeproduto}</td>
                    <td>R$ ${(Number(product.ia_valor) || 0).toFixed(2)}</td>
                    <td>${product.ia_quantidadeproduto || 0}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary btn-visualizar" 
                            data-id="${product.ia_idproduto}" 
                            data-nome="${product.ia_nomeproduto}"
                            data-desc="${product.ia_descricaoproduto || ""}"
                            data-preco="${Number(product.ia_valor) || 0}"
                            data-img="${productImg}">
                            <i class="bi bi-eye"></i> Visualizar
                        </button>
                    </td>
                `;
        tableBody.appendChild(tr);
      });

      document.querySelectorAll(".btn-visualizar").forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = this.getAttribute("data-id");
          const nome = this.getAttribute("data-nome");
          const desc = this.getAttribute("data-desc");
          const preco = parseFloat(this.getAttribute("data-preco"));
          const img = this.getAttribute("data-img");

          document.getElementById("modalProdutoId").value = id;
          document.getElementById("modalProdutoNome").textContent = nome;
          document.getElementById("modalProdutoDesc").textContent = desc;
          document.getElementById("modalProdutoImg").src = img;
          document.getElementById("modalProdutoPrecoBadge").textContent =
            `R$ ${preco.toFixed(2)}`;
          document.getElementById("inputPrecoVenda").value = preco;
          document.getElementById("inputQuantidade").value = 1;

          updateModalSubtotal();

          const modal = new bootstrap.Modal(
            document.getElementById("modalQuantidade"),
          );

          modal.show();
        });
      });
    } catch (error) {
      console.error("Erro na busca:", error);
      tableBody.innerHTML =
        '<tr><td colspan="4" class="text-center text-danger">Erro ao buscar produtos.</td></tr>';
    }
  } else {
    resultsContainer.style.display = "none";
    tableBody.innerHTML = "";
  }
});

document.getElementById("btnAumentar").addEventListener("click", () => {
  const input = document.getElementById("inputQuantidade");
  input.value = parseInt(input.value) + 1;
  updateModalSubtotal();
});

document.getElementById("btnDiminuir").addEventListener("click", () => {
  const input = document.getElementById("inputQuantidade");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
    updateModalSubtotal();
  }
});

document
  .getElementById("inputQuantidade")
  .addEventListener("input", updateModalSubtotal);

function updateModalSubtotal() {
  const qtd = parseFloat(document.getElementById("inputQuantidade").value) || 0;
  const preco =
    parseFloat(document.getElementById("inputPrecoVenda").value) || 0;
  const subtotal = qtd * preco;

  document.getElementById("modalItemSubtotal").textContent =
    `R$ ${subtotal.toFixed(2)}`;
}

document
  .getElementById("btnConfirmarAdicionar")
  .addEventListener("click", async () => {
    const pedidoId = document.getElementById("codigoCompra").value;
    const produtoId = document.getElementById("modalProdutoId").value;
    const quantidade = document.getElementById("inputQuantidade").value;
    const precoVenda = document.getElementById("inputPrecoVenda").value;
    const usuarioId = localStorage.getItem("id");

    const clienteId = document.getElementById("selectCliente").value;

    if (!quantidade || quantidade <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Informe uma quantidade válida.",
        confirmButtonColor: "#4a90e2",
      });
      return;
    }

    try {
      const response = await fetch(`${url_base}api/v1/additemcarrinho`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
        body: JSON.stringify({
          codigo_item: produtoId,
          codigo_parceiro: clienteId,
          nr_quantidade: quantidade,
          vlr_item: precoVenda,
          numero_compra: pedidoId,
          cd_usuario: localStorage.getItem("id"),
        }),
      });

      console.log("Status da resposta adicionar:", response.status);
      const dataResponse = await response.json().catch(() => ({}));

      if (dataResponse.response === false && dataResponse.code === 3) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: dataResponse.output,
          confirmButtonColor: "#4a90e2",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Item adicionado",
        text: dataResponse.output,
        timer: 2000,
        showConfirmButton: false,
      });

      const modalElement = document.getElementById("modalQuantidade");
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();

      loadOrderItems(pedidoId);
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Falha ao adicionar item ao pedido.",
        confirmButtonColor: "#4a90e2",
      });
    }
  });

async function loadOrderItems(pedidoId) {
  const tableBody = document.querySelector("#tableItens tbody");
  const totalPedido = document.getElementById("totalPedido");
  const btnFinalizar = document.getElementById("btnFinalizarVendaAcao");

  try {
    const response = await fetch(
      `${url_base}api/v1/getitemsfororder/${pedidoId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
      },
    );

    if (response.status === 404) {
      tableBody.innerHTML = "";
      totalPedido.textContent = "R$ 0,00";
      if (btnFinalizar) btnFinalizar.disabled = true;
      return;
    }

    if (!response.ok) throw new Error("Erro ao carregar itens");

    const data = await response.json();
    console.log("Dados recebidos loadOrderItems:", data);

    const items = Array.isArray(data.output) ? data.output : [];

    tableBody.innerHTML = "";
    let total = 0;

    if (items.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="5" class="text-center">Nenhum item encontrado.</td></tr>';
    } else {
      items.forEach((item) => {
        const qtd = parseFloat(item.nr_quantidade) || 0;
        const vlr = parseFloat(item.vlr_item) || 0;
        const itemTotal = qtd * vlr;
        total += itemTotal;

        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td>${item.nome_produto || `Item #${item.codigo_item}`}</td>
                <td>${qtd}</td>
                <td>R$ ${vlr.toFixed(2)}</td>
                <td>R$ ${itemTotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditItemModal('${item.codigo_item}', '${pedidoId}', ${qtd})" title="Editar Quantidade">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${item.codigo_item}, '${pedidoId}')" title="Remover Item">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
        tableBody.appendChild(tr);
      });
    }

    totalPedido.textContent = `R$ ${total.toFixed(2)}`;

    if (items.length > 0 && !window.currentOrderIsFinalized) {
      if (btnFinalizar) btnFinalizar.disabled = false;
      if (document.getElementById("btnCancelarVendaAcao"))
        document.getElementById("btnCancelarVendaAcao").disabled = false;
    } else {
      if (btnFinalizar) btnFinalizar.disabled = true;
      if (document.getElementById("btnCancelarVendaAcao"))
        document.getElementById("btnCancelarVendaAcao").disabled = true;
    }

    if (window.currentOrderIsFinalized) {
      document
        .querySelectorAll("#tableItens button")
        .forEach((btn) => (btn.style.display = "none"));
    }
  } catch (error) {
    console.error("Erro ao carregar itens:", error);
  }
}

window.openEditItemModal = (itemId, pedidoId, currentQtd) => {
  document.getElementById("editItemId").value = itemId;
  document.getElementById("editPedidoId").value = pedidoId;
  document.getElementById("editOldQtd").value = currentQtd;
  document.getElementById("inputEditQuantidade").value = currentQtd;

  const modal = new bootstrap.Modal(document.getElementById("modalEditarItem"));
  modal.show();

  document.getElementById("modalEditarItem").addEventListener(
    "shown.bs.modal",
    function () {
      document.getElementById("inputEditQuantidade").focus();
      document.getElementById("inputEditQuantidade").select();
    },
    { once: true },
  );
};

document
  .getElementById("btnSalvarEdicaoItem")
  ?.addEventListener("click", async () => {
    const itemId = document.getElementById("editItemId").value;
    const pedidoId = document.getElementById("editPedidoId").value;
    const oldQtd = parseInt(document.getElementById("editOldQtd").value);
    const newQtd = parseInt(
      document.getElementById("inputEditQuantidade").value,
    );

    if (!newQtd || newQtd <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Quantidade inválida",
        text: "Por favor, informe uma quantidade maior que zero.",
        confirmButtonColor: "#4a90e2",
      });
      return;
    }

    if (newQtd === oldQtd) {
      const modalElement = document.getElementById("modalEditarItem");
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
      return;
    }

    try {
      const response = await fetch(`${url_base}api/v1/atualiza-item-carrinho`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
        body: JSON.stringify({
          numero_compra: pedidoId.toString(),
          nova_quantidade: newQtd,
          codigo_produto: parseInt(itemId),
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar item");

      const modalElement = document.getElementById("modalEditarItem");
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();

      loadOrderItems(pedidoId);
    } catch (error) {
      console.error("Erro updateItemQuantity:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Falha ao atualizar quantidade.",
        confirmButtonColor: "#4a90e2",
      });
    }
  });

window.removeItem = async (itemId, pedidoId) => {
  const result = await Swal.fire({
    title: "Remover item?",
    text: "Deseja realmente remover este item do pedido?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, remover",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    const response = await fetch(
      `${url_base}api/v1/deleteitempedido/${itemId}/${pedidoId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
      },
    );

    if (!response.ok) throw new Error("Erro ao remover item");

    loadOrderItems(pedidoId);
  } catch (error) {
    console.error("Erro ao remover:", error);
  }
};

const offcanvasPedidos = document.getElementById("offcanvasPedidos");
const listaPedidosContainer = document.getElementById("listaPedidosContainer");

if (offcanvasPedidos) {
  offcanvasPedidos.addEventListener("show.bs.offcanvas", () => {
    fetchOrders();
  });
}

async function fetchOrders() {
  if (!listaPedidosContainer) return;
  listaPedidosContainer.innerHTML =
    '<div class="text-center p-3 text-muted"><span class="spinner-border spinner-border-sm"></span> Carregando...</div>';

  try {
    const response = await fetch(
      `${url_base}api/v1/getpedidosforuser/${localStorage.getItem("id")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar pedidos: ${response.status}`);
    }

    const data = await response.json();
    renderOrders(data);
  } catch (error) {
    console.error("Erro fetchOrders:", error);
    listaPedidosContainer.innerHTML =
      '<div class="text-center p-3 text-danger">Erro ao carregar pedidos.</div>';
  }
}

function renderOrders(orders) {
  if (!listaPedidosContainer) return;
  listaPedidosContainer.innerHTML = "";

  const list = Array.isArray(orders) ? orders : orders.output || [];

  if (list.length === 0) {
    listaPedidosContainer.innerHTML =
      '<div class="text-center p-3 text-muted">Nenhum pedido encontrado.</div>';
    return;
  }

  list.sort((a, b) => b.codigo_compra - a.codigo_compra);

  const formatador = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  list.forEach((pedido) => {
    const cd_pedido = pedido.codigo_compra || pedido.cd_pedido;
    const vlr_total = parseFloat(pedido.vlr_total || pedido.vlr_pedido || 0);
    const cd_cliente = pedido.cd_cliente || pedido.cd_clinte;

    let status = pedido.f_fechado || pedido.situacao || "N";
    let statusText = "Em andamento";
    let statusClass = "text-warning";
    let btns = "";

    if (status === "S") {
      statusText = "Finalizado";
      statusClass = "text-success";
      btns = `
                <button class="btn btn-sm btn-outline-primary" onclick="visualizarPedido(${cd_pedido}, '${cd_cliente}', 'S')" title="Visualizar"><i class="bi bi-eye"></i></button>
                <button class="btn btn-sm btn-outline-secondary ms-1" onclick="generateNFe(${cd_pedido})" title="Baixar XML"><i class="bi bi-file-earmark-code"></i></button>
                <button class="btn btn-sm btn-outline-info ms-1" onclick="viewDANFE(${cd_pedido})" title="Ver DANFE"><i class="bi bi-printer"></i></button>
            `;
    } else if (status === "C") {
      statusText = "Cancelado";
      statusClass = "text-danger";
      btns = `
                <button class="btn btn-sm btn-outline-primary" onclick="visualizarPedido(${cd_pedido}, '${cd_cliente}', 'C')" title="Visualizar"><i class="bi bi-eye"></i></button>
            `;
    } else {
      btns = `
                <button class="btn btn-sm btn-outline-primary me-1" onclick="visualizarPedido(${cd_pedido}, '${cd_cliente}', 'N')" title="Visualizar"><i class="bi bi-eye"></i></button>
                <button class="btn btn-sm btn-success me-1" onclick="finalizarPedido(${cd_pedido})" title="Finalizar"><i class="bi bi-check-lg"></i></button>
                <button class="btn btn-sm btn-danger" onclick="abrirModalCancelar(${cd_pedido})" title="Cancelar"><i class="bi bi-x-lg"></i></button>
            `;
    }

    const item = document.createElement("div");

    item.className = "list-group-item";
    item.innerHTML = `
            <div class="d-flex w-100 justify-content-between align-items-center mb-1">
                <h6 class="mb-0 fw-bold">Pedido #${cd_pedido}</h6>
                <span class="badge bg-light ${statusClass}">${statusText}</span>
            </div>
            <div class="d-flex w-100 justify-content-between align-items-center mb-2">
                <small class="text-muted">Cliente: ${cd_cliente}</small>
                <small class="fw-bold">${formatador.format(vlr_total)}</small>
            </div>
            <div class="d-flex justify-content-end">
                ${btns}
            </div>
        `;

    listaPedidosContainer.appendChild(item);
  });
}

async function visualizarPedido(cd_pedido, cd_cliente, status) {
  try {
    const select = document.getElementById("selectCliente");

    window.currentOrderIsFinalized = status !== "N";

    if (select.tomselect) {
      select.tomselect.setValue(cd_cliente);
    } else {
      select.value = cd_cliente;
    }

    document.getElementById("codigoCompra").value = cd_pedido;
    document.getElementById("btnFinalizarVenda").disabled = true;
    document
      .getElementById("selectCliente")
      .setAttribute("disabled", "disabled");

    if (window.currentOrderIsFinalized) {
      document.getElementById("sectionBuscaProduto").style.display = "none";
      document.getElementById("btnFinalizarVendaAcao").disabled = true;
      if (document.getElementById("btnCancelarVendaAcao"))
        document.getElementById("btnCancelarVendaAcao").disabled = true;
    } else {
      document.getElementById("sectionBuscaProduto").style.display = "block";
      document.getElementById("btnLimparPedido").disabled = false;
      if (document.getElementById("btnCancelarVendaAcao"))
        document.getElementById("btnCancelarVendaAcao").disabled = false;
    }

    document.getElementById("btnLimparPedido").addEventListener("click", () => {
      document.location.reload();
    });
    loadOrderItems(cd_pedido);

    const offcanvasEl = document.getElementById("offcanvasPedidos");
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (offcanvasInstance) offcanvasInstance.hide();

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Erro ao visualizar pedido:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Falha ao carregar o pedido.",
      confirmButtonColor: "#4a90e2",
    });
  }
}

async function abrirModalCancelar(cd_pedido) {
  document.getElementById("modalCancelOrderId").textContent = cd_pedido;
  document.getElementById("motivoCancelamento").value = "";

  const modal = new bootstrap.Modal(
    document.getElementById("modalCancelarPedido"),
  );
  modal.show();

  const btnConfirmar = document.getElementById("btnConfirmarCancelamento");

  const newBtn = btnConfirmar.cloneNode(true);
  btnConfirmar.parentNode.replaceChild(newBtn, btnConfirmar);

  newBtn.addEventListener("click", () => confirmarCancelamento(cd_pedido));
}

async function confirmarCancelamento(cd_pedido) {
  const motivo = document.getElementById("motivoCancelamento").value.trim();

  if (!motivo) {
    Swal.fire({
      icon: "warning",
      title: "Campo obrigatório",
      text: "Por favor, informe o motivo do cancelamento.",
      confirmButtonColor: "#4a90e2",
    });
    return;
  }

  try {
    const response = await fetch(`${url_base}api/v1/cancelarpedido`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
      body: JSON.stringify({
        codigo_compra: cd_pedido.toString(),
        c_motivo: motivo,
      }),
    });

    if (!response.ok) throw new Error("Erro ao cancelar pedido");

    Swal.fire({
      icon: "success",
      title: "Pedido Cancelado",
      text: `Pedido ${cd_pedido} cancelado com sucesso!`,
      confirmButtonColor: "#4a90e2",
    });

    // Hide modal
    const modalElement = document.getElementById("modalCancelarPedido");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();

    // Refresh list
    fetchOrders();

    // If current order, refresh view
    if (document.getElementById("codigoCompra").value == cd_pedido) {
      const clienteId = document.getElementById("selectCliente").value;
      visualizarPedido(cd_pedido, clienteId, "C");
    }
  } catch (error) {
    console.error("Erro ao cancelar pedido:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Falha ao cancelar o pedido.",
      confirmButtonColor: "#4a90e2",
    });
  }
}

async function finalizarPedido(cd_pedido) {
  const result = await Swal.fire({
    title: "Finalizar pedido?",
    text: `Deseja realmente finalizar o pedido ${cd_pedido}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, finalizar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    const response = await fetch(
      `${url_base}api/v1/finalizarpedido/${cd_pedido}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
        body: JSON.stringify({
          codigo_compra: cd_pedido,
        }),
      },
    );

    if (!response.ok) throw new Error("Erro ao finalizar pedido");

    const data = await response.json();
    Swal.fire({
      icon: "success",
      title: "Sucesso",
      text: data.output,
      confirmButtonColor: "#4a90e2",
    });

    fetchOrders();

    if (document.getElementById("codigoCompra").value == cd_pedido) {
      location.reload();
    }
  } catch (error) {
    console.error("Erro ao finalizar pedido:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Falha ao finalizar o pedido.",
      confirmButtonColor: "#4a90e2",
    });
  }
}

document
  .getElementById("btnCancelarVendaAcao")
  ?.addEventListener("click", () => {
    const pedidoId = document.getElementById("codigoCompra").value;
    if (pedidoId) {
      abrirModalCancelar(pedidoId);
    }
  });

document
  .getElementById("btnFinalizarVendaAcao")
  ?.addEventListener("click", () => {
    const pedidoId = document.getElementById("codigoCompra").value;
    if (pedidoId) {
      finalizarPedido(pedidoId);
    }
  });

async function getNFeXML(pedidoId) {
  const itemsResponse = await fetch(
    `${url_base}api/v1/getitemsfororder/${pedidoId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    },
  );

  if (!itemsResponse.ok) throw new Error("Falha ao buscar itens do pedido.");

  const data = await itemsResponse.json();
  const rawItems = Array.isArray(data.output) ? data.output : [];

  if (rawItems.length === 0) {
    throw new Error("Este pedido não possui itens. Não é possível gerar NFe.");
  }

  const items = rawItems.map((item) => ({
    ...item,
    nr_quantidade: parseFloat(item.nr_quantidade) || 0,
    vlr_item: parseFloat(item.vlr_item) || 0,
  }));

  const totalVenda = items.reduce(
    (acc, i) => acc + i.nr_quantidade * i.vlr_item,
    0,
  );

  const now = new Date();
  const aamm =
    now.getFullYear().toString().slice(-2) +
    (now.getMonth() + 1).toString().padStart(2, "0");
  const cnpjEmit = "99405451000176";
  const mod = "55";
  const serie = "001";
  const nNF = pedidoId.toString().padStart(9, "0");
  const tpEmis = "1";
  const cNF = Math.floor(Math.random() * 99999999)
    .toString()
    .padStart(8, "0");
  const cUF = "35";

  const keyWithoutDV = `${cUF}${aamm}${cnpjEmit}${mod}${serie}${nNF}${tpEmis}${cNF}`;

  const calculateDV = (key) => {
    let sum = 0;
    let weight = 2;
    for (let i = key.length - 1; i >= 0; i--) {
      sum += parseInt(key[i]) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    const rest = sum % 11;
    const dv = 11 - rest;
    return dv >= 10 ? 0 : dv;
  };

  const cDV = calculateDV(keyWithoutDV);
  const chaveAcesso = `${keyWithoutDV}${cDV}`;

  const nfeObj = {
    _declaration: { _attributes: { version: "1.0", encoding: "UTF-8" } },
    NFe: {
      _attributes: { xmlns: "http://www.portalfiscal.inf.br/nfe" },
      infNFe: {
        _attributes: {
          Id: `NFe${chaveAcesso}`,
          versao: "4.00",
        },
        ide: {
          cUF: { _text: cUF },
          cNF: { _text: cNF },
          natOp: { _text: "VENDA DE MERCADORIA" },
          mod: { _text: mod },
          serie: { _text: "1" },
          nNF: { _text: pedidoId },
          dhEmi: { _text: now.toISOString().split(".")[0] + "-03:00" },
          tpNF: { _text: "1" },
          idDest: { _text: "1" },
          cMunFG: { _text: "3550308" },
          tpImp: { _text: "1" },
          tpEmis: { _text: tpEmis },
          cDV: { _text: cDV },
          tpAmb: { _text: "2" },
          finNFe: { _text: "1" },
          indFinal: { _text: "1" },
          indPres: { _text: "1" },
          procEmi: { _text: "0" },
          verProc: { _text: "1.0.0" },
        },
        emit: {
          CNPJ: { _text: cnpjEmit },
          xNome: { _text: "ESTOQUE INTELIGENTE LTDA" },
          xFant: { _text: "ESTOQUE INTELIGENTE" },
          enderEmit: {
            xLgr: { _text: "RUA DE EXEMPLO, LOTE  39 QUADRA 12" },
            nro: { _text: "123" },
            xBairro: { _text: "BAIRRO DE EXEMPLO" },
            cMun: { _text: "3550308" },
            xMun: { _text: "SAO PAULO" },
            UF: { _text: "SP" },
            CEP: { _text: "01310100" },
            cPais: { _text: "1058" },
            xPais: { _text: "BRASIL" },
          },
          IE: { _text: "123456789111" },
          CRT: { _text: "3" },
        },
        dest: {
          xNome: { _text: "CONSUMIDOR FINAL - AMBIENTE DE HOMOLOGAÇÃO" },
          CPF: { _text: "00000000000" },
          enderDest: {
            xLgr: { _text: "RUA DE EXEMPLO" },
            nro: { _text: "123" },
            xBairro: { _text: "BAIRRO DE EXEMPLO" },
            cMun: { _text: "3550308" },
            xMun: { _text: "SAO PAULO" },
            UF: { _text: "SP" },
            CEP: { _text: "01001000" },
            cPais: { _text: "1058" },
            xPais: { _text: "BRASIL" },
          },
          indIEDest: { _text: "9" },
        },
        det: items.map((item, index) => ({
          _attributes: { nItem: index + 1 },
          prod: {
            cProd: { _text: item.codigo_item || "0" },
            cEAN: { _text: "SEM GTIN" },
            xProd: { _text: item.nome_produto || "PRODUTO TESTE" },
            NCM: { _text: "85171231" },
            CFOP: { _text: "5102" },
            uCom: { _text: "UN" },
            qCom: { _text: item.nr_quantidade.toFixed(4) },
            vUnCom: { _text: item.vlr_item.toFixed(4) },
            vProd: { _text: (item.nr_quantidade * item.vlr_item).toFixed(2) },
            cEANTrib: { _text: "SEM GTIN" },
            uTrib: { _text: "UN" },
            qTrib: { _text: item.nr_quantidade.toFixed(4) },
            vUnTrib: { _text: item.vlr_item.toFixed(4) },
            indTot: { _text: "1" },
          },
          imposto: {
            vTotTrib: { _text: "0.00" },
            ICMS: {
              ICMS00: {
                orig: { _text: "0" },
                CST: { _text: "00" },
                modBC: { _text: "3" },
                vBC: {
                  _text: (item.nr_quantidade * item.vlr_item).toFixed(2),
                },
                pICMS: { _text: "0.00" },
                vICMS: { _text: "0.00" },
              },
            },
            PIS: {
              PISOutr: {
                CST: { _text: "99" },
                vBC: { _text: "0.00" },
                pPIS: { _text: "0.00" },
                vPIS: { _text: "0.00" },
              },
            },
            COFINS: {
              COFINSOutr: {
                CST: { _text: "99" },
                vBC: { _text: "0.00" },
                pCOFINS: { _text: "0.00" },
                vCOFINS: { _text: "0.00" },
              },
            },
          },
        })),
        total: {
          ICMSTot: {
            vBC: { _text: "0.00" },
            vICMS: { _text: "0.00" },
            vICMSDeson: { _text: "0.00" },
            vFCP: { _text: "0.00" },
            vBCST: { _text: "0.00" },
            vST: { _text: "0.00" },
            vFCPSTRet: { _text: "0.00" },
            vProd: { _text: totalVenda.toFixed(2) },
            vFrete: { _text: "0.00" },
            vSeg: { _text: "0.00" },
            vDesc: { _text: "0.00" },
            vII: { _text: "0.00" },
            vIPI: { _text: "0.00" },
            vIPIDevol: { _text: "0.00" },
            vPIS: { _text: "0.00" },
            vCOFINS: { _text: "0.00" },
            vOutro: { _text: "0.00" },
            vNF: { _text: totalVenda.toFixed(2) },
          },
        },
        transp: { modFrete: { _text: "9" } },
      },
    },
  };

  const js2xml =
    window.js2xml || (window.xmljs && window.xmljs.js2xml) || window.json2xml;
  if (typeof js2xml !== "function") {
    throw new Error("Biblioteca de conversão XML não carregada corretamente.");
  }

  return js2xml(nfeObj, { compact: true, spaces: 4 });
}

async function generateNFe(pedidoId) {
  const result = await Swal.fire({
    title: "Baixar XML?",
    text: `Deseja baixar o XML da NFe para o pedido ${pedidoId}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a90e2",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, baixar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;
  try {
    const xml = await getNFeXML(pedidoId);
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nfe-${pedidoId}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao baixar NFe:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: error.message,
      confirmButtonColor: "#4a90e2",
    });
  }
}

async function viewDANFE(pedidoId) {
  try {
    const rawXml = await getNFeXML(pedidoId);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
${rawXml.replace('<?xml version="1.0" encoding="UTF-8"?>', "").trim()}
<protNFe versao="4.00"><infProt><tpAmb>2</tpAmb><verAplic>1.0.0</verAplic><chNFe>${pedidoId}</chNFe><dhRecbto>${new Date().toISOString()}</dhRecbto><nProt>000000000000000</nProt><digVal>abc=</digVal><cStat>100</cStat><xMotivo>Autorizado o uso da NF-e</xMotivo></infProt></protNFe>
</nfeProc>`;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://www.webdanfeonline.com.br/print.php";
    form.target = "_blank";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "xml";
    input.value = xml;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } catch (error) {
    console.error("Erro ao visualizar DANFE:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: error.message,
      confirmButtonColor: "#4a90e2",
    });
  }
}
