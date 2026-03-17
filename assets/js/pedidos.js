let nameUser = localStorage.getItem("usuario");
document.getElementById("user").innerHTML = nameUser;

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

function renderList(data) {
  if (data.length < 1) {
    $("#list-order").append(
      "<p class='ms-3'>Sem pedidos para este Usuario...</p>",
    );
    return;
  }
  data.forEach((items) => {
    let Arraybuttons = {
      visualizar: `<a title="visualuzar pedido" href="#" onclick="visualizarPedido(${items.codigo_compra})" class="btn btn-primary m-1"><i class="bi bi-eye"></i></a>`,
      pdf: `<a title="Gerar arquivo pdf pedido" href="#" onclick="gerarPdf(${items.codigo_compra})" class="btn btn-secondary m-1"><i class="bi bi-filetype-pdf"></i></a>`,
      cancelar: `<a title="Cacelar pedido" href="#" onclick="cancelarPedido(${items.codigo_compra})" class="btn btn-danger m-1"><i class="bi bi-x"></i></a>`,
      fechar: `<a title="Fibalizar pedido" href="#" onclick="finalizarPedido(${items.codigo_compra})" class="btn btn-success m-1"><i class="bi bi-check"></i></a>`,
    };
    let buttons = [];
    let classe;
    let color;
    let text;
    if (items.f_fechado == "S") {
      buttons = [];
      buttons.push(Arraybuttons.pdf);
      buttons.push(Arraybuttons.visualizar);
      classe = "bi bi-bag-check";
      color = "green";
      text = "Finalizado";
    } else {
      buttons = [];
      buttons.push(Arraybuttons.cancelar);
      buttons.push(Arraybuttons.pdf);
      buttons.push(Arraybuttons.visualizar);
      buttons.push(Arraybuttons.fechar);
      classe = "bi bi-info-lg";
      color = "#e9dc2aff";
      text = "Aguardando";
    }
    if (items.f_cancelado == "S") {
      buttons = [];
      buttons.push(Arraybuttons.pdf);
      buttons.push(Arraybuttons.visualizar);
      classe = "bi bi-exclamation-octagon";
      color = "red";
      text = "Cancelado";
    }

    const convertBrl = new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    }).format(items.vlr_total);

    let html = `
        <div class="card text-start m-3">
            <div class="card-header">
                ${text} <span style="color: ${color};"><i class="${classe}"></i></span>
            </div>
            <div class="card-body">
                <h5 class="card-title">${items.nome_cliente}</h5>
                <div class="card"></div>
                <span>pedido ${items.codigo_compra}</span>
                <div class="d-flex flex-wrap align-items-center justify-content-end">
                    ${buttons.join("")}
                </div>
            </div>
            <div class="card-footer text-body-secondary">
                Valor ${convertBrl}
            </div>
        </div>
        
        `;
    console.log(items.codigo_compra);

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
    list.push(
      `<tr><th scope="row">${items.codigo_item}</th><td>${items.nr_quantidade}</td><td>${items.vlr_item_final}</td><td>@mdo</td></tr>`,
    );
  });

  const dataFormatada = new Date(
    data.cabececalho[0].d_cadastro,
  ).toLocaleDateString("pt-BR");
  console.log(list);

  html = `
    <div class="modal-xl">
        <div class="text-end">
            <button onclick="closeModalView()" class="btn p-0">X</button>
        </div>
        <span>Data cadastro: ${dataFormatada}</span>
        <article class="dados-pedido">
            <p>Numero pedido: ${data.cabececalho[0].codigo_compra}</p>
            <p>fechado: ${data.cabececalho[0].f_fechado}</p>
            <p>Nome cliente: ${data.cabececalho[0].nome_cliente}</p>
            <p>cancelado: ${data.cabececalho[0].f_cancelado}</p>
        </article>
        <article class="tabela-itens">
            <table class="table">
                <thead>
                    <tr >
                        <th class="fixed" scope="col">Codigo item</th>
                        <th class="fixed" scope="col">quantidade</th>
                        <th class="fixed" scope="col">Valor item total</th>
                        <th class="fixed" scope="col">Handle</th>
                    </tr>
                </thead>
                <tbody class="overflow-list">
                 ${list.join("")}
                </tbody>
            </table>
        </article>
        <span class="mt-1">Total pedido: ${vlr_total}</span>
    </div>
    `;
  $("#visualizacao").html(html);
  setTimeout(() => {
    $(".modal-xl").addClass("active-view");
    console.log("add");
  }, 100);
}

function closeModalView() {
  document.querySelector(".modal-xl").classList.remove("active-view");
  setTimeout(() => {
    document.querySelector(".modal-xl").remove();
  }, 2000);
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
