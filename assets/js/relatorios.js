/**
 * 
 * Codigo criado por Gabriel de souza barros
 * 
 * @alias relatorys
 * 
 * @alias github https://github.com/Gabriel777uai/
 * Este codigo foi feito a algum tempo a suas funcoes estao bem separadas
 * 
 */

let url_base;

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("Testes em Desenvolvimento");
  url_base = "http://localhost:8000/api/v1/";
} else {
  console.log("Rodando em Produção");
  url_base = "https://trabalhofcdd-backend.onrender.com/api/v1/";
}
const usename = document.getElementById("user");
const user = localStorage.getItem("usuario");
if (usename && user) {
  usename.innerHTML = user;
}

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${url_base}relatorios/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });

    if (!response.ok)
      throw new Error(`Erro API ${endpoint}: ${response.status}`);
    const data = await response.json();
    console.log(`Dados recebidos de ${endpoint}:`, data);
    return data?.output || data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const dadosVendasMes = await fetchData("getVlrOrderForMonth");
  let totalVendasMes = 0;
  let seriesVendas = [];
  let categoriesVendas = [];

  if (dadosVendasMes && Array.isArray(dadosVendasMes)) {
    const nomesMeses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    const mesAtual = new Date().getMonth() + 1;

    dadosVendasMes.forEach((item) => {
      const numMes = parseInt(item.mes);
      const mesNome = nomesMeses[numMes - 1] || `Mês ${numMes}`;
      const valor = parseFloat(item.total || 0);

      categoriesVendas.push(mesNome);
      seriesVendas.push(parseFloat(valor.toFixed(2)));

      if (numMes === mesAtual) {
        totalVendasMes = valor;
      }
    });
    const traducao = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(totalVendasMes);

    document.getElementById("cardVendasMes").textContent = traducao;
  }

  const optionsVendas = {
    series: [
      { name: "Vendas em R$", data: seriesVendas.length ? seriesVendas : [0] },
    ],
    chart: {
      height: 350,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#1976d2"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: {
      categories: categoriesVendas.length ? categoriesVendas : ["Sem dados"],
    },
    tooltip: {
      y: {
        formatter: (val) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(val),
      },
    },
  };
  new ApexCharts(
    document.querySelector("#chartVendas"),
    optionsVendas,
  ).render();

  const dadosClientes = await fetchData("getClientesActives");

  let qtdClientes = 0;

  if (dadosClientes) {
    if (
      typeof dadosClientes === "object" &&
      dadosClientes.quantidade_clientes !== undefined
    ) {
      qtdClientes = dadosClientes.quantidade_clientes;
    } else if (Array.isArray(dadosClientes) && dadosClientes.length > 0) {
      qtdClientes =
        dadosClientes[0].total ||
        dadosClientes[0].count ||
        dadosClientes.length;
    } else if (
      typeof dadosClientes === "number" ||
      typeof dadosClientes === "string"
    ) {
      qtdClientes = dadosClientes;
    }
  }

  document.getElementById("cardClientesAtivos").textContent = qtdClientes;

  const dadosProdutos = await fetchData("getQuantTheProducts");

  let qtdProdutos = 0;

  if (dadosProdutos) {
    if (
      Array.isArray(dadosProdutos) &&
      dadosProdutos.length > 0 &&
      dadosProdutos[0].count !== undefined
    ) {
      qtdProdutos = dadosProdutos[0].count;
    } else if (Array.isArray(dadosProdutos)) {
      qtdProdutos = dadosProdutos[0]?.total || dadosProdutos.length;
    } else {
      qtdProdutos = dadosProdutos.total || dadosProdutos;
    }
  }
  document.getElementById("cardProdutosEstoque").textContent = qtdProdutos;

  const dadosPedidos = await fetchData("getOrdersOpens");

  let qtdPedidos = 0;

  if (dadosPedidos) {
    if (
      Array.isArray(dadosPedidos) &&
      dadosPedidos.length > 0 &&
      dadosPedidos[0].count !== undefined
    ) {
      qtdPedidos = dadosPedidos[0].count;
    } else if (Array.isArray(dadosPedidos)) {
      qtdPedidos = dadosPedidos[0]?.total || dadosPedidos.length;
    } else {
      qtdPedidos = dadosPedidos.total || dadosPedidos;
    }
  }
  document.getElementById("cardPedidosPendentes").textContent = qtdPedidos;

  const dadosCategorias = await fetchData("getProductsToGroup");
  let seriesCat = [];
  let labelsCat = [];

  if (dadosCategorias && Array.isArray(dadosCategorias)) {
    dadosCategorias.forEach((cat) => {
      const grupo = cat.c_grupo || cat.categoria || cat.nome || "Outros";
      const qtd = parseInt(
        cat.quantidade_itens || cat.quantidade || cat.total || 0,
      );

      labelsCat.push(grupo);
      seriesCat.push(qtd);
    });
  }

  const optionsCategorias = {
    series: seriesCat.length ? seriesCat : [1],
    labels: labelsCat.length ? labelsCat : ["Sem dados"],
    chart: { height: 350, type: "pie" },
    colors: ["#388e3c", "#f57c00", "#1976d2", "#7b1fa2", "#d32f2f"],
    responsive: [
      {
        breakpoint: 480,
        options: { chart: { width: 200 }, legend: { position: "bottom" } },
      },
    ],
  };
  new ApexCharts(
    document.querySelector("#chartCategorias"),
    optionsCategorias,
  ).render();

  const dadosVendedores = await fetchData("getVendedores");
  let seriesVend = [];
  let categoriesVend = [];

  if (dadosVendedores && Array.isArray(dadosVendedores)) {
    dadosVendedores.forEach((vend) => {
      const nome =
        vend.ia_nomeusuario || vend.nome_usuario || vend.vendedor || "User";
      const total = parseInt(
        vend.count || vend.total_vendas || vend.total || 0,
      );

      categoriesVend.push(nome);
      seriesVend.push(total);
    });
  }

  const optionsVendedores = {
    series: [{ name: "Vendas", data: seriesVend }],
    chart: { type: "bar", height: 350, toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: true } },
    dataLabels: { enabled: false },
    xaxis: { categories: categoriesVend },
    colors: ["#7b1fa2"],
  };
  new ApexCharts(
    document.querySelector("#chartVendedores"),
    optionsVendedores,
  ).render();
  const dadosTopCliente = await fetchData("getTopClientes");
  if (
    dadosTopCliente &&
    Array.isArray(dadosTopCliente) &&
    dadosTopCliente.length > 0
  ) {
    const top = dadosTopCliente[0];
    const nome = top.nome_cliente || "Sem dados";
    const total = parseFloat(top.vlr_total || 0);
    const pedidos = top.contagem_pedidos || 0;

    document.getElementById("nomeTopCliente").textContent = nome;

    const pTotal = document.getElementById("nomeTopCliente").nextElementSibling;
    if (pTotal) {
      pTotal.innerHTML = `Total: ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(total)} <br> <small>${pedidos} Pedidos</small>`;
    }
    const optionsTopCliente = {
      series: [100],
      chart: { height: 250, type: "radialBar" },
      plotOptions: {
        radialBar: {
          hollow: { size: "70%" },
          dataLabels: {
            name: { show: false },
            value: {
              fontSize: "22px",
              show: true,
              formatter: function (val) {
                return pedidos + " Ped.";
              },
            },
          },
        },
      },
      labels: ["Campeão"],
      colors: ["#1976d2"],
    };

    const chartDiv = document.querySelector("#chartTopCliente");
    chartDiv.innerHTML = "";
    new ApexCharts(chartDiv, optionsTopCliente).render();
  } else {
    const optionsTopCliente = {
      series: [0],
      chart: { height: 250, type: "radialBar" },
      plotOptions: { radialBar: { hollow: { size: "70%" } } },
      labels: ["Sem dados"],
      colors: ["#1976d2"],
    };
    new ApexCharts(
      document.querySelector("#chartTopCliente"),
      optionsTopCliente,
    ).render();
  }
  const optionsUsuarioAtividade = {
    series: [
      { name: "Itens", type: "column", data: [0] },
      { name: "Valor", type: "line", data: [0] },
    ],
    chart: { height: 350, type: "line", toolbar: { show: false } },
    stroke: { width: [0, 4] },
    labels: ["Sem dados"],
    yaxis: [
      { title: { text: "Quantidade" } },
      { opposite: true, title: { text: "Valor" } },
    ],
    colors: ["#388e3c", "#f57c00"],
  };
  new ApexCharts(
    document.querySelector("#chartUsuarioAtividade"),
    optionsUsuarioAtividade,
  ).render();
});

function gerarRelatorio(tipo) {
  Swal.fire({
    icon: "info",
    title: "Gerando Relatório",
    text: `Gerando Relatório de ${nomes[tipo]}... Aguarde!`,
    confirmButtonColor: "#4a90e2",
  });
  window.location.href = `${url_base}print/${tipo}/${localStorage.getItem("id")}`;
  return;
}
