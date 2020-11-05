//Variaveis globais
let modalCount = 1;
let modalKey = 0;
let cart = [];

//Atalhos para facilitar
const qs = (e) => document.querySelector(e);
const qsa = (e) => document.querySelectorAll(e);
const cl = (e) => console.log(e);

//Listagem das pizzas
pizzaJson.map((pizza, index) => {

    //Copiar ou clonar a classe .pizza-item
    //O true faz com que clone tudo que tem dentro de determinado lugar
    //Node significa elementos HTML ou arvore Dom
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);

    //Adicionar um atributo em algum determinado elemento no html
    //Adicionar o atributo "data-key" linkando com a index no elemento ".pizza-item"
    pizzaItem.setAttribute('data-key', index);

    //Preencher as informaçoes de cada .pizza-item
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img; //Consegue-se usar a class e a tag num mesmo querySelector
    pizzaItem.querySelector('.pizza-item--price').innerHTML = pizza.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;

    //Abrir o Modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {

        //Cancelar o evento original (recarregar a pagina)
        e.preventDefault();

        //Identificar a pizza clicada
        let key = e.target.closest(".pizza-item").getAttribute("data-key");
        const pizzaKey = pizzaJson[key];
        modalCount = 1;
        modalKey = key;

        //Passar as informaçoes para o modal
        qs(".pizzaBig img").src = pizzaKey.img;
        qs(".pizzaInfo h1").innerHTML = pizzaKey.name;
        qs(".pizzaInfo--desc").innerHTML = pizzaKey.description;
        qs(".pizzaInfo--actualPrice").innerHTML = pizzaKey.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        qs(".pizzaInfo--size.selected").classList.remove("selected");
        qs(".pizzaInfo--qt").innerHTML = modalCount;
        qsa(".pizzaInfo--size").forEach((size, sizeIndex) => {

            if (sizeIndex == 2) size.classList.add("selected");

            const pizzaSizes = pizzaJson[key].sizes[sizeIndex];
            size.querySelector("span").innerHTML = pizzaSizes;
        })

        //Animaçao para o surgimento do modal
        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {

            qs('.pizzaWindowArea').style.opacity = 1;

        }, 200)
    })

    //Colar a classe .pizza-item em .pizza-area
    //O append cola tudo de uma vez
    //innerHTML cola um por um
    qs('.pizza-area').append(pizzaItem);

});

//---Eventos do Modal---//

/* FECHAR MODAL */
const closeModal = () => {

    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        qs('.pizzaWindowArea').style.display = "none";
    }, 500);

}
qsa(".pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton").forEach((item) => {

    item.addEventListener('click', closeModal);
});

/* MODIFICAR O QUANTIDADE DE PIZZAS */
qs(".pizzaInfo--qtmenos").addEventListener('click', () => {

    if (modalCount > 1) {

        modalCount--;
        qs(".pizzaInfo--qt").innerHTML = modalCount;
    }
});
qs(".pizzaInfo--qtmais").addEventListener('click', () => {

    modalCount++;
    qs(".pizzaInfo--qt").innerHTML = modalCount;
});

/* MODIFICAR O TAMNHO DAS PIZZAS */
qsa(".pizzaInfo--size").forEach((size, sizeIndex) => {

    size.addEventListener('click', () => {
        qs(".pizzaInfo--size.selected").classList.remove("selected");
        size.classList.add("selected");
    });
});

/* ADICIONAR AS INFORMAÇOES NO CARRINHO */
qs('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = Number(qs(".pizzaInfo--size.selected").getAttribute('data-key'));
    let Ident = pizzaJson[modalKey].id + "@" + size;
    let key = cart.findIndex((item) => item.Ident === Ident);
    let sum = modalCount * pizzaJson[modalKey].price;

    /*  
        1 - Qual é a pizza?
        2 - Qual é o tamanho?
        3 - Quantas pizzas?
    */

    //Verificar se a existencia da mesma pizza/tamanho no carrinho
    if (key > -1) {

        //Somar os itens ja existentes
        const carKey = cart[key];
        carKey.Quantidade += modalCount;

    } else {
        
        //Adicionar no carrinho
        cart.push({
            Id: pizzaJson[modalKey].id,
            Ident,
            Nome: pizzaJson[modalKey].name,
            Tamanho: size,
            Quantidade: modalCount
        });

    }

    //Atualizar carrinho
    updateCart();

    //Fechar modal
    closeModal();
});

/* CLICK NO CARRINHO (MOBILE)*/
qs('.menu-openner').addEventListener('click', () => {

    if (cart.length > 0) {

        qs('aside').style.left = '0';
    }

});
qs('.menu-closer').addEventListener('click', () => qs('aside').style.left = '100vw');

/* ATUALIZAR AS INFORMAÇOES DO CARRINHO */
function updateCart(){

    qs('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        
        const carrinho = qs('.cart');
        carrinho.innerHTML = "";

        qs('aside').classList.add('show');
        
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        
        for(let i in cart){

            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].Id);
            let cartItem = qs('.models .cart--item').cloneNode(true);
            let pizzaSizeName;
            subtotal += pizzaItem.price * cart[i].Quantidade;
            switch (cart[i].Tamanho) {
                case 0:
                    pizzaSizeName = "P"
                    break;

                case 1:
                    pizzaSizeName = "M"
                    break;

                case 2:
                    pizzaSizeName = "G"
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            //Adicionar as informaçoes no carrinho
            cartItem.querySelector('.cart--item img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item .cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].Quantidade;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                cart[i].Quantidade > 1 ? cart[i].Quantidade-- : cart.splice(i, 1);
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].Quantidade++;
                updateCart();
            });

            carrinho.append(cartItem);
        }

        desconto = subtotal * 0.10;
        total = subtotal - desconto;

        qs('.subtotal span:last-child').innerHTML = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        qs('.desconto span:last-child').innerHTML = desconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        qs('.total span:last-child').innerHTML = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    } else {

        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }
    
}