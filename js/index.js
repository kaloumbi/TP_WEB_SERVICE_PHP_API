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


openModaleUpdate = (id)  =>{
    console.log(`Opening update modal for product ID: ${id}`); 
    var myModal = new bootstrap.Modal($(`#updateProduct-${id}`), {
        backdrop: true, // ou true/false selon vos besoins
        keyboard: false
    })
    console.log(`modal`, myModal);
    myModal.show()

}

openModaleDeleteConfirmation = (id)  =>{
    console.log(`Opening update modal for product ID: ${id}`); 
    var myModal = new bootstrap.Modal($(`#deleteProduct-${id}`), {
        backdrop: true, // ou true/false selon vos besoins
        keyboard: false
    })
    console.log(`modal`, myModal);
    myModal.show()

}


/*******************
                    FONCTIONS AJOUTS
********************/
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
        }).then((response) => { //un autre then pour recuperer la response dans ce format
            if (response.status == 200) {
                console.log(response.result);
                //initialiser notre objet
                var table = $("#dataTable").DataTable();
                var tableLength = table.rows().data().length ;
                //recuperer le dernier element du tableau
                var id = table.row(tableLength - 1).data("idProduct") + 1;
                

                let product = {
                    idProduct: id,
                    name: data.get("name"),
                    description: data.get("description"),
                    price: data.get("price"),
                    stock: data.get("stock"),
                    image: data.get("image"),
                    createAt: new Date().toISOString().slice(0, 19).replace('T', ' '),

                }

                table.row.add(product).draw;

                //appel de la fonction updloadImage
                uploadImage(fileProduct);
                document.getElementById("formProduct").reset(); //remettre à Zero tous les champs du formulaire
                
                document.getElementsByClassName("btn-close")[0].click(); //fermer le modal

            }else{
                console.log(response.message);
                
            }
        })
    
    
    // console.log("Mon Produit affiché", constructURLParams(newProduct));

}


/*******************
                    FONCTIONS UPDATE
********************/
updateProduct = (id, oldImageName) => {

    let formUpdateProduct = document.getElementById("formUpdateProduct-"+id);
    let data = new FormData(formUpdateProduct);
    data.append("API_KEY", API_KEY);
    data.append("idProduct", id);



    let imageToUpload = data.get("image");

    //si l'image est defini => user a bien choisi l'image
    if (imageToUpload.name !== "") {
        data.set("image", imageToUpload.name);
    } else {
        data.set("image", oldImageName)
    }

    //data value pour stocker notre objet
    let dataValue = {}

    for (var value of data.entries()) { //value un tableau de deux elts
        dataValue[value[0]] = value[1];
        
    }

    //console.log(dataValue); mettre à jour les produits avec PUT
    const url = API + 'product?' + constructURLParams(dataValue);
    
    
    fetch(url, {
        method: "PUT",
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            log("Erreur déclanchée lors de l'execution de la requette !");
        }
    }).then((result) => {
        if (result.status === 200) {
            if (imageToUpload.name !== "") {
                uploadImage(imageToUpload)
                deleteImage(oldImageName);
            }
            console.log(result.result);
            document.getElementById("formUpdateProduct-"+id).reset();
            
        } else {
            console.log(result.message);
        }
    })
    
}

//fonction pour supprimer l'image existante depuis la bd et ensuite ajouter la nouvelle
deleteImage = (name) => {
    const url = API + 'images?name='+name+'&API_KEY='+API_KEY;

    fetch(
        url, 
        {
            method: "DELETE"
        }
    ).then((response) => {
        if(response.ok) {
            return response.json();
        }else{
            console.log("Erreur déclenchée lors de l'execution de la requette !");
        }

    }).then((result) => {
        if (result.status === 200) {
            console.log(result.result);
        }else{
            console.log(result.message);
        }
    })
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




/*******************
                    FONCTIONS DELETE
********************/

deleteProduct = (id) => {
    const url = API + "product?id="+id+"&API_KEY="+API_KEY;

    fetch(url, {
        method: "DELETE"
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }else{
            console.log("Erreur déclanchée lors de l'execution de la requette de suppression du produit !");
        }

    }).then((result) => {
        if (result.status == 200) {

            //raffraichissement après la mise à jour
            var table = $("#dataTable").DataTable();
            var products = table.rows().data();

            var product = products.filter(element => element.idProduct == id)[0];

            var index = products.indexOf(product);

            // Mettre à jour la ligne dans la DataTable avec la nouvelle API (fnDelete n'existe plus !)
            table.row(index).data(product).draw(false); 
            //supprimer en meme temps l'image
            deleteImage(product.image);

            console.log(result.result);
            
        } else {
            console.log(result.message);
            
        }
    })
}







