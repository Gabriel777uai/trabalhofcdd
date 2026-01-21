
let url_base = "http://localhost:8000/"

async function listClientsSelect(id) {
  const response = await fetch(`${url_base}api/v1/getclientsforuser/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("acessToken")}`,
    },
  });
  const data = await response.json();
  const select = document.getElementById("selectCliente");
  for (let i = 0; i < data.length; i++) {
    select.innerHTML += `<option value="${data[i].cod_cliente}">${data[i].nome_cliente}</option>`;
    console.log(select)
  }
}
listClientsSelect(localStorage.getItem("id"));