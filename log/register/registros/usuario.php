<?php
include_once('../../../conexaoBD/conect.php');
    if(isset($_POST["cadastrar"])){
        $nome = $_POST["username"];
        $cargo = $_POST["cargoname"];
        $senha = $_POST["senhauser"];
        $data = $_POST['data'];
        if($nome == ' ' || $cargo == ' ' || $senha == ' ') {
            echo '<script>alert("Adicionar valores aos parametros")</script>';
            header('location: ../index.php?go=usuarios');
        }else{
            $sql = "INSERT INTO public.users(cd_nome, cd_cargo, cd_senha, cd_date_cadastro) VALUES ('$nome', '$cargo', '$senha', '$data');";
            $conect->query($sql);
            echo '<script>alert("Cadastrado com sucesso!")
            window.location.href("../index.php?go=usuarioss")</script>';
            
        }
    
    } 
?>