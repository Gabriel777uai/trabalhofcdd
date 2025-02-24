<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <title>Login</title>
</head>
<body>
    <header id="cabecalho">
        <section class="navbare">
            <h1>Login</h1>
            <nav>
                <ul class="m-0">
                    <li><a href="home/index.html"><i class="bi bi-house-fill"></i> Home</a></li>
                    <li><a class="entrar" href="#"><i class="bi bi-person-fill"></i> Sing in</a></li>
                </ul>
            </nav>
        </section>
    </header>
    <section class="container Login">
        <div class="titulo">
            <p>Login</p>
            <h2>Estoque<br>Inteligente</h2>
        </div>
        <article class="d-flex justify-content-center">
            <div class="flex">
                <div class="form-floating controle">
                    <input class="form-control" id="usuario" type="text" name="Usuario" placeholder="Usuario:">
                    <label for="Usuario">Usuario:</label>
                </div>
                <div class="form-floating controle">
                    <input class="form-control" id="senha" type="password" name="Usuario" placeholder="Senha:" >
                    <label for="Usuario">Senha:</label>
                </div>
                <div class="button">
                    <input type="submit" value="Entrar" onclick="Entrar()" >
                </div>
            </div>
        </article>
    </section>
    <footer>
        <p>&copy; Todos os direitos reservados. site empresarial.</p>
    </footer>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="js/script.js"></script>
    <script> window.chtlConfig = { chatbotId: "9239611121" } </script>
    <script async data-id="9239611121" id="chatling-embed-script" type="text/javascript" src="https://chatling.ai/js/embed.js"></script>
    <script async data-id="9239611121" data-display="page_inline" id="chatling-embed-script" type="text/javascript" src="https://chatling.ai/js/embed.js"></script>
</body>
</html>