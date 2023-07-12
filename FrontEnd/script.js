/**
 * 1 récuperer les articles
 * 2 construire l'html
 * 3 injecter l'html dans le dom
 *      3.1 Pointer sur l'lélement items
 *      3.2 Injecter dans le dom
 * 
 */

// affichage des articles dans le DOM
const displayIndex = () => {
    // Récupération des articles depuis l'API
    fetch("http://localhost:5678/api/works")
        .then(res => res.json())
        .then(data => {
            let display = ''
            for (let article of data) {
                display += `
                <figure data-cid="${article.categoryId}">
                    <img src="${article.imageUrl}" alt="${article.title}">
                    <figcaption>${article.title}</figcaption>
                </figure>`
            }
            // Injection de l'HTML des articles dans le DOM
            document.querySelector('.gallery').innerHTML = display

            // Mise en forme des articles dans le DOM
            let figures = document.querySelectorAll('.gallery > figure')
            figures.forEach((figure) => {
                figure.style.display = 'flex'
                figure.style.flexDirection = 'column'
                figure.style.alignItems = 'start'

                let img = figure.querySelector('img')
                img.style.order = '1'

                let figcaption = figure.querySelector('figcaption')
                figcaption.style.order = '2'
                figcaption.style.marginTop = '10px'

            })
        })
        .catch(err => {
            console.log('Erreur lors de la récupération des articles :')
            console.log(err)
        })

    // Récupération des catégories depuis l'API
    fetch("http://localhost:5678/api/categories")
        .then(res => res.json())
        .then(data => {
            let display = '<li class="itemfiltres" data-id="all">Tous</li>'
            for (let catego of data) {
                display += `
                <li class="itemfiltres" data-id="${catego.id}">${catego.name}</li>`
            }
            // Injection de l'HTML des catégories dans le DOM
            document.querySelector('#filtres').innerHTML = display

            // Gestion des filtres de catégories
            let btnFiltre = document.querySelectorAll('.itemfiltres') // filtre cliquable
            for (let btn of btnFiltre) {
                btn.addEventListener("click", e => {
                    let categoryId = e.target.dataset.id
                    // Récupération des images dans le DOM
                    let articles = document.querySelectorAll('.gallery > figure')
                    // Affiche ou cache les images selon la catégorie sélectionnée
                    articles.forEach(article => {
                        if (categoryId === 'all' || article.dataset.cid === categoryId) {
                            article.style.display = 'flex'
                        } else {
                            article.style.display = 'none'
                        }
                    })
                })
            }
        })
        .catch(err => {
            console.log('Erreur lors de la récupération des catégories :')
            console.log(err)
        })
}
// Appel de la fonction displayIndex() pour afficher les articles lors du chargement de la page
displayIndex()


// Vérification de la connection de l'utilisateur 
let isLogged = () => {
    let token = localStorage.getItem('token')
    return !!token
}

// Gestion de l'affichage en fonction de la connection de l'utilisateur
let loginButton = document.querySelector(".attribut")
let edition = document.querySelector("#TokenokAffichage")
let overlay = document.querySelector('#jsmodaloverlay')
let modifierButton = document.querySelector("#modifier3")
let jsmodalbody = document.querySelector("#jsmodalbody")
let jsmodalbody2 = document.querySelector("#jsmodalbody2")
let filtres = document.querySelector("#filtres")
let modifierButton1 = document.querySelector("#modifier1")
let modifierButton2 = document.querySelector("#modifier2")
let penModifier = document.querySelectorAll(".fa-pen-to-square")


if (isLogged()) {
    loginButton.innerHTML = `logout`
    edition.style.display = "flex"
    filtres.style.display = "none"
    modifierButton.style.display = "flex"
    modifierButton1.style.display = "flex"
    modifierButton2.style.display = "flex"
    penModifier.forEach(items => {
        items.style.display = "flex"
    })
    loginButton.addEventListener("click", e => {
        e.preventDefault()
        localStorage.removeItem('token')
        location.reload()
    })

} else {
    loginButton.innerHTML = `<a href="login.html" >login</a>`
    edition.style.display = "none"
    filtres.style.display = "flex"
    modifierButton.style.display = "none"
    modifierButton1.style.display = "none"
    modifierButton2.style.display = "none"
    penModifier.forEach(items => {
        items.style.display = "none"
    })
}

let modifierButtons = document.querySelectorAll('.boutonmodif3')
modifierButton.addEventListener("click", e => {
    jsmodalbody.style.display = "block"
    overlay.style.display = 'flex'
})

let modalcloseButton = document.querySelector('#jsmodalclose')
modalcloseButton.addEventListener('click', e => {
    overlay.style.display = 'none'
    jsmodalbody.style.display = 'none'
    jsmodalbody2.style.display = "none"
})

let addphoto = document.querySelector("#js-ajoutphotModal")
addphoto.addEventListener("click", e => {
    jsmodalbody2.style.display = "block"
})

let jsmodalBack = document.querySelector("#jsmodalback")
jsmodalBack.addEventListener("click", e => {
    let jsmodalbody = document.querySelector("#jsmodalbody")
    let jsmodalbody2 = document.querySelector(".modal-body2")
    jsmodalbody.style.display = "block"
    jsmodalbody2.style.display = "none"
})

