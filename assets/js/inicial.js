document.addEventListener("DOMContentLoaded", () => {
  setTimeout(function () {
    let LocalStorageGetName = localStorage.getItem("usuario");
    let User = $("#userName");
    User.text(LocalStorageGetName);
    verificarLogin();
    const menuLateral = document.getElementById("menuLateral");
    const menuButton = document.getElementById("menu-lateral");
    const fecharMenu = document.getElementById("fecharMenu");
    const overlay = document.getElementById("overlay");

    if (menuButton) {
      menuButton.addEventListener("click", function () {
        menuLateral.classList.add("aberto");
        overlay.classList.add("ativo");
      });
    }

    if (fecharMenu) {
      fecharMenu.addEventListener("click", function () {
        menuLateral.classList.remove("aberto");
        overlay.classList.remove("ativo");
      });
    }

    if (overlay) {
      overlay.addEventListener("click", function () {
        menuLateral.classList.remove("aberto");
        overlay.classList.remove("ativo");
      });
    }

    let userName = document.getElementById("userName");
    let UserNamer = localStorage.getItem("usuario");
    if (userName) {
      userName.textContent = UserNamer;
    }
  }, 10);
});
let ApiURL = "http://localhost:5000/api/v1/products"; 
async function getItensAPI(ApiURL) {
  try {
    const response = await fetch(ApiURL);
    const data =  await response.json();
    if (data.length > 0) {
      let cards = $("#listaProdutos");
      cards.html("")
      for (let x = 0; x < data.length; x++) {
        cards.append(`
          <ul class="lista-produtos">
            <li class="card-produto">
                <img src="${data[x].ia_imagenslink}" alt="imagem do produto">
                <div class="card-conteudo">
                    <h2 class="card-titulo">${data[x].ia_nomeproduto}</h2>
                    <p class="card-descricao">${data[x].ia_descricaoproduto}</p>
                    <div class="card-categoria">Categoria: ${data[x].ia_grupoproduto}</div>
                    <div class="card-estoque">Estoque: ${data[x].ia_quantidadeproduto} unidades</div>
                    <div class="card-preco">R$ ${data[x].ia_valor}</div>
                    <div class="interacoes d-flex gap-1">
                        <a href="#" class="btn btn-primary"><i class="bi bi-eye-fill"></i></a>
                        <a href="#" class="btn btn-danger"><i class="bi bi-trash-fill"></i></a>
                        <a href="#" class="btn btn-warning"><i class="bi bi-pencil-fill"></i></a>
                    </div>
                </div>
            </li>
          </ul>
        `);
      }
    } else {
      cards.html(`
        <ul class="lista-produtos">
          <li class="card-produto">
              <div class="card-conteudo">
                  <h2 class="card-titulo">Nenhum produto encontrado</h2>
              </div>
          </li>
        </ul>
      `);
    }
  } catch (erro) {
    console.log(erro);
  }
}
getItensAPI(ApiURL);
