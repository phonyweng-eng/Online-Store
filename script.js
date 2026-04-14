const products = [
    { id: 1, name: "Soda Can", price: 45, image: "https://i5.walmartimages.com/seo/Coca-Cola-Soda-Pop-12-fl-oz-Can_14a1f5dc-f8bf-4071-9aea-0f753c3eecf4.08041b7f0a409ee67d80e489be3c1c55.jpeg" },
    { id: 2, name: "Chocolate Bar", price: 35, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/2019-01-28_19_55_14_A_Snickers_bar_with_the_wrapper_still_intact_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg/1920px-2019-01-28_19_55_14_A_Snickers_bar_with_the_wrapper_still_intact_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg" },
    { id: 4, name: "Ham Sandwich", price: 60, image: "https://foodpanda.dhmedia.io/image/darkstores/nv-global-catalog/tw/1e8c51eb-8bab-45db-8591-2258f7a42666.jpg?width=176&height=176" },
    { id: 6, name: "Milk Tea", price: 40, image: "https://img.91app.com/webapi/imagesV3/Cropped/SalePage/6678668/0/639058587178170000?v=1" }
];

let cart = [];

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
    if (!cartItems) return;
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        const div = document.createElement("div");
        div.innerHTML = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(div);
    });
    document.getElementById("total").innerText = total.toFixed(2);
}

async function placeOrder() {
    // 1. Get values and check if they exist
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const addressField = document.getElementById("address");

    if (!nameField.value || !emailField.value || !addressField.value) {
        alert("Please fill in all fields!");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // 2. Prepare order summary
    let orderSummary = cart.map(item => `${item.name} ($${item.price.toFixed(2)})`).join(", ");
    const total = document.getElementById("total").innerText;

    // 3. Prepare data for Formspree
    const formData = new FormData();
    formData.append("Name", nameField.value);
    formData.append("Email", emailField.value);
    formData.append("Address", addressField.value);
    formData.append("Order", orderSummary);
    formData.append("Total", "$" + total);

    try {
        // REPLACE 'YOUR_ID' with your random Formspree string
        const response = await fetch("https://formspree.io/f/YOUR_ID", {
            method: "POST",
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            alert("Order sent to phonyweng@gmail.com!");
            cart = [];
            updateCart();
            nameField.value = "";
            emailField.value = "";
            addressField.value = "";
        } else {
            alert("Formspree Error: Make sure your ID is correct.");
        }
    } catch (err) {
        alert("Connection Error. Are you online?");
    }
}

loadProducts();
