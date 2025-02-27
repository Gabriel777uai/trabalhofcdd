
let myParam = location.href.split("?")
let getValue = myParam[1]

if(getValue != "logado" || getValue == undefined) {
    window.location.href = "../index.php?aicmequbra"
}
let menuLateral = document.getElementById('menu-lateral')

menuLateral.addEventListener('click', ()=>{
    let addclasslist = document.getElementById('addclass')
    addclasslist.classList.toggle('ativado')
})
let estadoUser = document.getElementById("EstadoConta");
window.addEventListener("load", () => {
    const status = navigator.onLine;
    if (status){
        estadoUser.textContent = "Online";
        estadoUser.classList.add('colorOnline');
    } else {
        estadoUser.textContent = "Offline";
        estadoUser.classList.add('colorOffline');
    }    
})