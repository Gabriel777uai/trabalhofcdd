<?php
    $urlparm = $_GET['go'];
    include_once("../../conexaoBD/conect.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../../image/favicon.ico" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <title>Cadastrar Produtos</title>
</head>
<body>
    <section class="d-flex">
        <?php 
            switch($urlparm){
                case 'produtos':
        ?>
                <article class="container">
                    <div class="border1px">
                        <h1>Cadastro de Produtos</h1>
                        <div class="formulario-de-entrega">
                            <form action="" method="post">
                                <div class="form-floating controle">
                                    <input type="number" id="codproduto" name="codproduto" class="form-control">
                                    <label for="cdoproduto">Codigo produto</label>
                                </div>
                                <div class="form-floating controle">
                                    <input type="text" id="produtoname" name="produtoname" class="form-control">
                                    <label for="produtoname">Nome produto</label>
                                </div>
                                <div class="form-floating controle">
                                    <input type="text" id="descproduto" name="descproduto" class="form-control">
                                    <label for="descproduto">Descição Produto</label>
                                </div>
                                <div class="form-floating controle">
                                    <input type="date" name="datadecadastro" id="datadecadastro" class="form-control">
                                    <label for="datadecadastro">Data de cadastro</label>
                                </div >
                                <div class="form-floating controle">
                                    <p>Cadastrante:<?php ?></p>
                                </div>
                                <div class="form-floating controle">
                                    <input type="submit" value="Cadastrar" name="cadastrar" class="btn btn-primary">
                                </div>
                            </form>
                        </div>
                    </div>
                </article>
        <?php
        if(isset($_POST["cadatrar"])){
            
        } 
        break;
        case 'usuarios':
        ?>
                <article class="container">
                    <div class="border1px">
                        <h1>Cadastro de Usuarios</h1>
                        <div class="formulario-de-entrega">
                            <form action="registros/usuario.php" method="post">
                                <div class="form-floating controle">
                                    <input type="text" id="username" name="username" class="form-control">
                                    <label for="username">Nome Usuarios</label>
                                </div>
                                <div class="form-floating controle">
                                    <input type="text" id="cargoname" name="cargoname" class="form-control">
                                    <label for="cargoname">cargo usuário</label>
                                </div>
                                <div class="form-floating controle">
                                    <input type="text" id="senha" name="senhauser" class="form-control">
                                    <label for="senha">Senha</label>
                                </div>
                                <div class="form-floating controle">
                                    <input type="date" id="data" name="data" class="form-control">
                                    <label for="data">cadastro</label>
                                </div>
                                <div class="form-floating controle">
                                    <input type="submit" value="Cadastrar" name="cadastrar" class="btn btn-primary">
                                </div>
                            </form>
                        </div>
                    </div>
                </article>
                <?php
                  
                break;
                ?>
                <?php
                case 'saidas':
                    ?>
                <article class="container">
                    <div class="border1px">
                        <h1>Controle de Saida</h1>
                        <div class="formulario-de-entrega">
                            <form action="registros/pecas.php" method="post">
                                <div class="form-floating controle">
                                    <input type="number" id="codproduto" name="codproduto" class="form-control">
                                    <label for="cdoproduto">Codigo produto</label>
                                </div>
                                <div class="form-floating controle">
                                    <input type="text" id="produtoname" name="produtoname" class="form-control">
                                    <label for="produtoname">Nome produto</label>
                                </div>
                                <div class="form-floating controle">
                                    <input type="text" id="descproduto" name="descproduto" class="form-control">
                                    <label for="descproduto">Descição Produto</label>
                                </div>
                                <div class="form-floating controle">
                                    <input type="date" name="datadecadastro" id="datadecadastro" class="form-control">
                                    <label for="datadecadastro">Data de cadastro</label>
                                </div >
                                <div class="form-floating controle">
                                    <p>Cadastrante:<?php ?></p>
                                </div>
                                <div class="form-floating controle">
                                    <input type="submit" value="Cadastrar" name="cadastrar" class="btn btn-primary">
                                </div>
                            </form>
                        </div>
                    </div>
                </article>
            <?php
            break;
                default:
                echo "failed param";
            }
        ?>
    </section>
    <a href="../paginainicial.php?logado" class="btn btn-danger" style="margin-left: 10%;"> Voltar</a>
    <script src="js/script.js"></script>
</body>
</html>