// Funktion zum Hinzufügen von Produkten zum Warenkorb
function addToCart(product) {
    alert(product + " wurde in den Warenkorb gelegt!");
}

// Funktion zum Sortieren der Produkte
function sortProducts() {
    const container = document.getElementById('product-container');
    const products = Array.from(container.getElementsByClassName('product'));
    const sortBy = document.getElementById('sort').value;

    products.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price'));
        const priceB = parseFloat(b.getAttribute('data-price'));
        const relevanceA = parseInt(a.getAttribute('data-relevance'), 10);
        const relevanceB = parseInt(b.getAttribute('data-relevance'), 10);

        if (sortBy === 'relevance') {
            return relevanceB - relevanceA; 
        } else if (sortBy === 'price-asc') {
            return priceA - priceB; 
        } else if (sortBy === 'price-desc') {
            return priceB - priceA; 
        } else {
            return 0; // Keine Sortierung
        }
    });

    // Entferne alle Produkte aus dem Container
    container.innerHTML = '';

    // Füge die sortierten Produkte wieder hinzu
    products.forEach(product => container.appendChild(product));
}

// Event-Listener, um die Produkte beim Laden der Seite zu sortieren
document.addEventListener('DOMContentLoaded', () => {
    // Setze das Sortierauswahlfeld auf "Relevanz"
    document.getElementById('sort').value = 'relevance';
    sortProducts(); // Sortiere die Produkte beim Laden der Seite
});
