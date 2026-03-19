/* assets/js/listarCompras.js */
const url_base =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost/"
    : "https://trabalhofcdd-backend.onrender.com/";

document.addEventListener("DOMContentLoaded", async () => {
  let user = localStorage.getItem("usuario");
  if (document.getElementById("user")) {
    document.getElementById("user").innerHTML = user;
  }
  await getCompras();
});

async function getCompras() {
  // Exibe overlay de carregamento se existir
  const overlay = document.querySelector(".overlay-carregamento");
  if (overlay) overlay.classList.add("active");

  try {
    const response = await fetch(`${url_base}api/v1/compras`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });
    const data = await response.json();

    if (overlay) overlay.classList.remove("active");

    if (data && data.response && data.output) {
      renderList(data.output);
    } else {
      renderList([]);
    }
  } catch (e) {
    if (overlay) overlay.classList.remove("active");
    console.error("Erro ao buscar compras", e);
    renderList([]); // Renderiza vazio em caso de erro
  }
}

function renderList(compras) {
  const listContainer = document.getElementById("listaCompras");
  listContainer.innerHTML = "";

  if (!compras || compras.length < 1) {
    listContainer.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5">
                    <i class="bi bi-inbox fs-1 text-muted"></i>
                    <h5 class="mt-3 text-muted">Nenhuma compra encontrada no histórico.</h5>
                </td>
            </tr>
        `;
    return;
  }

  compras.forEach((compra) => {
    let buttons = [];
    let badgeClass = "";
    let statusText = "";

    if (compra.f_cancelado) {
      buttons.push(
        `<button title="Visualizar compra" onclick="visualizarCompra(${compra.id})" class="btn-icon-premium btn-view ms-1"><i class="bi bi-eye"></i></button>`,
      );
      badgeClass = "status-cancelado";
      statusText = "Cancelado";
    } else if (compra.f_fechamento) {
      buttons.push(
        `<button title="Visualizar compra" onclick="visualizarCompra(${compra.id})" class="btn-icon-premium btn-view ms-1"><i class="bi bi-eye"></i></button>`,
      );
      badgeClass = "status-finalizado";
      statusText = "Finalizado";
    } else {
      buttons.push(
        `<button title="Cancelar compra" onclick="cancelarCompra(${compra.id})" class="btn-icon-premium btn-cancel ms-1"><i class="bi bi-x-lg"></i></button>`,
      );
      buttons.push(
        `<button title="Visualizar compra" onclick="visualizarCompra(${compra.id})" class="btn-icon-premium btn-view ms-1"><i class="bi bi-eye"></i></button>`,
      );
      buttons.push(
        `<button title="Dar entrada no estoque (Finalizar recebimento)" onclick="entradaEstoqueCompra(${compra.id})" class="btn-icon-premium ms-1" style="background-color: #e3f2fd; color: #0288d1; border: none; border-radius: 10px; width: 38px; height: 38px; transition: all 0.2s ease;"><i class="bi bi-box-seam"></i></button>`,
      );
      buttons.push(
        `<button title="Fechar compra" onclick="finalizarCompraItem(${compra.id})" class="btn-icon-premium btn-finish ms-1"><i class="bi bi-check-lg"></i></button>`,
      );
      badgeClass = "status-aguardando";
      statusText = "Aguardando";
    }

    let html = `
            <tr class="compra-row" data-search="${compra.produto.toLowerCase()} ${compra.comprador.toLowerCase()}">
                <td class="ps-4 fw-bold text-secondary">#${compra.id}</td>
                <td class="fw-semibold text-dark">${compra.produto}</td>
                <td><span class="badge bg-light text-dark border px-2 py-1">${compra.quantidade} un</span></td>
                <td>${compra.comprador}</td>
                <td><span class="pedido-status ${badgeClass} m-0">${statusText}</span></td>
                <td class="text-end pe-4 align-middle">
                    <div class="d-flex justify-content-end align-items-center">${buttons.join("")}</div>
                </td>
            </tr>
        `;

    listContainer.insertAdjacentHTML("beforeend", html);
  });
}

window.visualizarCompra = async function (id) {
  try {
    const response = await fetch(`${url_base}api/v1/compras`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
      },
    });
    const data = await response.json();

    if (!data.output) return;
    const compra = data.output.find((c) => c.id === id);
    if (!compra) return;

    // Atualiza como visualizado na API silenciosamente (seinda n foi visualizado)
    if (!compra.f_visualizado) {
      const userName = localStorage.getItem("usuario") || "Anônimo";
      fetch(`${url_base}api/v1/compras/update/visualization/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
        body: JSON.stringify({ name: userName }),
      }).catch((e) => console.error(e));
    }

    let statusText = "Aguardando";
    if (compra.f_fechamento) statusText = "Finalizado";
    if (compra.f_cancelado) statusText = "Cancelado";

    const dataFormatada = new Date(compra.dt_cadastro).toLocaleDateString(
      "pt-BR",
    );

    let htmlInner = `
        <div class="premium-modal-content">
            <div class="modal-head">
                <h3><i class="bi bi-receipt"></i> Detalhes da Compra #${compra.id}</h3>
                <button onclick="closeModalView()" class="btn-close-modal"><i class="bi bi-x-lg"></i></button>
            </div>
            
            <div class="modal-body-scroll">
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Data</span>
                        <span class="info-value">${dataFormatada}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status</span>
                        <span class="info-value">${statusText}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Comprador</span>
                        <span class="info-value">${compra.comprador}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Fornecedor ID</span>
                        <span class="info-value">${compra.fornecedor}</span>
                    </div>
                </div>

                <div class="items-table-wrapper">
                    <table class="premium-table">
                        <thead>
                            <tr>
                            <th>Produto</th>
                            <th>Cód. Produto</th>
                            <th>Quantidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${compra.produto}</td>
                                <td>#${compra.cd_produto}</td>
                                <td>${compra.quantidade} un</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-foot">
                <span class="total-label">Auditoria</span>
                <span class="total-value" style="font-size: 1.2rem; color: #6c757d;">${compra.auditoria || "Nenhuma"}</span>
            </div>
        </div>
      `;

    const visualizacao = document.getElementById("visualizacao");
    visualizacao.innerHTML = htmlInner;
    void visualizacao.offsetWidth;
    visualizacao.classList.add("active-view");
  } catch (e) {
    console.error(e);
    Swal.fire(
      "Erro",
      "Não foi possível carregar os detalhes da compra.",
      "error",
    );
  }
};

