document.getElementById('btnLogout').addEventListener('click', function() {
    localStorage.clear();
    window.open('../index.html', '_self');
});