let arrayUsers = [
    {
        user: "Matheus",
        senha: "123"
    },
    {
        user: "Diego",
        senha: "123"
    },
    {
        user: "Gabriel",
        senha: "2464"
    },
    {
        user: "Alexandre",
        senha: "123"
    }
]


function Entrar() {
    
    let usuarioinput = String(document.getElementById('usuario').value);

    let senhainput = String(document.getElementById('senha').value);
    if (usuarioinput  == "" || senhainput == "") {
        alert('por favor preencha os dados')
    } else {
        let validalogin = false;
        for(x in arrayUsers) {
            if(usuarioinput == arrayUsers[x].user && senhainput == arrayUsers[x].senha){
                validalogin = true;
                break;
            }
        }
        if(validalogin == true) {
            window.location.href = "log/paginainicial.php?logado";
        }else {
            alert("usuario ou senha incorretos tente novamente");
        }
    }

}
jQuery('#senha').keypress(function(event){

	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
        let usuarioinput = String(document.getElementById('usuario').value);

        let senhainput = String(document.getElementById('senha').value);
        if (usuarioinput  == "" || senhainput == "") {
            alert('por favor preencha os dados')
        } else {
            let validalogin = false;
            for(x in arrayUsers) {
                if(usuarioinput == arrayUsers[x].user && senhainput == arrayUsers[x].senha){
                    validalogin = true;
                    break;
                }
            }
            if(validalogin == true) {
                window.location.href = "log/paginainicial.php?logado";
            }else {
                alert("usuario ou senha incorretos tente novamente");
            }
        }
	}

});
let myParam = location.href.split("?")
let getValue = myParam[1]
if (getValue == "aicmequbra") {
    alert('Por favor efetuar o login')
}