<?php
    //$dns = "pgsql:dbname=postgres;host=192.168.1.32";
    $dns = "pgsql:dbname=postgres;host=localhost";
    $password = "gabriel";
    $port = "5432";
    $user = "postgres";
    try {
        
        $conect = new PDO($dns, $user, $password);
        echo "User concted in sucess!";
    }catch(PDOException $error){
        die($error->getMessage());
    }
?>