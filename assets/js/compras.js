document.addEventListener("DOMContentLoaded", async () => {
  let user = localStorage.getItem("usuario");
  if (document.getElementById("user")) {
    document.getElementById("user").innerHTML = user;
  }

  document.getElementById("dataCompra").valueAsDate = new Date();

  const url_base = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
    ? "http://localhost/" 
    : "https://trabalhofcdd-backend.onrender.com/";

  try {
    const userId = localStorage.getItem("id") || 1;
    const response = await fetch(`${url_base}api/v1/fornecedores/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`
      }
    });

    if (response.ok) {
        const fornecedores = await response.json();
        const selectFornecedor = document.getElementById("idFornecedor");
        selectFornecedor.innerHTML = '<option value="">Selecione um fornecedor</option>'; 
        
        fornecedores.forEach(f => {
          const optionText = f.fantasia ? f.fantasia : f.nome;
          selectFornecedor.innerHTML += `<option value="${f.cd_fornecedor}">${optionText} - ${f.cnpj}</option>`;
        });
    }

    new TomSelect("#idFornecedor", {
      create: false,
      sortField: { field: "text", direction: "asc" },
      placeholder: "Busque um fornecedor..."
    });

  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error);
  }
});

window.finalizarCompra = async function () {
  const produtoNome = document.getElementById("nomeProduto").value;
  const qtd = document.getElementById("qtdCompra").value;
  const fornecedorId = document.getElementById("idFornecedor").value;
  const cdProduto = document.getElementById("cdProduto").value;
  
  const compradorId = parseInt(localStorage.getItem("id"));
  const compradorNome = localStorage.getItem("usuario") || "Anônimo";

  if (!produtoNome || !qtd || !fornecedorId) {
    Swal.fire("Ops", "Preencha todos os campos obrigatórios (Fornecedor, Produto e Quantidade).", "warning");
    return;
  }

  const overlay = document.querySelector(".overlay-carregamento");
  if (overlay) overlay.classList.add("active");

  const url_base = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
    ? "http://localhost/" 
    : "https://trabalhofcdd-backend.onrender.com/";

  try {
    const payload = {
      comprador: compradorNome,
      produto: produtoNome,
      cd_comprador: compradorId,
      cd_produto: cdProduto,
      cd_fornecedor: parseInt(fornecedorId),
      quantidade: parseInt(qtd)
    };

    await fetch(`${url_base}api/v1/compras/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("acessToken")}`
      },
      body: JSON.stringify(payload)
    });

    if (overlay) overlay.classList.remove("active");
    Swal.fire("Sucesso", "Compra registrada com sucesso!", "success");
    
    // Reseta o formulário
    document.getElementById("formCompra").reset();
    document.getElementById("dataCompra").valueAsDate = new Date();
    
    // Reseta o TomSelect também
    const tomSelectInstance = document.getElementById("idFornecedor").tomselect;
    if (tomSelectInstance) {
        tomSelectInstance.clear();
    }

  } catch (error) {
    if (overlay) overlay.classList.remove("active");
    console.error("Erro ao registrar compra:", error);
    Swal.fire("Erro", "Ocorreu um problema ao enviar os dados para o servidor.", "error");
  }
};
