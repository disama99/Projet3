
let modal = null   // permet de savoir quel est la boite modal actuellement ouverte
const focusableSelector = 'button, a, input, textarea' // tous les elements focusable à l'interieur de la boite modal
let focusables = []  // sauvegarde de tous le elements focusable lorsque l'on ouvre la boite modal
let previouslyFocusedElement = null

const openModal = async function (e) {     // creation de la fonction openModal avec l'evement comme parametre
    e.preventDefault()              // on ne souhaite pas que le click sur le lein fonctionne convenablement
    const target = e.target.getAttribute('href')
    if (target.startsWith('#')){
        modal = document.querySelector(target)
    } else{
        modal = await loadModal(target)
    }
    focusables = Array.from(modal.querySelectorAll(focusableSelector)) // recuperation des élements focusable sous forme de tableau
    previouslyFocusedElement = document.querySelector(':focus')
    focusables[0].focus() //par defaut on met le focus sur le premier element de la boite modale
    modal.style.display = null
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js_modal_close').addEventListener('click', closeModal)
    modal.querySelector('.js_modal_stop').addEventListener('click', stopPropagation)
}
//fonction closeModal
const closeModal = function (e) {
    if (modal === null) return  //si on essaie de fermer une modal non existante, on s'arrette la
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    e.preventDefault()
    window.setTimeout(function () {
        modal.style.display = "none"
        modal = null
    }, 500)    
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js_modal_close').removeEventListener('click', closeModal)
    modal.querySelector('.js_modal_stop').removeEventListener('click', stopPropagation)
    

}
const stopPropagation = function (e) {
    e.stopPropagation()
}

//bloquage du script a l'interieur de la boite modal
const focusInModal = function (e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(':focus')) // premier element correspondant au focus
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.lenght) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

const loadModal = async function (url) {
    // afficher un loader pour indiquer à l'utilisateur le chargement
    const target='#' + url.split('#')[1] //boite modal a selectionner(la seconde partie de l'url apres le #)   
    const existingModal = document.querySelector(target)
    if (existingModal !== null) return existingModal
    const html = await fetch(url).then(response => response.text())
    const element = document.createRange().createContextualFragment(html).querySelector(target) //creation de fragment de morceau html
    if (element === null) throw `L'élement ${target} n'a pas été trouvé dans la page ${url}`
   document.body.append(element)
   return element
}

//on selectionne tous les elements qui on cette classe et on ecoute le clik pour chaque liens
document.querySelectorAll('.js_modal').forEach(a => {
    a.addEventListener('click', openModal) //a chque clic sur le lien on on appel la fonction openModal    
})
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e)
    }
})
