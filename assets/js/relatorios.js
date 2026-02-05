const url_base = "https://trabalhofcdd-backend.onrender.com/api/v1/";

// Configuração de usuário
const usename = document.getElementById("user");
const user = localStorage.getItem("usuario");
if (usename && user) {
  usename.innerHTML = user;
}

// Helpers
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
    return data.output || data; // Tenta retornar output se existir, senão o próprio data
  } catch (error) {
    console.error(error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  // Inicialização dos Gráficos com dados vazios ou skeletons

  // 1. Vendas e Chart Vendas (Area)
  const dadosVendasMes = await fetchData("getVlrOrderForMonth");
  let totalVendasMes = 0;
  let seriesVendas = [];
  let categoriesVendas = [];

  if (dadosVendasMes && Array.isArray(dadosVendasMes)) {
    if (dadosVendasMes.length > 0 && dadosVendasMes[0].sum) {
      totalVendasMes = parseFloat(dadosVendasMes[0].sum);
      // Como só temos o total, adicionamos como um único ponto no gráfico por enquanto
      categoriesVendas.push("Mês Atual");
      seriesVendas.push(totalVendasMes);
    } else {
      // Caso 2: Lista de histórico de vendas
      dadosVendasMes.forEach((item) => {
        const mes = item.mes || item.month || "Mês";
        const valor = parseFloat(
          item.total_mes || item.valor || item.total || 0,
        );
        categoriesVendas.push(mes);
        seriesVendas.push(parseFloat(valor.toFixed(2)));
      });

      // Se temos histórico, assumimos que o valor do "Mês" no card é o último do gráfico
      if (seriesVendas.length > 0) {
        totalVendasMes = seriesVendas[seriesVendas.length - 1];
      }
    }

    document.getElementById("cardVendasMes").textContent =
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(totalVendasMes);
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
    tooltip: { y: { formatter: (val) => `R$ ${val}` } }, // Corrigido format
  };
  new ApexCharts(
    document.querySelector("#chartVendas"),
    optionsVendas,
  ).render();

  // 2. Clientes Ativos (Card + Potencial Gráfico)
  // 2. Clientes Ativos (Card + Potencial Gráfico)
  const dadosClientes = await fetchData("getClientesActives");

  let qtdClientes = 0;

  if (dadosClientes) {
    if (
      typeof dadosClientes === "object" &&
      dadosClientes.quantidade_clientes !== undefined
    ) {
      // Caso: {"quantidade_clientes": 2}
      qtdClientes = dadosClientes.quantidade_clientes;
    } else if (Array.isArray(dadosClientes) && dadosClientes.length > 0) {
      // Fallback para array [{ total: 10 }]
      qtdClientes =
        dadosClientes[0].total ||
        dadosClientes[0].count ||
        dadosClientes.length;
    } else if (
      typeof dadosClientes === "number" ||
      typeof dadosClientes === "string"
    ) {
      // Fallback para valor direto
      qtdClientes = dadosClientes;
    }
  }

  document.getElementById("cardClientesAtivos").textContent = qtdClientes;

  // 3. Produtos em Estoque (Card)
  const dadosProdutos = await fetchData("getQuantTheProducts");

  let qtdProdutos = 0;

  if (dadosProdutos) {
    if (
      Array.isArray(dadosProdutos) &&
      dadosProdutos.length > 0 &&
      dadosProdutos[0].count !== undefined
    ) {
      // Caso: [{"count": 79}]
      qtdProdutos = dadosProdutos[0].count;
    } else if (Array.isArray(dadosProdutos)) {
      // Fallback length ou total
      qtdProdutos = dadosProdutos[0]?.total || dadosProdutos.length;
    } else {
      // Objeto direto ou valor
      qtdProdutos = dadosProdutos.total || dadosProdutos;
    }
  }
  document.getElementById("cardProdutosEstoque").textContent = qtdProdutos;

  // 4. Pedidos Pendentes (Card)
  const dadosPedidos = await fetchData("getOrdersOpens");

  let qtdPedidos = 0;

  if (dadosPedidos) {
    if (
      Array.isArray(dadosPedidos) &&
      dadosPedidos.length > 0 &&
      dadosPedidos[0].count !== undefined
    ) {
      // Caso: [{"count": 0}]
      qtdPedidos = dadosPedidos[0].count;
    } else if (Array.isArray(dadosPedidos)) {
      qtdPedidos = dadosPedidos[0]?.total || dadosPedidos.length;
    } else {
      qtdPedidos = dadosPedidos.total || dadosPedidos;
    }
  }
  document.getElementById("cardPedidosPendentes").textContent = qtdPedidos;

  // 5. Categorias (Pie Chart)
  const dadosCategorias = await fetchData("getProductsToGroup");
  let seriesCat = [];
  let labelsCat = [];

  if (dadosCategorias && Array.isArray(dadosCategorias)) {
    dadosCategorias.forEach((cat) => {
      // Formato: {"quantidade_itens": 50, "c_grupo": "SEM GRUPO"}
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

  // 6. Vendedores (Bar Chart)
  const dadosVendedores = await fetchData("getVendedores");
  let seriesVend = [];
  let categoriesVend = [];

  if (dadosVendedores && Array.isArray(dadosVendedores)) {
    dadosVendedores.forEach((vend) => {
      // Formato: {"count": 4, "ia_nomeusuario": "GABRIEL"}
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

  const optionsTopCliente = {
    series: [75], // Placeholder
    chart: { height: 250, type: "radialBar" },
    plotOptions: { radialBar: { hollow: { size: "70%" } } },
    labels: ["Meta Atingida"],
    colors: ["#1976d2"],
  };
  new ApexCharts(
    document.querySelector("#chartTopCliente"),
    optionsTopCliente,
  ).render();
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

// Botões
function gerarRelatorio(tipo) {
  const nomes = {
    clientes: "Clientes",
    pedidos: "Pedidos",
    usuarios: "Usuários",
    estoque: "Baixo Estoque",
  };
  alert(
    `Gerando Relatório de ${nomes[tipo]}...\n(Funcionalidade futura via PDF/Excel)`,
  );
}
