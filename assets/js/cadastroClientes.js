let url_base;
if (window.location.hostname === "localhost"  || "127.0.0.1") {
  console.log('Testes em Desenvolvimento');
  url_base = "http://localhost:8000/";
} else {
  console.log('Rodando emProdução');
  url_base = "https://trabalhofcdd-backend.onrender.com/";
}

document.addEventListener("DOMContentLoaded", () => {
  let usename = document.getElementById("user");
  let user = localStorage.getItem("usuario");
  if (usename && user) {
    usename.innerHTML = user;
  }
  const radioFisica = document.getElementById("tipoFisica");
  const radioJuridica = document.getElementById("tipoJuridica");
  const divCpf = document.getElementById("divCpf");
  const divCnpj = document.getElementById("divCnpj");
  const divNascimento = document.getElementById("divNascimento");
  const divRazao = document.getElementById("divRazao");
  const lblNome = document.getElementById("lblNome");

  function toggleTipo() {
    if (radioFisica.checked) {
      divCpf.classList.remove("d-none");
      divCnpj.classList.add("d-none");
      divNascimento.classList.remove("d-none");
      divRazao.classList.add("d-none");
      lblNome.textContent = "Nome Completo";
      document.getElementById("cpf").required = true;
      document.getElementById("cnpj").required = false;
    } else {
      divCpf.classList.add("d-none");
      divCnpj.classList.remove("d-none");
      divNascimento.classList.add("d-none");
      divRazao.classList.remove("d-none");
      lblNome.textContent = "Nome Fantasia";
      document.getElementById("cpf").required = false;
      document.getElementById("cnpj").required = true;
    }
  }

  if (radioFisica && radioJuridica) {
    radioFisica.addEventListener("change", toggleTipo);
    radioJuridica.addEventListener("change", toggleTipo);
    toggleTipo();
  }

  const btnBuscarCnpj = document.getElementById("btnBuscarCnpj");
  const inputCnpj = document.getElementById("cnpj");

  if (btnBuscarCnpj) {
    btnBuscarCnpj.addEventListener("click", async () => {
      let cnpj = inputCnpj.value.replace(/\D/g, "");
      if (cnpj.length !== 14) {
        alert(
          "CNPJ inválido. Digite apenas números ou verifique a quantidade de dígitos.",
        );
        return;
      }

      btnBuscarCnpj.disabled = true;
      btnBuscarCnpj.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';

      try {
        const response = await fetch(`https://open.cnpja.com/office/${cnpj}`);
        if (!response.ok) throw new Error("Erro na consulta do CNPJ");

        const data = await response.json();

        if (data.company && data.company.name) {
          document.getElementById("razao").value = data.company.name;
          document.getElementById("nome").value =
            data.alias || data.company.name;
        }

        if (data.address) {
          const street = data.address.street || "";
          const number = data.address.number || "";
          const district = data.address.district || "";

          document.getElementById("endereco").value = `${street}`;
          document.getElementById("numeroEnd").value = number;
          document.getElementById("bairro").value = district;

          document.getElementById("cidade").value = data.address.city || "";
          document.getElementById("estado").value = data.address.state || "";
        }

        if (data.mainActivity && data.mainActivity.text) {
          document.getElementById("seguimento").value = data.mainActivity.text;
        } else {
          document.getElementById("seguimento").value = "";
        }
      } catch (error) {
        console.error("Erro busca CNPJ:", error);
        alert("Erro ao buscar dados do CNPJ. Preencha manualmente.");
      } finally {
        btnBuscarCnpj.disabled = false;
        btnBuscarCnpj.innerHTML = '<i class="bi bi-search"></i> Buscar';
      }
    });
  }

  const form = document.getElementById("formCadastroCliente");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const isJuridica = radioJuridica.checked;

      const telefone = document
        .getElementById("telefone")
        .value.replace(/\D/g, "");
      const email = document.getElementById("email").value;

      const endRua = document.getElementById("endereco").value;
      const endNum = document.getElementById("numeroEnd").value;
      const endBairro = document.getElementById("bairro").value;
      const endCidade = document.getElementById("cidade").value;
      const endUf = document.getElementById("estado").value;

      const enderecoCompleto = `${endRua}, ${endNum} - ${endBairro}`;

      const seguimento = document.getElementById("seguimento").value;

      const userId = parseInt(localStorage.getItem("id")) || 1;
      const userName = localStorage.getItem("usuario") || "Sistema";

      let payload = {};

      if (isJuridica) {
        const cnpjLimpo = document
          .getElementById("cnpj")
          .value.replace(/\D/g, "");

        payload = {
          cod_cnpj: parseInt(cnpjLimpo),
          cod_cpf: 0,
          nome_razao: document.getElementById("razao").value,
          nome_cliente: document.getElementById("nome").value,
          cod_user_cadastro: userId,
          inscricao_est: 0,
          nome_user_cadastrante: userName,
          nr_contato: parseInt(telefone) || 0,
          email: email,
          endereco: enderecoCompleto,
          estado: endUf,
          cidade: endCidade,
          tx_seguimento: seguimento,
          suframa: 0,
          data_nasc: "",
        };
      } else {
        const cpfLimpo = document
          .getElementById("cpf")
          .value.replace(/\D/g, "");

        payload = {
          cod_cnpj: 0,
          cod_cpf: parseInt(cpfLimpo),
          nome_razao: "",
          nome_cliente: document.getElementById("nome").value,
          cod_user_cadastro: userId,
          inscricao_est: 0,
          nome_user_cadastrante: userName,
          nr_contato: parseInt(telefone) || 0,
          email: email,
          endereco: enderecoCompleto,
          estado: endUf,
          cidade: endCidade,
          tx_seguimento: seguimento || "Comprador final",
          suframa: 0,
          data_nasc: document.getElementById("dataNasc").value,
        };
      }

      console.log("Payload:", payload);

      try {
        const response = await fetch(`${url_base}api/v1/createclientes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.output);
          form.reset();
          if (toggleTipo) toggleTipo();
        } else {
          console.error("Erro na resposta:", result);
          alert(
            "Erro ao cadastrar: " +
              (result.output || result.message || "Erro desconhecido"),
          );
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro na comunicação com o servidor.");
      }
    });
  }

  // --- CLIENT LIST & SEARCH LOGIC ---

  const offcanvasClientes = document.getElementById("offcanvasClientes");
  const listaClientesContainer = document.getElementById(
    "listaClientesContainer",
  );
  const inputBuscaCliente = document.getElementById("inputBuscaCliente");
  const btnBuscaCliente = document.getElementById("btnBuscaCliente");

  // Load clients when Offcanvas opens
  if (offcanvasClientes) {
    offcanvasClientes.addEventListener("show.bs.offcanvas", () => {
      fetchClients();
    });
  }

  async function fetchClients() {
    if (!listaClientesContainer) return;
    listaClientesContainer.innerHTML =
      '<div class="text-center p-3 text-muted"><span class="spinner-border spinner-border-sm"></span> Carregando...</div>';
    try {
      const response = await fetch(`${url_base}api/v1/getclients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar clientes");

      const data = await response.json();
      renderClients(data);
    } catch (error) {
      console.error("Erro fetchClients:", error);
      listaClientesContainer.innerHTML =
        '<div class="text-center p-3 text-danger">Erro ao carregar clientes.</div>';
    }
  }
  inputBuscaCliente.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
            const term = inputBuscaCliente.value.trim();
      if (!term) {
        fetchClients(); // Reload all if empty
        return;
      }

      listaClientesContainer.innerHTML =
        '<div class="text-center p-3 text-muted"><span class="spinner-border spinner-border-sm"></span> Buscando...</div>';

      try {
        const userId = localStorage.getItem("id") || 1;
        const response = await fetch(
          `${url_base}api/v1/searchclients/${term}/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
            },
          },
        );

        if (!response.ok) throw new Error("Erro na busca");

        const data = await response.json();
        renderClients(data);
      } catch (error) {
        console.error("Erro searchClients:", error);
        listaClientesContainer.innerHTML =
          '<div class="text-center p-3 text-danger">Erro na busca.</div>';
      }
    }
  });

  // Search logic
  if (btnBuscaCliente) {
    btnBuscaCliente.addEventListener("click", async () => {
      const term = inputBuscaCliente.value.trim();
      if (!term) {
        fetchClients(); // Reload all if empty
        return;
      }

      listaClientesContainer.innerHTML =
        '<div class="text-center p-3 text-muted"><span class="spinner-border spinner-border-sm"></span> Buscando...</div>';

      try {
        const userId = localStorage.getItem("id") || 1;
        const response = await fetch(
          `${url_base}api/v1/searchclients/${term}/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("acessToken")}`,
            },
          },
        );

        if (!response.ok) throw new Error("Erro na busca");

        const data = await response.json();
        renderClients(data);
      } catch (error) {
        console.error("Erro searchClients:", error);
        listaClientesContainer.innerHTML =
          '<div class="text-center p-3 text-danger">Erro na busca.</div>';
      }
    });
  }

  function renderClients(clients) {
    if (!listaClientesContainer) return;
    listaClientesContainer.innerHTML = "";

    const list = Array.isArray(clients) ? clients : clients.output || [];

    if (list.length === 0) {
      listaClientesContainer.innerHTML =
        '<div class="text-center p-3 text-muted">Nenhum cliente encontrado.</div>';
      return;
    }

    list.forEach((client) => {
      const displayName =
        client.nome_cliente || client.nome_razao || "Sem Nome";
      const doc =
        client.cod_cnpj && client.cod_cnpj !== "0"
          ? client.cod_cnpj
          : client.cod_cpf;

      const item = document.createElement("button");
      item.className = "list-group-item list-group-item-action";
      item.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${displayName}</h6>
                    <small class="text-muted">#${client.cod_cliente}</small>
                </div>
                <small class="text-muted d-block">${client.cidade || ""} - ${client.estado || ""}</small>
                <small class="text-muted">${doc || ""}</small>
            `;

      item.addEventListener("click", () => populateForm(client));
      listaClientesContainer.appendChild(item);
    });
  }

  function populateForm(client) {
    // Close offcanvas
    const offcanvasEl = document.getElementById("offcanvasClientes");
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (offcanvasInstance) offcanvasInstance.hide();

    const isCnpj =
      client.cod_cnpj && client.cod_cnpj !== "0" && client.cod_cnpj !== 0;

    if (isCnpj) {
      document.getElementById("tipoJuridica").checked = true;
      toggleTipo();
      document.getElementById("cnpj").value = client.cod_cnpj;
      document.getElementById("razao").value = client.nome_razao || "";
      document.getElementById("nome").value = client.nome_cliente || "";
    } else {
      document.getElementById("tipoFisica").checked = true;
      toggleTipo();
      document.getElementById("cpf").value = client.cod_cpf || "";
      document.getElementById("nome").value = client.nome_cliente || "";
      if (client.data_nasc)
        document.getElementById("dataNasc").value = client.data_nasc;
    }

    document.getElementById("email").value = client.email || "";
    document.getElementById("telefone").value = client.nr_contato || "";
    document.getElementById("seguimento").value = client.tx_seguimento || "";
    document.getElementById("endereco").value = client.endereco || "";
    // Campos que não vêm separados na API de getclients
    document.getElementById("numeroEnd").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("cidade").value = client.cidade || "";
    document.getElementById("estado").value = client.estado || "";

    document
      .getElementById("formCadastroCliente")
      .scrollIntoView({ behavior: "smooth" });
  }
});
