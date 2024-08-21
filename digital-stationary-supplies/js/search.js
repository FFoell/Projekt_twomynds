document.addEventListener('DOMContentLoaded', function() {
    // Event-Listener für das Suchformular
    document.getElementById('search').addEventListener('submit', function(e) {
        e.preventDefault(); // Verhindert das normale Absenden des Formulars

        // Produkte-Container ausblenden
        document.getElementById('product-container').style.display = 'none';

        // Suchergebnisse-Container anzeigen
        document.getElementById('search-results').style.display = 'block';

        // Suchanfrage senden
        const query = document.getElementById('searchtext').value;
        const url = `php/search.php?q=${encodeURIComponent(query)}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Netzwerkantwort war nicht ok.');
                }
                return response.json();
            })
            .then(data => {
                const resultsList = document.getElementById('results-list');
                resultsList.innerHTML = ''; 

                if (data.response.numFound === 0) {
                    resultsList.innerHTML = '<p>Keine Ergebnisse gefunden.</p>';
                    return;
                }

                data.response.docs.forEach(product => {
                    const productElement = document.createElement('div');
                    productElement.className = 'product';
                    productElement.dataset.price = product.product_price.toFixed(2);
                    productElement.dataset.relevance = product._version_;
                    productElement.dataset.id = product.id;
                    productElement.dataset.name = product.product_name[0];
                    productElement.dataset.item_number = product.product_item_number;
                    productElement.dataset.category = product.product_category.join(', ');
                    productElement.dataset.writing_color = product.product_writing_color;
                    productElement.dataset.availability = product.product_availability ? 'verfügbar' : 'ausverkauft';
                    productElement.dataset.last_modified = product.product_data_last_modified;
                    productElement.dataset.image_path = product.product_image_path;

                    productElement.innerHTML = `
                        <div class="image-container">
                            <img src="${product.product_image_path}" alt="${product.product_name[0]}">
                        </div>
                        <div class="produkt-details">
                            <h3>${product.product_name[0]}</h3>
                            <table class="produkt-tabelle">
                                <tr>
                                    <td>Artikelnummer</td>
                                    <td>${product.product_item_number}</td>
                                </tr>
                                <tr>
                                    <td>Kategorie</td>
                                    <td>${product.product_category.join(', ')}</td>
                                </tr>
                                <tr>
                                    <td>Schreibfarbe</td>
                                    <td>${product.product_writing_color}</td>
                                </tr>
                                <tr>
                                    <td>Verfügbarkeit</td>
                                    <td>${product.product_availability ? 'verfügbar' : 'ausverkauft'}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="produkt-info">
                            <p>Preis: ${product.product_price.toFixed(2).replace('.', ',')} €</p>
                            <button onclick="addToCart('${product.product_name[0]}')">In den Warenkorb</button>
                        </div>
                    `;

                    resultsList.appendChild(productElement);
                });
            })
            .catch(error => {
                console.error('Fehler bei der Anfrage:', error);
                document.getElementById('results-list').innerHTML = '<p>Fehler bei der Suche.</p>';
            });
    });
});
