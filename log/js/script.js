let myParam = location.href.split("?")
let getValue = myParam[1]

if(getValue != "logado" || getValue == undefined) {
    window.location.href = "../index.html?aicmequbra"
}
let menuLateral = document.getElementById('menu-lateral')

menuLateral.addEventListener('click', ()=>{
    let addclasslist = document.getElementById('addclass')
    addclasslist.classList.toggle('ativado')
})