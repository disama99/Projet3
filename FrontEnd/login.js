/*
VIdéo pour comprendre la mécanique du json web token (JWT)
https://www.youtube.com/watch?v=qAWYetBarMg&list=PLwJWw4Pbl4w_oHjPIjkdVtwLeQECK08jv&index=17

Etape
1 à la soumission du formulaire on récupère les infos dans les inputs
2 j'envoie en POST les informations à la API
3 si tout va bien je récupère un token que je stock dans le localStorage

*/

// soumission du formulaire
let formulaire = document.querySelector("#monformulaire")

//  ecoute  de la soumission du formulaire
formulaire.addEventListener('submit', e => {
    e.preventDefault()   // comportement par défaut

    // récuperation des valeurs contenue dans les champs
    let credentials = {
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    }
    console.log(credentials)

    // Envoi de la requête en POST des informations à l'API
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)

    })
        .then(res => {
            // Test si la réponse est OK
            if (res.status == 200) {
                console.log('C BON JE PASSE A LA SUITE')
                return res.json()
            }

            // Levée d'erreur (exception) pour aller au catch
            throw new Error
        })
        .then(response => {
            console.log(response)
            // Mise en locaStorage du token retour page accueil
            localStorage.setItem('token', response.token)
            window.location.href = "index.html"

        })

        .catch(err => {
            let messageError = `Erreur dans l’identifiant ou le mot de passe`
            const messageErrorElemnt = document.querySelector("#message_Error")
            messageErrorElemnt.textContent = messageError
            console.log(err);
        });
})