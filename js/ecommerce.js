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
                { data: 'price',
                    render: function ( data, type, row ) {
                        return '€'+ data;
                    }
                },
                { data: 'stock' },
                { data: 'createdAt' },
                { data: 'idProduct', 
                    render: function ( id, type, row ) {
                        return `<button type="button" class="btn btn-success" data-toggle="modal" data-target="#updateProduct-${id}" onclick="openModaleUpdate(${id})"> UPDATE </button>
                                <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteProduct-${id}" onclick="openModaleDeleteConfirmation(${id})"> DELETE </button>
                        
                        <!-- Modal Update Product-->
                        <div class="modal" id="updateProduct-${id}" tabindex="-1" aria-labelledby="updateProductModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Update Product</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">x</button>
                            </div>
                            <div class="modal-body">
                                
                                <form action="" id="formUpdateProduct-${id}">
                                    <div class="form-row">
                                        <div class="col">
                                            <label for="">Name : </label>
                                            <input   type="text" name="name" class="form-control" value="${row.name}" >
                                        </div>

                                        <div class="col">
                                            <label for="">Description : </label>
                                            <textarea  name="description" class="form-control" > ${row.description} </textarea>
                                        </div>

                                        <div class="col">
                                            <label for="">Price : </label>
                                            <input  type="number" name="price" class="form-control" value="${row.price}">
                                        </div>

                                        <div class="col">
                                            <label for="">Stock : </label>
                                            <input  type="number" name="stock" class="form-control" value="${row.stock}" >
                                        </div>

                                        <div class="col">${row.category}</div>
                                            <select  name="category" value="${row.category}">
                                                <option selected >Open this select Category </option>
                                                <option value="1" ${row.category === 1 ? 'selected' : '' } >One</option>
                                                <option value="2" ${row.category === 2 ? 'selected' : '' } >Two</option>
                                                <option value="3" ${row.category === 3 ? 'selected' : '' } >Three</option>
                                            </select>
                                        </div>

                                        <div class="col">
                                            <label for="">Image : </label>
                                            <input  type="file" name="image" class="form-control" accept="image/*">
                                        </div>

                                    </div>
                                </form>
                                
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button onclick="updateProduct(${id}, '${row.image}' )" type="button" class="btn btn-primary">Update Product</button>
                            </div>
                            </div>
                        </div>


                        <!-- Modal Update Product-->
                        <div class="modal" id="deleteProduct-${id}" tabindex="-1" aria-labelledby="deleteProductModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Product</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">x</button>
                            </div>
                            <div class="modal-body">

                                <p> Are you sure you want to delete this product ? We remind you that this action is irreversible ! </p>
                                
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button onclick="deleteProduct(${id})" type="button" class="btn btn-danger">Delete Product</button>
                            </div>
                            </div>
                        </div>
                        
                        
                        
                        
                        
                        
                        
                        `;
                    }
                }
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