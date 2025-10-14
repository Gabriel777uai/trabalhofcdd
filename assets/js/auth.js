function verificarLogin() {
  const token = localStorage.getItem('acessToken');
  if (!token) {
    // Redireciona pro login se não estiver autenticado
    window.location.href = '../index.html';
  }
}