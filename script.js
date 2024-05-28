const menu = document.getElementById("menu")
const cartBtn = document.getElementById("card-btn")
const cardModal = document.getElementById("card-modal")
const cartItemsContainer = document.getElementById("card-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cardModal.style.display = "flex"
    
})

// Fechar o modal quando clicar fora
cardModal.addEventListener("click", function(event) {
    if (event.target === cardModal) {
        cardModal.style.display = "none"
    }
})

// Fechar o modal quando clicar no botão de fechar
closeModalBtn.addEventListener("click", function() {
    cardModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    //console.log(event.target)
    
    let parentButton = event.target.closest(".add-to-cart-btn")
    
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))  
        addToCart(name, price)
    }
})


// Função para adicionar no carrinho:
function addToCart(name, price){
    const existingItem = cart.find (item => item.name === name)   

     if(existingItem){

    existingItem.quantity += 1 ;
    return;
     } else{
        cart.push({
            name, 
            price,
            quantity: 1,  
        })
     }

     updateCartModal()
}

    
// Atualiza o carrinho

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "items-center", "w-full");

        cartItemElement.innerHTML = `
            <div class="flex justify-between w-full">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <div>
                    <button class="text-red-500 hover:text-red-700 ml-4 remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            </div>
        `;
        
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("bt-BR", {
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;
    
}

// Função para remover o item do carrinho
function removeItemFromCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }

        updateCartModal(); // Atualiza o modal do carrinho após remover o item
    }
}

// Adiciona um event listener ao container do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemFromCart(name);
    }
});

// Ação para pegar o endereço: 

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});


//Finalizar pedido

checkoutBtn.addEventListener("click", function() {

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
            text: "Ops!... Restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // sempre no top
            position: "left", // direita
            stopOnFocus: true, // quando passar o mouse n feche!
            style: {
              background: "#ef4444",
            },
        }).showToast();


        return;
    }


    if (cart.length === 0) return;
    if (addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }


    //enviar o pedido para api Whats
    const cartItems = cart.map((item) => {
        return `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} | `;
    }).join("")
    
   const message = encodeURIComponent(cartItems)
   const phone = "85997558133"

   window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
    
  // Limpar o carrinho após enviar a mensagem
cart.length = 0; // Esvaziar o array cart
updateCartModal(); // Atualizar o modal do carrinho

})


// Verificar a hora e manipular o card horário. 

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 20 && hora < 23; // true
}


const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-600");
}
