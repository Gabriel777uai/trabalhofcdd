let nameUser = localStorage.getItem("usuario");
document.getElementById("user").innerHTML = nameUser;

let url_base;
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("Testes em Desenvolvimento");

  url_base = "http://localhost/";
} else {
  console.log("Rodando em Produção");
  url_base = "https://trabalhofcdd-backend.onrender.com/";
}

function renderList(data) {
  $("#list-order").empty();
  if (data.length < 1) {
    $("#list-order").append(
      `
      <div class="pedidos-empty">
          <i class="bi bi-inbox"></i>
          <p>Nenhum pedido encontrado</p>
      </div>
      `
    );
    return;
  }
  
  data.forEach((items) => {
    let buttons = [];
    let badgeClass = "";
    let statusText = "";
    let mainColor = ""; // Usado na variável do pseudo-elemento

    if (items.f_fechado == "S") {
      buttons.push(`<button title="Gerar PDF" onclick="gerarPdf(${items.codigo_compra})" class="btn-icon-premium btn-pdf"><i class="bi bi-filetype-pdf"></i></button>`);
      buttons.push(`<button title="Visualizar pedido" onclick="visualizarPedido(${items.codigo_compra})" class="btn-icon-premium btn-view"><i class="bi bi-eye"></i></button>`);
      badgeClass = "status-finalizado";
      statusText = "Finalizado";
      mainColor = "#2e7d32";
    } else {
      buttons.push(`<button title="Cancelar pedido" onclick="cancelarPedido(${items.codigo_compra})" class="btn-icon-premium btn-cancel"><i class="bi bi-x-lg"></i></button>`);
      buttons.push(`<button title="Gerar PDF" onclick="gerarPdf(${items.codigo_compra})" class="btn-icon-premium btn-pdf"><i class="bi bi-filetype-pdf"></i></button>`);
      buttons.push(`<button title="Visualizar pedido" onclick="visualizarPedido(${items.codigo_compra})" class="btn-icon-premium btn-view"><i class="bi bi-eye"></i></button>`);
      buttons.push(`<button title="Finalizar pedido" onclick="finalizarPedido(${items.codigo_compra})" class="btn-icon-premium btn-finish"><i class="bi bi-check-lg"></i></button>`);
      badgeClass = "status-aguardando";
      statusText = "Aguardando";
      mainColor = "#ff8f00";
    }

    if (items.f_cancelado == "S") {
      buttons = []; // Remove os botões de ação e deixa só PDF e visualização
      buttons.push(`<button title="Gerar PDF" onclick="gerarPdf(${items.codigo_compra})" class="btn-icon-premium btn-pdf"><i class="bi bi-filetype-pdf"></i></button>`);
      buttons.push(`<button title="Visualizar pedido" onclick="visualizarPedido(${items.codigo_compra})" class="btn-icon-premium btn-view"><i class="bi bi-eye"></i></button>`);
      badgeClass = "status-cancelado";
      statusText = "Cancelado";
      mainColor = "#c62828";
    }

    const convertBrl = new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    }).format(items.vlr_total);

    let html = `
        <div class="pedido-card" style="--card-color: ${mainColor}">
            <div class="pedido-header">
                <span class="pedido-status ${badgeClass}">${statusText}</span>
                <span class="pedido-codigo">#${items.codigo_compra}</span>
            </div>
            <div class="pedido-body">
                <h3 class="pedido-cliente" title="${items.nome_cliente}">${items.nome_cliente}</h3>
                <div class="pedido-vlr">${convertBrl}</div>
            </div>
            <div class="pedido-actions">
                ${buttons.join("")}
            </div>
        </div>
    `;

    $("#list-order").append(html);
  });
}

