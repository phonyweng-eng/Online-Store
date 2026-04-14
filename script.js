const products = [
    { id: 1, name: "Soda Can", price: 45, image: "https://i5.walmartimages.com/seo/Coca-Cola-Soda-Pop-12-fl-oz-Can_14a1f5dc-f8bf-4071-9aea-0f753c3eecf4.08041b7f0a409ee67d80e489be3c1c55.jpeg" },
    { id: 2, name: "Chocolate Bar", price: 35, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/2019-01-28_19_55_14_A_Snickers_bar_with_the_wrapper_still_intact_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg/1920px-2019-01-28_19_55_14_A_Snickers_bar_with_the_wrapper_still_intact_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg" },
    { id: 3, name: "Instant Noodles", price: 45, image: "https://cdn-next.cybassets.com/media/W1siZiIsIjE1NjgwL3Byb2R1Y3RzLzMxOTc4NDk1LzE2MDM3Njg1MDlfN2MzMDcxMDRjYTAzMjY4YzdlZjAuanBlZyJdLFsicCIsInRodW1iIiwiNjAweDYwMCJdXQ.jpeg?sha=b237442379719d23" },
    { id: 4, name: "Ham Sandwich", price: 60, image: "https://foodpanda.dhmedia.io/image/darkstores/nv-global-catalog/tw/1e8c51eb-8bab-45db-8591-2258f7a42666.jpg?width=176&height=176" },
    { id: 5, name: "Original flavor Pringles", price: 70, image: "https://b2eimg.pxec.com.tw/00176055/e8ca51b873274c3684d7bc20014df4a2.jpg" },
    { id: 6, name: "Milk Tea", price: 40, image: "https://img.91app.com/webapi/imagesV3/Cropped/SalePage/6678668/0/639058587178170000?v=1" }
];

let cart = [];

function loadProducts() {
    const container = document.getElementById("products");
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
    cart.push(product);
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
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

// COMBINED EMAIL & ORDER FUNCTION
async function placeOrder(event) {
    // If you are using a <form> tag, this prevents the page from reloading
    if(event) event.preventDefault(); 

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;

    if (!name || !email || !address) {
        alert("Please fill all fields");
        return;
    }

    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    // 1. Prepare the item list for the email body
    let orderList = "";
    cart.forEach(item => {
        orderList += `${item.name} ($${item.price.toFixed(2)})\n`;
    });

    const total = document.getElementById("total").innerText;

    // 2. Prepare the data for Formspree
    const formData = new FormData();
    formData.append("Customer Name", name);
    formData.append("Customer Email", email);
    formData.append("Delivery Address", address);
    formData.append("Items Ordered", orderList);
    formData.append("Total Amount", `$${total}`);

    // 3. Send the request (REPLACE 'PASTE_YOUR_ID_HERE' with your real Formspree ID)
    const response = await fetch("https://formspree.io/f/PASTE_YOUR_ID_HERE", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
        alert("Success! Your order has been sent to phonyweng@gmail.com");
        cart = []; // Clear the cart
        updateCart();
        // Reset form inputs
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("address").value = "";
    } else {
        alert("Error: Could not send order. Please check your internet or Formspree ID.");
    }
}

// Start the page
loadProducts();
