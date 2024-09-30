class Ecommerce {

    constructor() {
        this.api_key = "API_KEY=4e9f68c76b4e3d7a8b5f1c2d3e4f5a6b";
        this.api = "http://localhost/e-bestcommerce_mudey/backend/api/";
        this.actions = ['orders', 'users', 'category', 'products'];

        this.data = [];

        this.initRouter();
        this.initDataApp();
    }

    //creation de nos router de navigation
    initRouter(){
        this.actions.forEach((action) =>{
            document.getElementById(action).addEventListener("click", () => {
                //à chaque click, qu'on nous charge (fetch) les données corcenant chaque button de navigation
                fetch("templates/"+action+".html")
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        console.log("Erreur de chargement du template");
                    }

                }).then((data) => {
                    document.getElementsByClassName('container-fluid')[0].innerHTML = data;
                    //tester si le click est sur les produits
                    if (action == 'products') {
                        this.loadProducts();
                    }else if (action == 'category') {
                        this.loadCategories();
                    }else if(action == 'orders') {
                        this.loadOrders();
                    }else if(action == 'users'){
                        this.loadUsers();
                    }
                })


            })
        })
    }
    
    initDataApp(){
        this.actions.forEach((action) =>{
            //question le server
            const url = this.api+action+"?"+this.api_key;
            //utiliser fetch pour charger une ressource externe
            fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json(); //retourner au format json
                } else {
                    console.log("Erreur de chargement des données !");
                }

            }).then((response) =>{
                if (response.status == 200) {
                    //Charger les données dans le localStorage ou le tableau si tout se passe bien
                    this.data.push({name: action, data: response.result});
                    // localStorage.setItem(action, JSON.stringify(response.result));
                } else {
                    
                }
            })
        })
    }


    //function to getData permettant de parcourir et de recuperer les données en local
    getData(action){
        //tester si les données sont définies sinon tableau vide
        var object = this.data.find(element => element.name == action);
        return object.data;
        // return JSON.parse(localStorage.getItem(entity)) ? JSON.parse(localStorage.getItem(entity)) : [];
    }
    
    loadProducts(){
        $('#dataTable').DataTable( {
            data: this.getData('products'),
            columns: [
                { data: 'idProduct' },
                { data: 'name' },
                { data: 'description' },
                { data: 'price' },
                { data: 'stock' },
                { data: 'createdAt' }
            ]
        } );
    }

    loadCategories(){
        $('#dataTable').DataTable( {
            data: this.getData('category'),
            columns: [
                { data: 'idCategory' },
                { data: 'name' }
            ]
        } );
    }

    loadOrders(){
        $('#dataTable').DataTable( {
            data: this.getData('orders'),
            columns: [
                { data: 'idOrder' },
                { data: 'idUser' },
                { data: 'idProduct' },
                { data: 'quantity' },
                { data: 'price' },
                { data: 'createdAt' }
            ]
        } );
    }

    loadUsers(){
        $('#dataTable').DataTable( {
            data: this.getData('users'),
            columns: [
                { data: 'idUser' },
                { data: 'email' },
                { data: 'firstname' },
                { data: 'lastname' }
            ]
        } );
    }

   
}


export {Ecommerce}