<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QuickMart Convenience Store</title>

<style>
/* General Layout Design */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    background: #f5f5f5;
}

header {
    background: #0a7a3d;
    color: white;
    padding: 20px;
    text-align: center;
}

/* Symmetrical Product Grid Layout */
.products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    padding: 30px;
    margin-right: 340px; /* Leaves clean room for the side checkout cart */
}

/* UNIFORM CARD CONTROL: Forces every block to have the exact same size and layout alignment */
.product {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    
    height: 320px; /* Locks matching vertical boundaries across all assets */
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Aligns all buttons uniformly at the bottom boundary */
    align-items: center;
    box-sizing: border-box;
    overflow: hidden; 
}

/* Strict Sizing on Images to avoid overflowing or giant elements */
.product-img {
    width: 100%;
    height: 140px;
    max-height: 140px;
    object-fit: contain; /* Shrinks and centers image proportional sizes cleanly */
    border-radius: 8px;
    margin-bottom: 10px;
    background: #f9f9f9;
}

/* Protects card boundaries from text name spillovers */
.product h3 {
    font-size: 16px;
    margin: 5px 0;
    width: 100%;
    white-space: nowrap;     /* Prevents multiple lines from shifting grid boxes */
    overflow: hidden;
    text-overflow: ellipsis; /* Appends clean '...' on exceptionally long titles */
}

.product p {
    margin: 5px 0;
    font-weight: bold;
    color: #333;
}

/* Store Interactive Buttons */
button {
    background: #0a7a3d;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    font-weight: bold;
    width: 100%; /* Spans across the card base uniformly */
}

button:hover {
    background: #06622f;
}

/* Stationary Floating Shopping Cart Panel */
.cart {
    position: fixed;
    right: 20px;
    top: 80px;
    width: 280px;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    max-height: 80vh;
    overflow-y: auto; /* Scrollbar handling for long customer selections */
}

/* Interactive Submission Input Box Sizing fixes */
input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
</head>

<body>

<header>
    <h1>QuickMart Convenience Store</h1>
    <p>Fast Snacks • Drinks • Everyday Essentials</p>
</header>

<div class="products" id="products"></div>

<div class="cart">
    <h3>Your Cart</h3>
    <div id="cartItems"></div>
    <hr>
    <b>Total: $<span id="total">0.00</span></b>
    
    <h3>Checkout</h3>
    <input id="name" placeholder="Full Name">
    <input id="email" placeholder="Email">
    <input id="address" placeholder="Delivery Address">
    <button id="submitBtn" onclick="placeOrder()">Place Order</button>
</div>

<script>
// Inventory dataset using high-resolution, web-optimized aspect links
const products = [
    { id: 1, name: "Soda Can", price: 45, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=60" },
    { id: 2, name: "Chocolate Bar", price: 35, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=60" },
    { id: 3, name: "Instant Noodles", price: 45, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=60" },
    { id: 4, name: "Ham Sandwich", price: 60, image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&auto=format&fit=crop&q=60" },
    { id: 5, name: "Original flavor Pringles", price: 70, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=60" },
    { id: 6, name: "Milk Tea", price: 40, image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400&auto=format&fit=crop&q=60" }
];

let cart = [];

// Dynamically generate the storefront layouts cleanly
function loadProducts() {
    const container = document.getElementById("products");
    if (!container) return;
    container.innerHTML = "";
    
    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <img src="${p.image}" class="product-img" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price.toFixed(2)}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        `;
        container.appendChild(div);
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        cart.push(product);
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const totalSpan = document.getElementById("total");
    if (!cartItems || !totalSpan) return;
    
    cartItems.innerHTML = "";
    let total = 0;
    
    cart.forEach(item => {
        total += item.price;
        const div = document.createElement("div");
        div.style.marginBottom = "5px";
        div.innerText = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(div);
    });
    totalSpan.innerText = total.toFixed(2);
}

// Submits the package data values straight to your target email address box
async function placeOrder() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const total = document.getElementById("total").innerText;
    const btn = document.getElementById("submitBtn");

    if (!name || !email || !address) {
        alert("Please fill in all fields!");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const orderSummary = cart.map(item => item.name).join(", ");

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Email", email);
    formData.append("Address", address);
    formData.append("Items Ordered", orderSummary);
    formData.append("Total Price", "$" + total);

    btn.innerText = "Sending...";
    btn.disabled = true;

    try {
        const response = await fetch("https://formspree.io/f/phonyweng@gmail.com", {
            method: "POST",
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            alert("Success! Order sent to phonyweng@gmail.com");
            cart = [];
            updateCart();
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("address").value = "";
        } else {
            alert("Submission failed. Make sure phonyweng@gmail.com has clicked 'Verify' or 'Activate' in the confirmation email sent by Formspree.");
        }
    } catch (error) {
        alert("Connection Error. Please try again.");
    } finally {
        btn.innerText = "Place Order";
        btn.disabled = false;
    }
}

// Trigger standard template initialization rules on interface launch
loadProducts();
</script>

</body>
</html>
