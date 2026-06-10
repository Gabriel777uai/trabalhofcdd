

let base_url = "";
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  base_url = "http://localhost/api/v1/";
} else {
  base_url = "https://trabalhofcdd-backend.onrender.com/api/v1/";
}

async function updateListMessage() {
  const response = await fetch(`${base_url}notifications/update/viewed`, {
    method: "put",
  });
}

setInterval(() => {
  renderMessages("all");
}, 36000);

async function renderMessages(list) {
  $("#list-notify").html("Carregando lista...");
  const response = await fetch(`${base_url}notifications`, {
    method: "get",
  });
  const data = await response.json();

  let arr;
  let string_total;
  let html = [];

  switch (list) {
    case "all":
      string_total = `Total: ${data.output.quantidadeAll}`;
      arr = data.output.all;
      break;
    case "visualizates":
      string_total = `visualizadas: ${data.output.quantidadeVisualizados}`;
      arr = data.output.visualizados;
      break;
    case "opens":
      string_total = `vistas: ${data.output.quantidadeLidos}`;
      arr = data.output.lidos;
      break;
    case "notOpens":
      string_total = `Não lidas: ${data.output.quantidadeNaoLidos}`;
      arr = data.output.naoLidos;
      break;
  }

  if (data.output.qauntidadeNAoVisualizados > 0) {
    document
      .querySelector(".notification-message-count")
      .classList.add("active");
    $(".notification-message-count").html(
      data.output.qauntidadeNAoVisualizados,
    );
  } else {
    document
      .querySelector(".notification-message-count")
      .classList.remove("active");
    $(".notification-message-count").html("");
  }

  for (let i = 0; i < arr.length; i++) {
    let data = arr[i].d_notifi.split(" ")[0];
    let sliptData = data.split("-");
    let dataFormated = `${sliptData[2]}/${sliptData[1]}/${sliptData[0]}`;

    html.push(`
    <article class="card-message d-flex" onclick="openMessage(${arr[i].id})">
      <div class="fist-flex">
          <div>
            <img id="image_agent" src="${arr[i].agent_img}" width="65px" alt="logo_agent" loading="lazy">
          </div>
          <div class="img-model">
            <p id="title">${arr[i].cabecalho}</p>
            <p class="model">Agent ${arr[i].agent}</p>
          </div>
      </div>                       
      <div class="d-flex data">
        <p>${dataFormated}</p>
        <p> ${arr[i].type_notifi} </p>
        <span id="icon_open"> ${arr[i].lida ? '<i class="bi bi-envelope-open"></i>' : '<i class="bi bi-envelope"></i>'} </span>
      </div>     
    </article>
    `);
  }

  $("#total_messages").html("");
  $("#total_messages").html(string_total);
  $("#list-notify").html("");
  $("#list-notify").append(html);
}

//defalt Value
renderMessages("all");

async function message(param) {
  let listButton = document.querySelectorAll(".nav-link");
  for (let i = 0; i < listButton.length; i++)
    listButton[i].classList.remove("active");
  document.getElementById(param).classList.add("active");

  return await renderMessages(param);
}

let modal = document.querySelector(".modal-message");

function closeModalMessage() {
  modal.classList.remove("active");
  renderMessages("all");
}

let text_area = document.getElementById("message-text");
let title = document.getElementById("exampleModalLabel-message");
let agent_name = document.getElementById("recipient-name");

async function openMessage(param) {
  modal.classList.add("active");
  logger == false ? logger : console.log(param);
  const response = await fetch(`${base_url}notifications/${param}`, {
    method: "get",
  });
  const response_update = await fetch(
    `${base_url}notifications/update/read/${param}`,
    {
      method: "put",
    },
  );
  const data = await response.json();
  let result_message = data.output.result;

  text_area.textContent = result_message.message;
  title.textContent = result_message.cabecalho;
  agent_name.textContent = result_message.agent;
}