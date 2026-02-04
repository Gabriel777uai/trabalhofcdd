$(document).ready(function () {
  const sidebar = $("#menuLateral");
  const overlay = $("#overlay");
  const btnToggle = $("#btnMobileToggle");

  // Função para abrir/fechar o menu em dispositivos móveis
  function toggleSidebar() {
    sidebar.toggleClass("aberto");
    overlay.fadeToggle(300);
  }

  // Clique no botão de hambúrguer
  if (btnToggle.length) {
    btnToggle.on("click", function (e) {
      e.stopPropagation();
      toggleSidebar();
    });
  }

  // Clique no overlay para fechar o menu
  if (overlay.length) {
    overlay.on("click", function () {
      if (sidebar.hasClass("aberto")) {
        toggleSidebar();
      }
    });
  }

  // Fechar menu ao clicar em um link (opcional, bom para UX em mobile)
  sidebar.find(".menu-opcoes a").on("click", function () {
    if (sidebar.hasClass("aberto")) {
      toggleSidebar();
    }
  });

  // Garante que o menu feche ao redimensionar para desktop
  $(window).on("resize", function () {
    if ($(window).width() > 992) {
      sidebar.removeClass("aberto");
      overlay.fadeOut(300);
    }
  });
});
