<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../image/favicon.ico" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="../font/Hover-master/css/demo-page.css">
    <link rel="stylesheet" href="../font/Hover-master/css/hover-min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <title>Estoque Inteligente</title>
</head>
<body>
    <header>
        <section class="logo-e-titulo">
          <div class="hvr-buzz">
            <i class="bi bi-list" id="menu-lateral"></i>
          </div>
            <img src="../image/estoque-logo.png" alt="logo-estoque">
            <h1>Estoque inteligente</h1>
        </section>
        <section class="situação">
            <p>Situaçao: <span id="EstadoConta"></span></p>
        </section>
    </header>
    <section class="menu-lateral" id="addclass">
        <div class="conteudo">
            <ul class="list-unstyled ps-0">
                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed hvr-sweep-to-right" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true" style="margin-top: 20px;">
                        Produtos
                    </button>
                    <div class="collapse show" id="home-collapse">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                          <li><a href="#" class="link-dark rounded hvr-underline-from-left">Ferramentas</a></li>
                          <li><a href="#" class="link-dark rounded hvr-underline-from-left">Automoveis</a></li>
                          <li><a href="#" class="link-dark rounded hvr-underline-from-left">Motopeças</a></li>
                        </ul>
                      </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed hvr-sweep-to-right" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse"style="margin-top: 20px;" >
                        Relatorios
                    </button>
                    <div class="collapse" id="dashboard-collapse">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                          <li><a href="#" class="link-dark rounded hvr-underline-from-left">Pedidos</a></li>
                          <li><a href="#" class="link-dark rounded hvr-underline-from-left">Compras</a></li>
                          <li><a href="#" class="link-dark rounded hvr-underline-from-left">Cadastro</a></li>
                        </ul>
                      </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed hvr-sweep-to-right" data-bs-toggle="collapse" data-bs-target="#account-collapse" style="margin-top: 20px;">
                        Saidas
                    </button>
                    <div class="collapse" id="account-collapse">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                          <li><a href="#" class="link-dark rounded hvr-underline-from-left">Pesquisar saida de produtos</a></li>
                          <li><a href="#" class="link-dark rounded hvr-underline-from-left">Vendas</a></li>
                          <li><a href="#" class="link-dark rounded hvr-underline-from-left">Compras</a></li>
                        </ul>
                      </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed hvr-sweep-to-right" data-bs-toggle="collapse" data-bs-target="#orders-collapse"style="margin-top: 20px;" >
                        Cadastros
                    </button>
                    <div class="collapse" id="orders-collapse">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                          <li><a href="register/index.php?go=produtos" class="link-dark rounded hvr-underline-from-left">Produtos</a></li>
                          <li><a href="register/index.php?go=usuarios" class="link-dark rounded hvr-underline-from-left">Usuarios</a></li>
                          <li><a href="register/index.php?go=saidas" class="link-dark rounded hvr-underline-from-left">Saidas</a></li>
                        </ul>
                      </div>
                </li>
            </ul>
        </div>
    </section>
    <section class="initpage">
        <article class="container">
            <div class="title-search">
                <h1>Produtos</h1>
            </div>
            <div class="meu-flex-search">
                <h2>Pesquisar produtos</h2>
                <div class="input-group mb-3">
                    <select class="form-select" id="inputGroupSelect01" style="flex: .2;">
                        <option selected>Codigo...</option>
                        <option value="1">Descrição</option>
                        <option value="2">Ambos</option>
                    </select>  
                    </ul>
                    <input type="text" class="form-control" aria-label="Text input with dropdown button">
                  </div>
            </div>
            <div class="list-ordern">
                <table class="table table-dark table-hover">
                    <thead>
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Codigo</th>
                          <th scope="col">Produto</th>
                          <th scope="col">Descrição</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td colspan="2">Larry the Bird</td>
                          <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">4</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <th scope="row">5</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                          </tr>
                          <tr>
                            <th scope="row">6</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                          </tr>
                          <tr>
                            <th scope="row">7</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <th scope="row">8</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                          </tr>
                          <tr>
                            <th scope="row">9</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                          </tr>
                          <tr>
                            <th scope="row">10</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <th scope="row">11</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                          </tr>
                          <tr>
                            <th scope="row">12</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                          </tr>
                          <tr>
                            <th scope="row">13</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <th scope="row">14</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                          </tr>
                          <tr>
                            <th scope="row">15</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                          </tr>
                          <tr>
                            <th scope="row">16</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <th scope="row">17</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                          </tr>
                          <tr>
                            <th scope="row">18</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                          </tr>
                          <tr>
                            <th scope="row">19</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <th scope="row">20</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                          </tr>

                      </tbody>
                </table>
            </div>
        </article>
    </section>
    <script src="js/script.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <script> window.chtlConfig = { chatbotId: "4416448636" } </script>
    <script async data-id="4416448636" id="chatling-embed-script" type="text/javascript" src="https://chatling.ai/js/embed.js"></script>
</body>
</html>