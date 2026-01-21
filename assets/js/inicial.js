let usename = document.getElementById("user");
let user = localStorage.getItem("usuario");
usename.innerHTML = user;

const API_BASE_URL = "http://localhost:8000/api/v1/products";

async function getDataApi(url) {
  const request = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("acessToken")}`
    }
  });
  const data = await request.json();

  let list = $("#listaProdutos");
  list.html("");
  for (let i = 0; i < data.length; i++) {
    list.append(`
    <div class="card h-100">
    <img src="${
      data[i].ia_imagenslink ||
      "https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-103.png?ssl=1"
    }" class="card-img-top" alt="${data[i].ia_nomeproduto}">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${data[i].ia_nomeproduto}</h5>
      <p class="card-text truncate">${data[i].ia_descricaoproduto || ""}</p>
      <p class="mt-auto"><small>Estoque: <strong>${
        data[i].ia_quantidadeproduto ?? 0
      }</strong></small></p>
      </div>
      <div class="card-footer d-flex gap-2">
      <button class="btn btn-sm btn-primary" data-id="${
        data[i].ia_idproduto
      }">Visualizar</button>
      <button class="btn btn-sm btn-warning" data-id="${
        data[i].ia_idproduto
      }">Editar</button>
      <button class="btn btn-sm btn-danger" data-id="${
        data[i].ia_idproduto
      }">Excluir</button>
      </div>
    </div>
    `);
  }
}
getDataApi(API_BASE_URL);

let search = document.getElementById("pesquisaProduto");
search.addEventListener('keyup', () => {
  let list = $('#listaProdutos')

  list.html('Pesquisando...')
})
search.addEventListener("keyup", async () => {
  let list = $("#listaProdutos");
  if (search.value.length > 0) {
    let pesquisaFeita = `${API_BASE_URL}/${search.value}`;
    const request = await fetch(pesquisaFeita, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("acessToken")}`
      }
    });
    const data = await request.json();

    list.html("");
    for (let i = 0; i < data.length; i++) {
      list.append(`
    <div class="card h-100">
    <img src="${
      data[i].ia_imagenslink ||
      "https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-103.png?ssl=1"
    }" class="card-img-top" alt="${data[i].ia_nomeproduto}">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${data[i].ia_nomeproduto}</h5>
      <p class="card-text truncate">${data[i].ia_descricaoproduto || ""}</p>
      <p class="mt-auto"><small>Estoque: <strong>${
        data[i].ia_quantidadeproduto ?? 0
      }</strong></small></p>
      </div>
      <div class="card-footer d-flex gap-2">
      <button class="btn btn-sm btn-primary" data-id="${
        data[i].ia_idproduto
      }">Visualizar</button>
      <button class="btn btn-sm btn-warning" data-id="${
        data[i].ia_idproduto
      }">Editar</button>
      <button class="btn btn-sm btn-danger" data-id="${
        data[i].ia_idproduto
      }">Excluir</button>
      </div>
    </div>
    `);
    }
  } else {
    let pesquisaFeita = `${API_BASE_URL}`;
    const request = await fetch(pesquisaFeita, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("acessToken")}`
      }
    });
    const data = await request.json();

    list.html("");
    for (let i = 0; i < data.length; i++) {
      list.append(`
    <div class="card h-100">
    <img src="${
      data[i].ia_imagenslink ||
      "https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder-103.png?ssl=1"
    }" class="card-img-top" alt="${data[i].ia_nomeproduto}">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${data[i].ia_nomeproduto}</h5>
      <p class="card-text truncate">${data[i].ia_descricaoproduto || ""}</p>
      <p class="mt-auto"><small>Estoque: <strong>${
        data[i].ia_quantidadeproduto ?? 0
      }</strong></small></p>
      </div>
      <div class="card-footer d-flex gap-2">
      <button class="btn btn-sm btn-primary" data-id="${
        data[i].ia_idproduto
      }">Visualizar</button>
      <button class="btn btn-sm btn-warning" data-id="${
        data[i].ia_idproduto
      }">Editar</button>
      <button class="btn btn-sm btn-danger" data-id="${
        data[i].ia_idproduto
      }">Excluir</button>
      </div>
    </div>
    `);
    }
  }
});
