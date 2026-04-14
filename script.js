async function placeOrder() {
    // 1. Get the values from your HTML
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const addressField = document.getElementById("address");
    const totalValue = document.getElementById("total").innerText;

    // 2. Validation: Make sure fields aren't empty
    if (!nameField.value || !emailField.value || !addressField.value) {
        alert("Please fill in all checkout fields!");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // 3. Create a clean list of items for the email
    const orderItems = cart.map(item => `${item.name} ($${item.price.toFixed(2)})`).join("\n");

    // 4. Prepare the data for Formspree using FormData (Most Reliable)
    const formData = new FormData();
    formData.append("Customer Name", nameField.value);
    formData.append("Customer Email", emailField.value);
    formData.append("Delivery Address", addressField.value);
    formData.append("Items Ordered", orderItems);
    formData.append("Total Price", "$" + totalValue);

    try {
        // !!! REPLACE 'YOUR_ID' with the 8-character code from Formspree !!!
        const response = await fetch("https://formspree.io/f/YOUR_ID", {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            alert("Order successful! Sending email to phonyweng@gmail.com...");
            cart = []; // Clear the cart
            updateCart();
            // Clear the input fields
            nameField.value = "";
            emailField.value = "";
            addressField.value = "";
        } else {
            // This part helps you see what went wrong
            const errorData = await response.json();
            console.log("Formspree Error Details:", errorData);
            alert("Submission failed. Error: " + response.status);
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Check your internet connection!");
    }
}
