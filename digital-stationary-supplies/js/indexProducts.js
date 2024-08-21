document.addEventListener('DOMContentLoaded', async function() {
    // Funktion zum Senden der Produktdaten an das PHP-Skript
    async function indexProduct(productData) {
        try {
            const response = await fetch('php/send-products.php', { // URL des PHP-Skripts
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Produkt erfolgreich hinzugefügt:', productData.product_name);
            } else {
                console.error('Fehler beim Hinzufügen des Produkts:', data.error);
                alert('Fehler beim Hinzufügen des Produkts: ' + data.error);
            }
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Produkts:', error);
            alert('Fehler beim Hinzufügen des Produkts. Überprüfen Sie die Konsole für Details.');
        }
    }

    // Alle Produkte auf der Seite finden
    const products = document.querySelectorAll('.product');

    // Durch alle Produkte iterieren und die Daten sammeln
    for (const product of products) {
        const productData = {
            id: product.getAttribute('data-product-id'),
            product_name: product.getAttribute('data-product-name'),
            product_item_number: product.getAttribute('data-item_number'),
            product_writing_color: product.getAttribute('data-writing_color'),
            product_price: parseFloat(product.getAttribute('data-price')),
            product_category: product.getAttribute('data-category'),
            product_availability: product.getAttribute('data-availability') === 'true',
            product_data_last_modified : product.getAttribute('data-last-modified'),
            product_image_path : product.getAttribute('data-image-path')

        };

        // Produktdaten an das PHP-Skript senden
        await indexProduct(productData);
    }
});
