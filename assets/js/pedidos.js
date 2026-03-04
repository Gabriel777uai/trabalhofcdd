let nameUser = localStorage.getItem('usuario');
document.getElementById('user').innerHTML = nameUser;

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
    data.forEach(items => {
        let Arraybuttons = {
            visualizar: `<a title="visualuzar pedido" href="#" onclick="vesualizarPedido(${items.codigo_compra})" class="btn btn-primary m-1"><i class="bi bi-eye"></i></a>`,
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
            buttons.push(Arraybuttons.cancelar)
            buttons.push(Arraybuttons.pdf)
            buttons.push(Arraybuttons.visualizar)
            buttons.push(Arraybuttons.fechar)
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

        const convertBrl = new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: "BRL"
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
                    ${buttons.join('')}
                </div>
            </div>
            <div class="card-footer text-body-secondary">
                Valor ${convertBrl}
            </div>
        </div>
        
        `;
        console.log(items.codigo_compra)
        
        $("#list-order").append(html);
    });
}
    
async function getPedidos(baseUrl, id) {
    try {
        const reponse = await fetch(`${baseUrl}api/v1/getpedidosforuser/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
            }
        }) 
        const data = await reponse.json();
        console.log(data)

        renderList(data);

    }catch (err) {
        console.error("erro ao fazer a requisição")
    }
}

getPedidos(url_base, 1);