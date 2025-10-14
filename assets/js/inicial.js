$(document).ready(() => {
    verificarLogin();
    $('#header').load('../components/header.html');
    $('#footer').load('../components/footer.html');

    // Funcionalidade do Menu Lateral
    setTimeout(() => {
        // Elementos do menu
        const menuLateral = document.getElementById('menuLateral');
        const menuButton = document.getElementById('menu-lateral');
        const fecharMenu = document.getElementById('fecharMenu');
        const overlay = document.getElementById('overlay');

        // Abrir menu
        if (menuButton) {
            menuButton.addEventListener('click', function() {
                menuLateral.classList.add('aberto');
                overlay.classList.add('ativo');
            });
        }

        // Fechar menu
        if (fecharMenu) {
            fecharMenu.addEventListener('click', function() {
                menuLateral.classList.remove('aberto');
                overlay.classList.remove('ativo');
            });
        }

        // Fechar menu ao clicar no overlay
        if (overlay) {
            overlay.addEventListener('click', function() {
                menuLateral.classList.remove('aberto');
                overlay.classList.remove('ativo');
            });
        }
    }, 500); // Pequeno atraso para garantir que os componentes foram carregados
});
