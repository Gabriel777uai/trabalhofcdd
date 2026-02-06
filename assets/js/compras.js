let url_base;
if (window.location.hostname === "localhost" || "127.0.0.1") {
  console.log('Testes em Desenvolvimento');
  url_base = "http://localhost:8000/";
} else {
  console.log('Rodando emProdução');
  url_base = "https://trabalhofcdd-backend.onrender.com/";
}

document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("usuario");
  if (user) {
    document.getElementById("user").textContent = user;
  }
});

// Carrega os parceiros (fornecedores)
async function listSuppliersSelect(id) {
  try {
    const response = await fetch(`${url_base}api/v1/getclientsforuser/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });

    if (!response.ok)
      throw new Error(`Erro ao buscar parceiros: ${response.status}`);

    const data = await response.json();
    const select = document.getElementById("selectFornecedor");

    select.innerHTML = '<option value="">Selecione um fornecedor...</option>';

    data.forEach((supplier) => {
      const option = document.createElement("option");
      option.value = supplier.cod_cliente; // Usando cod_cliente como ID de parceiro genérico
      option.textContent = supplier.nome_cliente;
      select.appendChild(option);
    });

    if (window.TomSelect) {
      new TomSelect("#selectFornecedor", {
        create: false,
        sortField: { field: "text", direction: "asc" },
        placeholder: "Pesquise por um fornecedor...",
        noResultsText: "Nenhum fornecedor encontrado",
      });
    }
  } catch (error) {
    console.error("Falha ao carregar fornecedores:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("id");
  if (userId) {
    listSuppliersSelect(userId);
  }
});

// Gera o pedido de compra
document.getElementById("formCompra").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData(e.target);
    // Usamos o endpoint de criar pedido que parece ser genérico ou o mais próximo disponível
    const response = await fetch(`${url_base}api/v1/criarpedidovenda`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
      body: JSON.stringify({
        codigo_cliente: formData.get("codigo_fornecedor"),
        codigo_usuario: localStorage.getItem("id"),
      }),
    });

    if (!response.ok) throw new Error("Erro ao gerar pedido de compra");

    const data = await response.json();
    document.getElementById("codigoPedido").value = data.numero_pedido;

    // Desabilita criação e mostra busca
    document.getElementById("btnGerarPedido").disabled = true;
    document
      .getElementById("selectFornecedor")
      .setAttribute("disabled", "disabled");
    document.getElementById("sectionBuscaProduto").style.display = "block";

    loadPurchaseItems(data.numero_pedido);
  } catch (error) {
    console.error("Falha ao gerar pedido:", error);
    alert("Erro ao criar pedido de compra.");
  }
});

// Busca de produtos
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
          "https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-103.png?ssl=1";
        tr.innerHTML = `
                    <td>${product.ia_nomeproduto}</td>
                    <td>R$ ${(Number(product.ia_valor) || 0).toFixed(2)}</td>
                    <td>${product.ia_quantidadeproduto || 0}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary btn-add-item" 
                            data-id="${product.ia_idproduto}" 
                            data-nome="${product.ia_nomeproduto}"
                            data-desc="${product.ia_descricaoproduto || ""}"
                            data-img="${productImg}">
                            <i class="bi bi-cart-plus"></i> Selecionar
                        </button>
                    </td>
                `;
        tableBody.appendChild(tr);
      });

      document.querySelectorAll(".btn-add-item").forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = this.getAttribute("data-id");
          const nome = this.getAttribute("data-nome");
          const desc = this.getAttribute("data-desc");
          const img = this.getAttribute("data-img");

          document.getElementById("modalProdutoId").value = id;
          document.getElementById("modalProdutoNome").textContent = nome;
          document.getElementById("modalProdutoDesc").textContent = desc;
          document.getElementById("modalProdutoImg").src = img;
          document.getElementById("inputPrecoCompra").value = 0;
          document.getElementById("inputQuantidade").value = 1;

          updateModalSubtotal();
          new bootstrap.Modal(
            document.getElementById("modalQuantidade"),
          ).show();
        });
      });
    } catch (error) {
      console.error("Erro na busca:", error);
      tableBody.innerHTML =
        '<tr><td colspan="4" class="text-center text-danger">Erro ao buscar produtos.</td></tr>';
    }
  } else {
    resultsContainer.style.display = "none";
  }
});

// Lógica de Subtotal no Modal
function updateModalSubtotal() {
  const qtd = parseFloat(document.getElementById("inputQuantidade").value) || 0;
  const preco =
    parseFloat(document.getElementById("inputPrecoCompra").value) || 0;
  const subtotal = qtd * preco;
  document.getElementById("modalItemSubtotal").textContent =
    `R$ ${subtotal.toFixed(2)}`;
}

document
  .getElementById("inputQuantidade")
  .addEventListener("input", updateModalSubtotal);
document
  .getElementById("inputPrecoCompra")
  .addEventListener("input", updateModalSubtotal);
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

// Adiciona item ao carrinho de compra
document
  .getElementById("btnConfirmarAdicionar")
  .addEventListener("click", async () => {
    const pedidoId = document.getElementById("codigoPedido").value;
    const produtoId = document.getElementById("modalProdutoId").value;
    const quantidade = document.getElementById("inputQuantidade").value;
    const precoCompra = document.getElementById("inputPrecoCompra").value;
    const supplierId = document.getElementById("selectFornecedor").value;

    try {
      const response = await fetch(`${url_base}api/v1/additemcarrinho`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
        body: JSON.stringify({
          codigo_item: produtoId,
          codigo_parceiro: supplierId,
          nr_quantidade: quantidade,
          vlr_item: precoCompra,
          numero_compra: pedidoId,
          cd_usuario: localStorage.getItem("id"),
        }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar item");

      const modalElement = document.getElementById("modalQuantidade");
      bootstrap.Modal.getInstance(modalElement).hide();

      loadPurchaseItems(pedidoId);
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      alert("Falha ao adicionar item à compra.");
    }
  });

// Carrega itens da compra
async function loadPurchaseItems(pedidoId) {
  const tableBody = document.querySelector("#tableItens tbody");
  const totalPedido = document.getElementById("totalPedido");
  const btnFinalizar = document.getElementById("btnFinalizarCompraAcao");
  const btnCancelar = document.getElementById("btnCancelarCompraAcao");

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
      btnFinalizar.disabled = true;
      btnCancelar.disabled = true;
      return;
    }

    const data = await response.json();
    const items = Array.isArray(data.output) ? data.output : [];
    tableBody.innerHTML = "";
    let total = 0;

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
                    <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${item.codigo_item}, '${pedidoId}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
      tableBody.appendChild(tr);
    });

    totalPedido.textContent = `R$ ${total.toFixed(2)}`;
    btnFinalizar.disabled = items.length === 0;
    btnCancelar.disabled = items.length === 0;
  } catch (error) {
    console.error("Erro ao carregar itens:", error);
  }
}

// Global functions
window.removeItem = async (itemId, pedidoId) => {
  if (!confirm("Remover este item?")) return;
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
    if (!response.ok) throw new Error("Erro ao remover");
    loadPurchaseItems(pedidoId);
  } catch (error) {
    console.error(error);
  }
};

// Finalizar Compra
document
  .getElementById("btnFinalizarCompraAcao")
  .addEventListener("click", async () => {
    const pedidoId = document.getElementById("codigoPedido").value;
    if (
      !confirm("Finalizar entrada de estoque? Os produtos serão atualizados.")
    )
      return;

    try {
      const response = await fetch(
        `${url_base}api/v1/finalizarpedido/${pedidoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
          },
          body: JSON.stringify({ codigo_compra: pedidoId }),
        },
      );
      if (!response.ok) throw new Error("Erro ao finalizar");
      alert("Compra finalizada com sucesso! Estoque atualizado.");
      location.reload();
    } catch (error) {
      console.error(error);
      alert("Erro ao finalizar compra.");
    }
  });

