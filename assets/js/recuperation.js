let url_base;
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("Testes em Desenvolvimento");

  url_base = "http://localhost:8000/";
} else {
  console.log("Rodando em Produção");
  url_base = "https://trabalhofcdd-backend.onrender.com/";
}

let id_user_input = document.getElementById("login");

let user_local_storage = localStorage.getItem("userErrorPassword");
document.addEventListener("DOMContentLoaded", async () => {
  if (user_local_storage) {
    id_user_input.value = user_local_storage;
  }
  try {
    const getDataUser = await fetch(
      `${url_base}api/v1/forgotpassword/${user_local_storage}`,
    );
    const dataUser = await getDataUser.json();
    if (dataUser.response) {
      let email = dataUser.output?.email;

      document.getElementById("email-user").textContent = email;
      console.log("Dados do usuario: ", dataUser);

      var id = dataUser.output?.id;

      document
        .getElementById("form-recuperacao")
        .addEventListener("submit", async function (event) {
          event.preventDefault();

          let formData = new FormData(this);

          try {
            let response = await fetch(
              `${url_base}api/v1/forgotpassword`,
              {
                method: "POST",
                body: formData
              },
            );

            let data = await response.json();
            console.log("Dados retornados: ", data);

            if (data.response) {
              Swal.fire({
                icon: "success",
                title: "Código de verificação enviado!",
                text: "Verifique seu email para redefinir a senha.",
                confirmButtonColor: "#4a90e2",
              })
                html = `
                <form id="valida-code">
                    <label for="code">Digite o codigo de verificacao que foi enviado para o seu email</label>
                    <input type="text" id="code" name="code" placeholder="Digite seu código" required/>
                    
                    <p style="font-size: 10px;">Código enviado para: <span id="email-user"></span></p>
                    <button id="btnRecuperar" type="submit">Recuperar</button>
                </form>
                        `;

                document.getElementById("container").innerHTML = html;

                document.getElementById("email-user").textContent = dataUser.output?.email;

                document.getElementById('valida-code').addEventListener('submit', async (e) => {
                    e.preventDefalt()
                    let formData = new FormData(this)
                    
                    try {
                        let response = await fetch(`${url_base}api/v1/forgotpassword/${id}/validate`, {
                            method: "POST",
                            body: formData
                        })
                        let data = await response.json()
                        console.log("Dados retornados: ", data)
                        if (data.response) {
                            Swal.fire({
                                icon: "success",
                                title: "Código de verificação enviado!",
                                text: "Verifique seu email para redefinir a senha.",
                                confirmButtonColor: "#4a90e2",
                            })
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: data.status,
                                confirmButtonColor: "#4a90e2",
                            })
                        }
                    } catch (error) {
                        console.error("Erro:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Erro",
                            text: "Erro ao conectar com o servidor.",
                            confirmButtonColor: "#4a90e2",
                        });
                    }
                })
            } else {
              Swal.fire({
                icon: "error",
                title: data.status,
                confirmButtonColor: "#4a90e2",
              });
            }
          } catch (error) {
            console.error("Erro:", error);
            Swal.fire({
              icon: "error",
              title: "Erro",
              text: "Erro ao conectar com o servidor.",
              confirmButtonColor: "#4a90e2",
            });
          }
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Favor consulte um adiministrador para ter acesso!",
        text: "Os dados enviados para o servidor não existem em nosso sistema!",
        redirect: "index.html",
        confirmButtonColor: "#4a90e2",
      });
    }
  } catch (error) {
    console.log(error);
    document.getElementById("container").innerHTML =
      "Usuario nao encontrado! Entre em contato com o administrador do sistema. <br><a href='index.html'>Voltar</a>";
  }
});