let addButton = document.getElementById('js-modalAddpic')
let photoPreview = document.querySelector('#selectedImageDisplay')
let hideCover = document.querySelector("#jsnoIm")
let hideformatPicture = document.querySelector("#hideformatpicture")
let file = null

// Fonction pour charger les photos de la galerie dans la fenêtre modale
function loadPhotosInModal() {
    let modalGallery = document.querySelector('#jsmodalbody .modal-gallery')

    // Récupération des photos depuis l'API
    fetch("http://localhost:5678/api/works/")
        .then(res => res.json())
        .then(data => {
            let display = ''
            for (let photo of data) {
                display += `
          <figure data-photoid="${photo.id}" >
            <img src="${photo.imageUrl}" alt="">
            <figcaption>Editer</figcaption>
            <i class="fa-solid fa-trash-alt trash-icon"></i>
          </figure>`
            }
            modalGallery.innerHTML = display
            let trashIcons = modalGallery.querySelectorAll('.trash-icon')

            //suppression d'une photo à l'aide de l'icône corbeille et de mise à jour de l'affichage en conséquence.
            trashIcons.forEach(icon => {
                icon.addEventListener('click', e => {
                    let figure = e.target.closest('figure')
                    console.log(figure)
                    let imageUrl = figure.querySelector('img').src

                    // Envoie d' une requête de suppression à l'API pour supprimer la photo correspondante
                    let photoId = figure.dataset.photoid
                    console.log(photoId)
                    fetch(`http://localhost:5678/api/works/${photoId}`, {
                        method: 'DELETE',
                        headers: {
                            "authorization": `bearer ${localStorage.token}`,
                        },
                    })
                        .then(() => {
                            figure.remove()
                            //mise à jour de l'affichage des articles dans le DOM après la suppression
                            displayIndex()
                        })
                        .catch(err => {
                            console.log('Erreur lors de la suppression de la photo :')
                            console.log(err)
                        })
                })
            })
        })
        .catch(err => {
            console.log('Erreur lors du chargement des photos :')
            console.log(err)
        })
}
// Appel de la fonction de chargement des photos au chargement de la page
loadPhotosInModal()

let deleteGalleryButton = document.querySelector('#deleteGalleryButton')
deleteGalleryButton.addEventListener('click', deleteGallery)
// suppression de toute les photos de la galerie
function deleteGallery() {
    let modalGallery = document.querySelector('#jsmodalbody .modal-gallery')

    // Récupération des photos depuis l'API
    fetch("http://localhost:5678/api/works")
        .then(res => res.json())
        .then(data => {
            // tableau de promesses pour supprimer chaque photo
            let deletePromises = data.map(photo => deletePhoto(photo.id))

            // Attente de la fin de toutes les suppressions
            return Promise.all(deletePromises)
        })
        .then(() => {
            // Vider la galerie dans la fenêtre modale
            modalGallery.innerHTML = ''
            addButton.style.display = "flex";
            hideCover.style.display = "flex";
            hideformatPicture.style.display = "flex";
            console.log('Suppression de la galerie terminée.')

            displayIndex()
        })
        .catch(err => {
            console.log('Erreur lors de la suppression de la galerie :')
            console.log(err)
        })
}
// suppression d'une photo en fonction de son ID
function deletePhoto(photoId) {
    console.log("bonjour");
    fetch(`http://localhost:5678/api/works/${photoId}`, {
        method: 'DELETE',
        headers: {
            "authorization": `bearer ${localStorage.token}`,
        },
    })
        .then(response => {
            console.log(response);
            if (response.ok) {
                console.log(`Photo avec ID '${photoId}' supprimée avec succès`)
                displayIndex()
            } else {
                console.log(`Erreur lors de la suppression de la photo avec ID '${photoId}'`)
            }
        })
        .catch(error => {
            console.log(`Erreur lors de la suppression de la photo avec ID '${photoId}' :`, error)
        })
}
//fermeture et masquage des fenêtre modales
overlay.addEventListener('click', e => {
    overlay.style.display = 'none'
    jsmodalbody.style.display = 'none'
    jsmodalbody2.style.display = 'none'

})

//  sélection d'une image depuis de l' ordinateur de l'utilisateur.
addButton.addEventListener('click', e => {
    let input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jpg, .png'
    input.click()
    input.onchange = e => {
        file = e.target.files[0]
        console.log(file)
        let imageURL = URL.createObjectURL(file)
        photoPreview.src = imageURL
    }
    addButton.style.display = "none"
    hideCover.style.display = "none"
    hideformatPicture.style.display = "none"
})

//soumission du formulaire d'ajout de photo et d'envoie des données à l'API pour ajouter la photo.
let myForm = document.querySelector("#myForm")
myForm.addEventListener('submit', e => {
    e.preventDefault()
    console.log(file)
    // Récupéreration des données du formulaire
    let formData = new FormData()
    formData.append("image", file)
    formData.append("title", document.querySelector("#title").value)
    formData.append("category", parseInt(document.getElementById("category").value))
    console.log(formData)
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            "authorization": `bearer ${localStorage.token}`,
        },
        body: formData
    })
        .then(response => {
            console.log('Formulaire soumis avec succès !')
            overlay.style.display = 'none'
            jsmodalbody2.style.display = 'none'
            // Recharge des photos dans la fenêtre modale
            loadPhotosInModal()

            displayIndex()
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi du formulaire :', error)
        })
})
