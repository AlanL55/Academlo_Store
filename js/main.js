
async function getApi() {
    try {
        const data = await fetch(`https://ecommercebackend.fundamentos-29.repl.co/`);
        const res = await data.json();
        window.localStorage.setItem(`products`, JSON.stringify(res));
        return(res);
    } catch (error) {
        console.log(error)
    }
}
function events(){
    const shopping_cart = document.querySelector('.shopping_cart');
    const menu_cart = document.querySelector('.menu_cart');
    const sign = document.querySelector('.sign');
    const sizes_guide = document.querySelector('.sizes_guide');
    shopping_cart.addEventListener("click", function(){
        menu_cart.classList.toggle("active");
    });
    sign.addEventListener("click", function(){
        sizes_guide.classList.toggle("active");
    })

}
async function getImages(db){
    const hoodie = document.querySelector(".product")
    let html = "";
    for(const product of db.products) {
    html += `
        <div class="product_image">
           <img id=${product.id} class="img_product" src="${product.image}" alt="imagen de producto"/>
           <button id=${product.id} class="button">Add to Cart</button>
        </div>
        `
        hoodie.innerHTML = html;
    }
}
function modal_img(db){
    const hoodie = document.querySelector('.hoodie_box');
    const square_2 = document.querySelector('.square_2');
    const red_square = document.querySelector('.red_square');
    hoodie.addEventListener("click", function(event){
        if(event.target.classList.contains("img_product")){
            const id = Number(event.target.id);
            const productFind = db.products.find(function(product){
                return product.id === id
            });
            red_square.innerHTML = `
        <div class="display_img">
            <img class="display" src='${productFind.image}' alt="image product">
            <h3><span>Name: </span>${productFind.name}</h3>
            <h3><span>Description: </span>${productFind.description}</h3>
            <h3><span>Category: </span>${productFind.category}</h3>
            <h3><span>Price: </span>${productFind.price}</h3>
            <h3><span>Stock: </span>${productFind.quantity}</h3>
        </div>
            `
            square_2.classList.add('active')
            red_square.classList.add('active')
        }
    })
}
function AddToCart(db){
    const product = document.querySelector('.hoodie_box');
    product.addEventListener('click', function(event){
        if(event.target.classList.contains('button')){
            const id = Number(event.target.id);
            const productFind = db.products.find(function(product){
                return product.id === id;
            })
            if(productFind.quantity === 0){
                return alert('Este producto no tiene stock')
            }
            if(db.cart[productFind.id]){{
                    if(productFind.quantity ===db.cart[productFind.id].amount){
                        return alert('No tenemos mas en bodega')
                    }
                }
                db.cart[productFind.id].amount++;
            } else {
                productFind.amount = 1;
                db.cart[productFind.id] = productFind;
            }
            window.localStorage.setItem('cart',JSON.stringify(db.cart));
            printToCart(db);
            totalCart(db);
        } 
    })
}
function printToCart(db){
    const cart_products = document.querySelector(`.cart_products`);
    let html = ``;
    for (const product in db.cart) {
        const { quantity, price, name, image, id, amount } = db.cart[product];
        html += `
            <div class="cart_product">

                <div class="cart_product_image">
                    <img class="cart" src="${image}" alt="image product"/>
                </div>
                <div class="cart_product_container">
                    <div class="cart_product_description">
                        <h3>${name}</h3>
                        <h4>Precio: ${price}</h4>
                        <p>Stock: ${quantity}</p>
                    </div>
                    <div id=${id} class="cart_counter">
                        <b class='less'>-</b>
                        <span>${amount}</span>
                        <b class='plus'>+</b>
                        <img class="thrash" src="./thrash.png" alt="">
                    </div>
                </div>

            </div>
        `;
    }
    cart_products.innerHTML =  html
}
function handleCart(db){
    const cart_products = document.querySelector('.cart_products') 
    cart_products.addEventListener('click', function(event){
        if(event.target.classList.contains('plus')){
            const id = Number(event.target.parentElement.id);
            const productFind = db.products.find (function(product){
                return product.id === id
            });
            if(db.cart[productFind.id]){
                if(productFind.quantity === db.cart[productFind.id].amount){
                return alert("no tenemos mas en bodega")
                }
            }
            db.cart[id].amount++;
        }
        if(event.target.classList.contains('less')){
            const id = Number(event.target.parentElement.id);
            if(db.cart[id].amount === 1){
                const response = confirm("¿Estas seguro que borrar este producto?");
                if(!response){
                    return;
                }
                delete db.cart[id];
            } else {
                db.cart[id].amount--;
            }
        }
        if(event.target.classList.contains('thrash')){
            const id = Number(event.target.parentElement.id);
            const response = confirm("¿Estas seguro que borrar este producto?");
            if(!response){
                return;
            }
            delete db.cart[id];
        }
        // console.log(event.target);
        window.localStorage.setItem('cart', JSON.stringify(db.cart));
        printToCart(db)
        totalCart(db)
    });
}
function totalCart(db){
    const info_span = document.querySelector('.header_cart span');
    const info_total = document.querySelector('.info_total');
    const info_amount =  document.querySelector('.info_amount');

    let totalProducts = 0;
    let amountProducts = 0;

    for (const product in db.cart) {
        amountProducts += db.cart[product].amount
        totalProducts += (db.cart[product].amount * db.cart[product].price);
    }

    info_total.textContent = 'Total: $'+totalProducts;
    info_amount.textContent = 'Cantidad: '+amountProducts;
    info_span.textContent = amountProducts;

}
function buyCart(db){
    const btnbuy = document.querySelector('.btn_buy');
    btnbuy.addEventListener('click', function()
    {
        if(!Object.keys(db.cart).length){
            return alert('no tienes productos para comprar');
        }
        const response = confirm('¿Seguro que quieres comprar?');
        if(!response){
            return;
        }
        for (const product of db.products) {
            const cartProduct =db.cart[product.id]; 
            if(product.id === cartProduct?.id){
                product.quantity -= cartProduct.amount
            }
        }
        db.cart = {}
        window.localStorage.setItem('products', JSON.stringify(db.products));
        window.localStorage.setItem('cart', JSON.stringify(db.cart));
        printProducts(db)
        printToCart(db)
        totalCart(db)
    });
}
async function main(){
    const db = {
        products: JSON.parse(window.localStorage.getItem('products')) || await getApi(),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
    }
    events();
    getImages(db);
    modal_img(db);
    AddToCart(db);
    printToCart(db);
    handleCart(db);
    totalCart(db)
    buyCart(db)
}
main(); 