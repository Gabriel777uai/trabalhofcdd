let usename = document.getElementById("user");
let user = localStorage.getItem("usuario");
if (usename && user) {
  usename.innerHTML = user;
}

document.addEventListener("DOMContentLoaded", function () {
  // 1. Gráfico de Vendas Anual (Area Chart)
  const optionsVendas = {
    series: [
      {
        name: "Vendas em R$",
        data: [
          12000, 15000, 11000, 18000, 22000, 19000, 25000, 28000, 21000, 18000,
          24000, 30000,
        ],
      },
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
      categories: [
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
      ],
    },
    tooltip: {
      y: { format: "R$ #,###" },
    },
  };

  const chartVendas = new ApexCharts(
    document.querySelector("#chartVendas"),
    optionsVendas,
  );
  chartVendas.render();

  // 2. Gráfico de Distribuição por Categoria (Pie Chart)
  const optionsCategorias = {
    series: [44, 33, 23],
    chart: {
      height: 350,
      type: "pie",
    },
    labels: ["Ferramentas", "Moto Peças", "Automotivos"],
    colors: ["#388e3c", "#f57c00", "#1976d2"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  const chartCategorias = new ApexCharts(
    document.querySelector("#chartCategorias"),
    optionsCategorias,
  );
  chartCategorias.render();

  // 3. Performance de Vendedores (Bar Chart)
  const optionsVendedores = {
    series: [
      {
        name: "Vendas (Milhares)",
        data: [44, 55, 41, 64, 22],
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Matheus", "Diego", "Pedro", "Gabriel Souza", "Alexandre"],
    },
    colors: ["#7b1fa2"],
  };

  const chartVendedores = new ApexCharts(
    document.querySelector("#chartVendedores"),
    optionsVendedores,
  );
  chartVendedores.render();

  // 4. Atividade de Usuários (Mixed Chart - Column & Line)
  const optionsUsuarioAtividade = {
    series: [
      {
        name: "Itens Comprados",
        type: "column",
        data: [23, 11, 22, 27, 13],
      },
      {
        name: "Valor Gasto (R$)",
        type: "line",
        data: [440, 550, 410, 670, 220],
      },
    ],
    chart: {
      height: 350,
      type: "line",
      toolbar: { show: false },
    },
    stroke: { width: [0, 4] },
    labels: ["User1", "User2", "User3", "User4", "User5"],
    yaxis: [
      {
        title: { text: "Quantidade" },
      },
      {
        opposite: true,
        title: { text: "Valor (R$)" },
      },
    ],
    colors: ["#388e3c", "#f57c00"],
  };

  const chartUsuarioAtividade = new ApexCharts(
    document.querySelector("#chartUsuarioAtividade"),
    optionsUsuarioAtividade,
  );
  chartUsuarioAtividade.render();

  // 5. Top Cliente do Mês (Radial Bar)
  const optionsTopCliente = {
    series: [75],
    chart: {
      height: 250,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "70%" },
      },
    },
    labels: ["Meta Atingida"],
    colors: ["#1976d2"],
  };

  const chartTopCliente = new ApexCharts(
    document.querySelector("#chartTopCliente"),
    optionsTopCliente,
  );
  chartTopCliente.render();
});

// Função placeholder para botões de relatórios
function gerarRelatorio(tipo) {
  const nomes = {
    clientes: "Clientes",
    pedidos: "Pedidos",
    usuarios: "Usuários",
    estoque: "Baixo Estoque",
  };
  alert(
    `Gerando Relatório de ${nomes[tipo]}...\n(Aguardando integração com API para exportação de PDF/Excel)`,
  );
}
