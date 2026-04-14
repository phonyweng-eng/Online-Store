async function placeOrder() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const total = document.getElementById("total").innerText;

    if (!name || !email || !address) {
        alert("Please fill in all fields!");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const orderItems = cart.map(item => item.name).join(", ");

    // CHANGE: Use FormData instead of a JSON object
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Email", email);
    formData.append("Address", address);
    formData.append("Order Details", orderItems);
    formData.append("Total Price", "$" + total);

    try {
        // REPLACE 'YOUR_FORM_ID' with your 8-character Formspree code
        const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
            method: "POST",
            body: formData, // Sending the FormData object
            headers: {
                'Accept': 'application/json'
                // Note: We REMOVED 'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("Order successful! Sent to phonyweng@gmail.com");
            cart = [];
            updateCart();
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("address").value = "";
        } else {
            alert("Error: Check if your Formspree ID is correct and activated.");
        }
    } catch (error) {
        alert("Network error: Are you connected to the internet?");
    }
}
