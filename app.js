const apiUrl = "http://localhost:8080/almo-sys/products";

const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const messageDiv = document.getElementById("message");
const formTitle = document.getElementById("form-title");
const cancelButton = document.getElementById("cancel-button");

const deleteModal = document.getElementById("deleteModal");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");

let editingProductId = null;
let currentProductId = null;


async function fetchProducts() {
    const response = await fetch(apiUrl);
    const products = await response.json();

    productList.innerHTML = "";
    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>${product.description}</td>
            <td>
                <button onclick="editProduct(${product.id}, '${product.name}', ${product.quantity}, ${product.price}, '${product.description}')">Editar</button>
                <button class="delete-btn" data-id="${product.id}" style="background-color: red;">Deletar</button>
            </td>
        `;
        productList.appendChild(row);
    });


    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", () => {
            currentProductId = button.dataset.id;
            deleteModal.style.display = "flex";
        });
    });
}


productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const quantity = document.getElementById("quantity").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;

    const productData = { name, quantity, price, description };

    if (editingProductId) {
        await fetch(`${apiUrl}/${editingProductId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        });
        editingProductId = null;
        formTitle.textContent = "Adicionar Produto";
        cancelButton.style.display = "none";
    } else {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        });
    }

    productForm.reset();
    showMessage("Produto salvo com sucesso!");
    fetchProducts();
});


confirmDelete.onclick = async () => {
    if (currentProductId) {
        await fetch(`${apiUrl}/${currentProductId}`, { method: "DELETE" });
        showMessage("Produto deletado com sucesso!");
        fetchProducts();
        currentProductId = null;
        deleteModal.style.display = "none";
    }
};


cancelDelete.onclick = () => {
    deleteModal.style.display = "none";
    currentProductId = null;
};


function editProduct(id, name, quantity, price, description) {
    document.getElementById("name").value = name;
    document.getElementById("quantity").value = quantity;
    document.getElementById("price").value = price;
    document.getElementById("description").value = description;

    editingProductId = id;
    formTitle.textContent = "Editar Produto";
    cancelButton.style.display = "inline";
}


cancelButton.addEventListener("click", () => {
    productForm.reset();
    editingProductId = null;
    formTitle.textContent = "Adicionar Produto";
    cancelButton.style.display = "none";
});


function showMessage(msg) {
    messageDiv.textContent = msg;
    setTimeout(() => (messageDiv.textContent = ""), 3000);
}


fetchProducts();