// Histórico de compras (reutilizando a lógica de pedidos)
document
  .getElementById("btnVisualizarPedidos")
  .addEventListener("click", async () => {
    document.querySelector(".visualizar-pedidos-control").style.left = "63.5%";
    document.querySelector(".overlay-pedidos").style.left = "0%";

    try {
      const response = await fetch(
        `${url_base}api/v1/getpedidosforuser/${localStorage.getItem("id")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
          },
        },
      );
      const data = await response.json();
      const list = document.querySelector(".list-group");
      list.innerHTML = "";

      if (data.length === 0) {
        list.innerHTML = "<p class='p-3'>Nenhuma compra encontrada.</p>";
        return;
      }

      data.forEach((pedido) => {
        const formatador = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        const item = `
                <article class="box-pedidos p-3 border-bottom">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">Compra #${pedido.codigo_compra}</h6>
                            <small class="text-muted">Parceiro: ${pedido.cd_cliente}</small>
                        </div>
                        <span class="badge ${pedido.f_fechado === "S" ? "bg-success" : "bg-warning"}">
                            ${pedido.f_fechado === "S" ? "Finalizada" : "Em Aberto"}
                        </span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span>${formatador.format(pedido.vlr_total)}</span>
                        <small>${pedido.total_itens} itens</small>
                    </div>
                </article>`;
        list.innerHTML += item;
      });
    } catch (error) {
      console.error(error);
    }
  });

document.getElementById("btnFecharPedidos").addEventListener("click", () => {
  document.querySelector(".visualizar-pedidos-control").style.left = "100%";
  document.querySelector(".overlay-pedidos").style.left = "100%";
});
