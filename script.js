// Store Product Data List with optimized image dimensions
const products = [
    { id: 1, name: "Soda Can", price: 45, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=60" },
    { id: 2, name: "Chocolate Bar", price: 35, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=60" },
    { id: 3, name: "Instant Noodles", price: 45, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=60" },
    { id: 4, name: "Ham Sandwich", price: 60, image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&auto=format&fit=crop&q=60" },
    { id: 5, name: "Original flavor Pringles", price: 70, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=60" },
    { id: 6, name: "Milk Tea", price: 40, image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400&auto=format&fit=crop&q=60" }
];

let cart = [];

// Render layout elements dynamically onto the storefront grid
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

// Append selection elements to active cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        cart.push(product);
        updateCart();
    }
}

// Recalculate dynamic totals and update the panel HTML strings
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const totalSpan = document.getElementById("total");
    if (!cartItems || !totalSpan) return;
    
    cartItems.innerHTML = "";
    let total = 0;
    
    cart.forEach(item => {
        total += item.price;
        const div = document.createElement("div");
        div.innerText = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(div);
    });
    totalSpan.innerText = total.toFixed(2);
}

// Compile order values and trigger network post to Formspree endpoint
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
            alert("Submission failed. Did you verify your Formspree email?");
        }
    } catch (error) {
        alert("Connection Error. Check the console (F12).");
    } finally {
        btn.innerText = "Place Order";
        btn.disabled = false;
    }
}

loadProducts();
