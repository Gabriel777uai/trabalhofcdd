let url_base = "http://localhost:8000/";

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

    // Disable order creation and show product search
    document.getElementById("btnFinalizarVenda").disabled = true; // Button inside form
    document
      .getElementById("selectCliente")
      .setAttribute("disabled", "disabled");
    document.getElementById("sectionBuscaProduto").style.display = "block";

    // Clear list of items if it's a new order
    loadOrderItems(data.numero_pedido);
  } catch (error) {
    console.error("Falha ao gerar pedido:", error);
    alert("Erro ao criar pedido. Verifique os dados.");
  }
});

// Product Search on keyup
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
        tr.innerHTML = `
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

      // Add event listeners to "Visualizar" buttons
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

// Quantity Plus/Minus buttons
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

// Update subtotal when quantity changes manually
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

// Confirm Adding Item to Order
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
      alert("Informe uma quantidade válida.");
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
        }),
      });

      console.log("Status da resposta adicionar:", response.status);
      const dataResponse = await response.json().catch(() => ({}));

      if (!response.ok || dataResponse.response === false) {
        console.error("Erro detalhes:", dataResponse);
        throw new Error(dataResponse.message || "Erro ao adicionar item");
      }

      // Hide modal
      const modalElement = document.getElementById("modalQuantidade");
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();

      // Refresh items list
      loadOrderItems(pedidoId);

      // Success message or toast could be added here
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      alert("Falha ao adicionar item ao pedido.");
    }
  });

// Load and display order items
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

    // Suporte para o formato confirmado pela API: data.output
    const items = Array.isArray(data.output) ? data.output : [];

    tableBody.innerHTML = "";
    let total = 0;

    if (items.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="5" class="text-center">Nenhum item encontrado.</td></tr>';
    } else {
      items.forEach((item) => {
        // Mapeamento baseado no JSON fornecido pelo usuário
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
                    <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${item.id}, '${pedidoId}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
        tableBody.appendChild(tr);
      });
    }

    totalPedido.textContent = `R$ ${total.toFixed(2)}`;

    // Enable Finalizar button if there are items and the order is not finalized
    if (items.length > 0 && !window.currentOrderIsFinalized) {
      if (btnFinalizar) btnFinalizar.disabled = false;
    } else {
      if (btnFinalizar) btnFinalizar.disabled = true;
    }

    // Hide remove button for finalized orders
    if (window.currentOrderIsFinalized) {
      document
        .querySelectorAll("#tableItens .btn-outline-danger")
        .forEach((btn) => (btn.style.display = "none"));
    }
  } catch (error) {
    console.error("Erro ao carregar itens:", error);
  }
}

// Finalize Sale Action
document
  .getElementById("btnFinalizarVendaAcao")
  ?.addEventListener("click", async () => {
    const pedidoId = document.getElementById("codigoCompra").value;
    const response = await fetch(
      `${url_base}api/v1/finalizarpedido/${pedidoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
        body: JSON.stringify({
          codigo_compra: pedidoId,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Erro ao finalizar venda: ${response.status}`);
    }
    const data = await response.json();
    alert(`Venda ${pedidoId} finalizada com sucesso!`);
    // Here you would normally call an API to change status or redirect
    location.reload();
  });

// Clear Order Logic
document.getElementById("btnLimparPedido")?.addEventListener("click", () => {
  if (
    confirm(
      "Tem certeza que deseja limpar o pedido atual? Todas as alterações não finalizadas serão perdidas.",
    )
  ) {
    location.reload();
  }
});

// Global function for removal (or could be attached via listener)
window.removeItem = async (itemId, pedidoId) => {
  if (!confirm("Remover este item?")) return;

  try {
    const response = await fetch(
      `${url_base}api/v1/removeritempedido/${itemId}`,
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

//configurção para abrir e fechar o modal de pedidos

function criarListPedidos(
  cd_pedido,
  vlr_pedido,
  cd_cliente,
  situacao,
  quantidade_itens,
) {
  const formatador = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  let valorFormatado = formatador.format(vlr_pedido);
  let stringForlist = document.querySelector(".list-group");
  let btns = "";
  const isFechado = situacao === "S";

  if (!isFechado) {
    situacao = "Em andamento";
    btns = `
    <button class="btn-visualizar" onclick="visualizarPedido(${cd_pedido}, '${cd_cliente}', 'N')" title="Visualizar"><i class="bi bi-eye"></i></button>
    <button class="btn-finalizar" onclick="finalizarPedido(${cd_pedido})" title="Finalizar"><i class="bi bi-check-circle"></i></button>
    <button class="btn-excluir" onclick="excluirPedido(${cd_pedido})" title="Excuir pedido e cancelar"><i class="bi bi-x-circle"></i></button>
    `;
  } else {
    situacao = "Pedido Finalizado";
    btns = `
    <button class="btn-visualizar" onclick="visualizarPedido(${cd_pedido}, '${cd_cliente}', 'S')" title="Visualizar"><i class="bi bi-eye"></i></button>`;
  }
  let html = `
     <article class="box-pedidos">
        <div class="d-flex gap-5">
            <div>
                <h4>Pedido ${cd_pedido}</h4>
                <span>Cliente: ${cd_cliente}</span>
            </div>
            <div class="d-inline-flex flex-column">
                <span class="mb-3">Itens: ${quantidade_itens}</span>
                <span class="fw-bold">Status: ${situacao}</span>
            </div>
        </div>
        <div class="d-flex justify-content-between">
            <div>
                <span>Valor: ${valorFormatado}</span>
            </div>
            <div>
                ${btns}
            </div>
        </div>
    </article>`;

  stringForlist.innerHTML += html;
}

async function visualizarPedido(cd_pedido, cd_cliente, status) {
  try {
    const select = document.getElementById("selectCliente");

    // Define se o pedido está finalizado globalmente para outras funções usarem
    window.currentOrderIsFinalized = status !== "N";

    // Se o TomSelect estiver inicializado, use a API dele para selecionar o cliente
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
      document.getElementById("btnLimparPedido").disabled = true;
    } else {
      document.getElementById("sectionBuscaProduto").style.display = "block";
      document.getElementById("btnLimparPedido").disabled = false;
    }

    loadOrderItems(cd_pedido);

    // Fecha o painel lateral
    document.getElementById("btnFecharPedidos").click();
  } catch (error) {
    console.error("Erro ao visualizar pedido:", error);
    alert("Falha ao carregar o pedido.");
  }
}

async function finalizarPedido(cd_pedido) {
  if (!confirm(`Deseja realmente finalizar o pedido ${cd_pedido}?`)) return;

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

    alert(`Pedido ${cd_pedido} finalizado com sucesso!`);

    // Recarrega a lista de pedidos no painel lateral
    document.getElementById("btnVisualizarPedidos").click();
  } catch (error) {
    console.error("Erro ao finalizar pedido:", error);
    alert("Falha ao finalizar o pedido.");
  }
}

async function excluirPedido(cd_pedido) {
  if (
    !confirm(
      `Tem certeza que deseja excluir e cancelar o pedido ${cd_pedido}? Esta ação não pode ser desfeita.`,
    )
  )
    return;

  try {
    const response = await fetch(
      `${url_base}api/v1/deletarpedidovenda/${cd_pedido}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
      },
    );

    if (!response.ok) throw new Error("Erro ao excluir pedido");

    alert(`Pedido ${cd_pedido} excluído com sucesso!`);

    // Recarrega a lista de pedidos no painel lateral
    document.getElementById("btnVisualizarPedidos").click();

    // Se o pedido excluído for o que está aberto na tela, limpa a tela
    if (document.getElementById("codigoCompra").value == cd_pedido) {
      location.reload();
    }
  } catch (error) {
    console.error("Erro ao excluir pedido:", error);
    alert(
      "Falha ao excluir o pedido. Verifique se a API de exclusão está correta.",
    );
  }
}

let button_open = document.getElementById("btnVisualizarPedidos");

button_open.addEventListener("click", async () => {
  document.querySelector(".visualizar-pedidos-control").style.left = "63.5%";
  document.querySelector(".overlay-pedidos").style.left = "0%";

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
  console.log(data);
  if (data.length === 0) {
    document.querySelector(".list-group").innerHTML =
      "<p>Nenhum pedido encontrado</p>";
  } else {
    document.querySelector(".list-group").innerHTML = "";
    data.forEach((pedido) => {
      criarListPedidos(
        pedido.codigo_compra,
        pedido.vlr_total,
        pedido.cd_cliente,
        pedido.f_fechado,
        pedido.total_itens,
      );
    });
  }
  //  data.output.forEach(pedido => {
  //     criarListPedidos(pedido.cd_pedido, pedido.vlr_pedido, pedido.cd_clinte, pedido.situacao, pedido.quantidade_itens);
  //  });
});
let button_close = document.getElementById("btnFecharPedidos");

button_close.addEventListener("click", () => {
  document.querySelector(".visualizar-pedidos-control").style.left = "100%";
  document.querySelector(".overlay-pedidos").style.left = "100%";
});