async function getPedidos(baseUrl, id) {
  try {
    const reponse = await fetch(`${baseUrl}api/v1/getpedidosforuser/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });
    const data = await reponse.json();
    console.log(data);

    renderList(data);
  } catch (err) {
    console.error("erro ao fazer a requisição");
  }
}

getPedidos(url_base, localStorage.getItem("id"));

async function visualizarPedido(id) {
  const response = await fetch(`${url_base}api/v1/pedidos/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
    },
  });

  const data = await response.json();
  console.log("dados recebidos: " + id);

  let vlr_total = new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  }).format(data.cabececalho[0].vlr_total);

  let list = [];

  data.itens.forEach((items) => {
    let vlr_item = new Intl.NumberFormat("pt-br", { style: "currency", currency: "BRL" }).format(items.vlr_item_final);
    list.push(
      `<tr>
        <td style="font-family: monospace; font-weight: 600;">#${items.codigo_item}</td>
        <td>${items.nr_quantidade} un</td>
        <td>${vlr_item}</td>
       </tr>`
    );
  });

  const dataFormatada = new Date(
    data.cabececalho[0].d_cadastro,
  ).toLocaleDateString("pt-BR");

  let statusText = "Aguardando";
  if (data.cabececalho[0].f_fechado == "S") statusText = "Finalizado";
  if (data.cabececalho[0].f_cancelado == "S") statusText = "Cancelado";

  let htmlInner = `
    <div class="premium-modal-content">
        <div class="modal-head">
            <h3><i class="bi bi-receipt"></i> Detalhes do Pedido</h3>
            <button onclick="closeModalView()" class="btn-close-modal"><i class="bi bi-x-lg"></i></button>
        </div>
        
        <div class="modal-body-scroll">
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Número</span>
                    <span class="info-value">#${data.cabececalho[0].codigo_compra}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Data</span>
                    <span class="info-value">${dataFormatada}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="info-value">${statusText}</span>
                </div>
                <div class="info-item" style="grid-column: 1 / -1;">
                    <span class="info-label">Cliente</span>
                    <span class="info-value">${data.cabececalho[0].nome_cliente}</span>
                </div>
            </div>

            <div class="items-table-wrapper">
                <table class="premium-table">
                    <thead>
                        <tr>
                          <th>Cód. Item</th>
                          <th>Quantidade</th>
                          <th>Vlr. Total</th>
                        </tr>
                    </thead>
                    <tbody>
                     ${list.join("")}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="modal-foot">
            <span class="total-label">Total Gasto</span>
            <span class="total-value">${vlr_total}</span>
        </div>
    </div>
  `;
  
  $("#visualizacao").html(htmlInner);
  // Garante reflow pra aplicar a transição css
  void document.getElementById("visualizacao").offsetWidth;
  $("#visualizacao").addClass("active-view");
}

function closeModalView() {
  $("#visualizacao").removeClass("active-view");
  setTimeout(() => {
    $("#visualizacao").empty();
  }, 300);
}

function gerarPdf(numPedido) {
  const link = document.createElement('a');
  link.href = `${url_base}api/v1/print/pedidos-individual/${localStorage.getItem("id")}/${numPedido}`;
  link.download = "relatorio_pedidos.pdf";
  link.target = '_blank';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link)
}

/* Lógica de Pesquisa de Pedidos */
document.getElementById('searchInput')?.addEventListener('input', function(e) {
  const term = e.target.value.toLowerCase();
  const cards = document.querySelectorAll('.pedido-card');
  let hasVisible = false;

  cards.forEach(card => {
      // Procura dentro de todo o texto do card
      const text = card.textContent.toLowerCase();
      if (text.includes(term)) {
          card.style.display = 'flex';
          hasVisible = true;
      } else {
          card.style.display = 'none';
      }
  });

  // Mostrar mensagem se nada for encontrado
  const isExistingEmptyMsg = document.querySelector('.temp-empty-msg');
  if (!hasVisible && cards.length > 0) {
      if (!isExistingEmptyMsg) {
          $("#list-order").append(`
              <div class="pedidos-empty temp-empty-msg" style="grid-column: 1 / -1; width: 100%;">
                  <i class="bi bi-search"></i>
                  <p>Nenhum resultado para "<b>${e.target.value}</b>"</p>
              </div>
          `);
      } else {
          isExistingEmptyMsg.querySelector('p').innerHTML = `Nenhum resultado para "<b>${e.target.value}</b>"`;
      }
  } else {
      $('.temp-empty-msg').remove();
  }
});
