// Funktion um Cookies zu setzen
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Funktion für Cookie-Wert
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Tracke und aktualisiere Seitenbesuche
function trackPageVisit() {
    let visits = JSON.parse(getCookie('page_visits') || '[]');
    const currentPage = window.location.pathname;

    // Zählt aktuelle Seite als besucht
    visits.push({ page: currentPage, timestamp: new Date().toISOString() });

    // Update des Arrays mit Aufrufen
    setCookie('page_visits', JSON.stringify(visits), 7); // expires in 7 days
}

// Funktion zum Tracken der "In den Warenkorb"-Klicks
function trackAddToCart(productName) {
    let cartInteractions = JSON.parse(getCookie('cart_interactions') || '[]');

    // Füge Klick auf den "In den Warenkorb"-Button hinzu
    cartInteractions.push({ product_name: productName, timestamp: new Date().toISOString() });

    // Update des Arrays mit Klick-Interaktionen
    setCookie('cart_interactions', JSON.stringify(cartInteractions), 7); // expires in 7 days
}

// Funktion zum Tracken von Suchanfragen
function trackSearchQuery(query) {
    let searchQueries = JSON.parse(getCookie('search_queries') || '[]');

    // Füge die Suchanfrage hinzu
    searchQueries.push({ query: query, timestamp: new Date().toISOString() });

    // Update des Arrays mit Suchanfragen
    setCookie('search_queries', JSON.stringify(searchQueries), 7); // expires in 7 days
}

// Funktion zum Tracken der Verweildauer
function trackPageDuration() {
    const currentPage = window.location.pathname;
    const startTime = Date.now();
    
    // Speichert den Startzeitpunkt der Verweildauer in einem Cookie
    setCookie('page_start_time', startTime, 7); 
    
    // Wenn die Seite verlassen wird, wird die Dauer berechnet und gespeichert
    window.addEventListener('beforeunload', function() {
        const endTime = Date.now();
        const startTimeCookie = getCookie('page_start_time');
        
        if (startTimeCookie) {
            const duration = endTime - parseInt(startTimeCookie, 10); // Dauer in Millisekunden
            let durations = JSON.parse(getCookie('page_durations') || '[]');
            durations.push({
                page: currentPage,
                duration: duration,
                timestamp: new Date().toISOString()
            });
            setCookie('page_durations', JSON.stringify(durations), 7); 
        }
    });
}

// Sendet getrackte Daten an den Server
function sendTrackingData() {
    const pageVisits = getCookie('page_visits');
    const cartInteractions = getCookie('cart_interactions');
    const searchQueries = getCookie('search_queries');
    const pageDurations = getCookie('page_durations');
    
    const data = {
        visits: pageVisits ? JSON.parse(pageVisits) : [],
        cart_interactions: cartInteractions ? JSON.parse(cartInteractions) : [],
        search_queries: searchQueries ? JSON.parse(searchQueries) : [],
        page_durations: pageDurations ? JSON.parse(pageDurations) : []
    };

    fetch('http://localhost/digital-stationary-supplies/php/cookies.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(data => console.log('Server response:', data))
    .catch(error => console.error('Failed to send data:', error));
}

// Aktualisiere Cookies und sende Tracking-Daten beim Verlassen der Seite
function handlePageExit() {
    trackPageVisit();
    sendTrackingData();
}

// Event-Listener für den "In den Warenkorb"-Button
document.querySelectorAll('.add-to-cart-button').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.getAttribute('data-product-name'); 
        trackAddToCart(productName);
    });
});

// Event-Listener für das Suchformular
document.getElementById('search').addEventListener('submit', function(e) {
    e.preventDefault(); // Verhindert das normale Absenden des Formulars

    const query = document.getElementById('searchtext').value;
    trackSearchQuery(query);

});

// Initiales Tracking beim Laden der Seite
trackPageVisit();
trackPageDuration(); // Verweildauer Tracking starten

// Event-Listener für das Verlassen der Seite oder beim Schließen
window.addEventListener('beforeunload', function(event) {
    handlePageExit();
});