window.closeModalView = function () {
  const visualizacao = document.getElementById("visualizacao");
  visualizacao.classList.remove("active-view");
  setTimeout(() => {
    visualizacao.innerHTML = "";
  }, 300);
};

// Requisitando backend para fechar, cancelar e dar entrada no estoque
window.finalizarCompraItem = async function (id) {
  Swal.fire({
    title: "Confirmar fechamento?",
    text: "Deseja definitivamente fechar esta compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2e7d32",
    confirmButtonText: "Sim, fechar",
    cancelButtonText: "Sair",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const userName = localStorage.getItem("usuario") || "Anônimo";
        await fetch(`${url_base}api/v1/compras/update/close/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
          },
          body: JSON.stringify({ name: userName }),
        });
        Swal.fire("Fechado!", "A compra foi fechada.", "success").then(() => {
          location.reload();
        });
      } catch (e) {
        console.error(e);
        Swal.fire("Erro", "Ocorreu um problema ao fechar a compra.", "error");
      }
    }
  });
};

window.entradaEstoqueCompra = async function (id) {
  Swal.fire({
    title: "Dar entrada no estoque?",
    text: "Deseja confirmar o recebimento e dar entrada desta compra no estoque?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#0288d1",
    confirmButtonText: "Sim, dar entrada",
    cancelButtonText: "Sair",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const overlay = document.querySelector(".overlay-carregamento");
      if (overlay) overlay.classList.add("active");

      try {
        const response = await fetch(`${url_base}api/v1/compras/input`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
          },
          body: JSON.stringify({ id: id,name: localStorage.getItem('usuario') }),
        });
        
        const data = await response.json();

        if (overlay) overlay.classList.remove("active");

        if (data.response) {
          Swal.fire(
            "Sucesso!",
            data.output || "A entrada no estoque foi realizada.",
            "success",
          ).then(() => {
            location.reload();
          });
        } else {
          Swal.fire(
            "Erro",
            data.output || "Não foi possível dar entrada no estoque.",
            "error",
          );
        }
      } catch (e) {
        if (overlay) overlay.classList.remove("active");
        console.error(e);
        Swal.fire(
          "Erro",
          "Ocorreu um problema ao dar entrada na compra.",
          "error",
        );
      }
    }
  });
};

window.cancelarCompra = async function (id) {
  Swal.fire({
    title: "Confirmar cancelamento?",
    text: "Deseja cancelar esta compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#c62828",
    confirmButtonText: "Sim, cancelar",
    cancelButtonText: "Sair",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const userName = localStorage.getItem("usuario") || "Anônimo";
        await fetch(`${url_base}api/v1/compras/update/cancel/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
          },
          body: JSON.stringify({ name: userName }),
        });
        Swal.fire("Cancelado!", "A compra foi cancelada.", "success").then(
          () => {
            location.reload();
          },
        );
      } catch (e) {
        console.error(e);
        Swal.fire("Erro", "Ocorreu um problema ao cancelar a compra.", "error");
      }
    }
  });
};

// Lógica de pesquisa em tempo real
window.addEventListener("input", function (e) {
  if (e.target.id === "searchInput") {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll(".compra-row");
    let hasVisible = false;

    rows.forEach((row) => {
      const text = row.getAttribute("data-search");
      if (text.includes(term)) {
        row.style.display = "";
        hasVisible = true;
      } else {
        row.style.display = "none";
      }
    });

    const listContainer = document.getElementById("listaCompras");
    const isExistingEmptyMsg = document.querySelector(".temp-empty-msg");

    if (!hasVisible && rows.length > 0) {
      if (!isExistingEmptyMsg) {
        listContainer.insertAdjacentHTML(
          "beforeend",
          `
                  <tr class="temp-empty-msg">
                      <td colspan="6" class="text-center py-5">
                          <i class="bi bi-search fs-1 text-muted"></i>
                          <h5 class="mt-3 text-muted">Nenhum resultado para "${e.target.value}"</h5>
                      </td>
                  </tr>
              `,
        );
      } else {
        if (isExistingEmptyMsg.querySelector("h5")) {
          isExistingEmptyMsg.querySelector("h5").innerText =
            `Nenhum resultado para "${e.target.value}"`;
        }
      }
    } else {
      if (isExistingEmptyMsg) {
        isExistingEmptyMsg.remove();
      }
    }
  }
});
