<!DOCTYPE html>
<html>
<head>
<title>QuickMart Convenience Store</title>

<style>
body{font-family:Arial;margin:0;background:#f5f5f5;}
header{background:#0a7a3d;color:white;padding:20px;text-align:center;}

/* 1. Added explicit grid constraints to keep the items from expanding infinitely */
.products{
    display:grid;
    grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));
    gap:20px;
    padding:30px;
    margin-right: 340px; /* Kept space for the cart */
}

/* 2. Added overflow hidden so giant images can't bleed out of the product card */
.product{
    background:white;
    padding:20px;
    border-radius:10px;
    box-shadow:0 4px 10px rgba(0,0,0,0.1);
    text-align:center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden; 
}

/* 3. Forced strict height and width containment */
.product-img {
    width: 100%;
    height: 150px;
    max-height: 150px;
    object-fit: contain; /* Changed from 'cover' to 'contain' so logos don't get cropped aggressively */
    border-radius: 8px;
    margin-bottom: 10px;
    background: #f9f9f9;
}

button{background:#0a7a3d;color:white;border:none;padding:10px 15px;cursor:pointer;border-radius:5px;}
button:hover{background:#06622f;}

.cart{position:fixed;right:20px;top:80px;width:280px;background:white;padding:20px;border-radius:10px;box-shadow:0 10px 20px rgba(0,0,0,0.2);max-height: 80vh; overflow-y: auto;}
input{width:100%;padding:8px;margin-top:5px;margin-bottom:10px;box-sizing: border-box;}
.cart-item {display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 14px;}
.remove-btn {background: #ff4d4d; padding: 2px 8px; font-size: 12px;}
.remove-btn:hover {background: #cc0000;}
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
// Swapped out the overly-massive or broken URLs with fast-loading, clean inventory product renders
const products=[
{id:1, name:"Soda Can", price: 45, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=60"},
{id:2, name:"Chocolate Bar", price: 35, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=60"},
{id:3, name:"Instant Noodles", price: 45, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=60"},
{id:4, name:"Ham Sandwich", price: 60, image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&auto=format&fit=crop&q=60"},
{id:5, name:"Original Pringles", price: 70, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=60"},
{id:6, name:"Milk Tea", price: 40, image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400&auto=format&fit=crop&q=60"}
];

let cart=[];

function loadProducts(){
const container=document.getElementById("products");
container.innerHTML = ""; // Clear grid before rendering
products.forEach(p=>{
const div=document.createElement("div");
div.className="product";
div.innerHTML=`
    <img src="${p.image}" class="product-img" alt="${p.name}">
    <h3>${p.name}</h3>
    <p>$${p.price.toFixed(2)}</p>
    <button onclick="addToCart(${p.id})">Add to Cart</button>
`;
container.appendChild(div);
});
}

function addToCart(id){
const product=products.find(p=>p.id===id);
const existingItem = cart.find(item => item.product.id === id);

if(existingItem) {
    existingItem.quantity += 1;
} else {
    cart.push({ product: product, quantity: 1 });
}
updateCart();
}

function removeFromCart(id) {
const itemIndex = cart.findIndex(item => item.product.id === id);
if (itemIndex > -1) {
    cart[itemIndex].quantity -= 1;
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
}
updateCart();
}

function updateCart(){
const cartItems=document.getElementById("cartItems");
cartItems.innerHTML="";
let total=0;

cart.forEach(item=>{
const itemTotal = item.product.price * item.quantity;
total += itemTotal;

const div=document.createElement("div");
div.className = "cart-item";
div.innerHTML=`
    <span>${item.product.name} x${item.quantity}</span>
    <span>$${itemTotal.toFixed(2)} <button class="remove-btn" onclick="removeFromCart(${item.product.id})">X</button></span>
`;
cartItems.appendChild(div);
});
document.getElementById("total").innerText=total.toFixed(2);
}

async function placeOrder(){
const name=document.getElementById("name").value.trim();
const email=document.getElementById("email").value.trim();
const address=document.getElementById("address").value.trim();
const btn=document.getElementById("submitBtn");

if(!name || !email || !address || cart.length === 0){
alert("Please fill all fields and add items to cart.");
return;
}

btn.innerText = "Sending Order...";
btn.disabled = true;

let orderDetails = cart.map(item => `${item.product.name} (x${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}`).join("\n");

try {
const response = await fetch("https://formspree.io/f/phonyweng@gmail.com", {
method: "POST",
headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
body: JSON.stringify({
_subject: "🛒 New QuickMart Order from " + name,
Customer_Name: name,
Customer_Email: email,
Delivery_Address: address,
Items: orderDetails,
Total_Price: "$" + document.getElementById("total").innerText
})
});

if (response.ok) {
alert("Order Sent! Please check phonyweng@gmail.com to confirm the Formspree activation email if this is your first time.");
cart=[];
updateCart();
document.getElementById("name").value = "";
document.getElementById("email").value = "";
document.getElementById("address").value = "";
} else {
alert("Submission failed. Make sure phonyweng@gmail.com has activated this email form setup on Formspree.");
}
} catch (error) {
alert("Connection error. Please try again.");
} finally {
btn.innerText = "Place Order";
btn.disabled = false;
}
}

loadProducts();
</script>

</body>
</html>
