API_KEY = "4e9f68c76b4e3d7a8b5f1c2d3e4f5a6b";
API = "http://localhost/e-bestcommerce_mudey/backend/api/";
API_UPLOAD_IMAGE = "http://localhost/e-bestcommerce_mudey/backend/api/uploadImage.php";


openModale = ()  =>{
    console.log(`addProd`, 'azertyui'); 
    var myModal = new bootstrap.Modal($('#exampleModal'), {
        backdrop: true, // ou true/false selon vos besoins
        keyboard: false
    })
    console.log(`modal`, myModal);
    myModal.show()

}



addProduct = () => {
    //upload image
    //AMELIORATION DE LA FONCTION PAR CECI
    let formProduct = document.getElementById("formProduct");
    
    let data =  new FormData(formProduct);

    let fileProduct = data.get("image");
    data.set("image", data.get("image").name); //recuper le nom de l'image et non l'objet
    data.append("API_KEY", API_KEY);

    // Display the key/value pairs pour voir le comportement de notre objet
    /* for (const pair of data.entries()) {
        console.log(pair[0], pair[1]);
    }
    return; */
    

    //nettoyer le localStorage
    localStorage.clear();

    //creation de l'url pour la sauvegarde en bd
    // let params = constructURLParams(newProduct);
    const url = API + 'products';

    //console.log(url);

    fetch(url, 
        {
            method: "POST",
            body: data
        }).then((response) => { //un then pour recuperer la response
            if (response.ok) {
                return response.json();
            }
        })
        .then((response) => { //un autre then pour recuperer la response dans ce format
            if (response.status == 200) {
                console.log(response.result);
                //appel de la fonction updloadImage
                uploadImage(fileProduct);
                document.getElementById("formProduct").reset(); //remettre à Zero tous les champs
                
                document.getElementsByClassName("btn-close")[0].click(); //fermer le modal

            }else{
                console.log(response.message);
                
            }
        })
    
    
    // console.log("Mon Produit affiché", constructURLParams(newProduct));

}

//creation de l'url qui sera associé à notre requette
constructURLParams = (objet) => {
    result = '';
    for (const property in objet) {
        result += `${property}=${objet[property]}&`;
    }

    return result;
}


//creation d'un utilitaire pour uploader reelement l'image
uploadImage = (file) => {
    //creation d'un objet forme data pour recuperer les valeurs saisies du form
    let data = new FormData();
    //ajouter l'image renseigner depuis l'input
    data.append("image", file); //ajout le 1 element (0)
    //ajouter la cle d'api
    data.append("API_KEY", API_KEY);
    //execution de la requette avec fetch et en mode POST pour uploader les images
    fetch(API_UPLOAD_IMAGE, {
        method: "POST",
        body: data
    }).then((response) =>  {
        if (response.ok) {
            return response.json();
        }
    }).then((result) => { //recuperer ce qui retourner dans result
        if (result.status == 200) {
            console.log("Image stocké avec succès !");
             
        } else {
            console.log(result.message);
            
        }
    })

}









