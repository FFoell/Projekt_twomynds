<?php
// Die URL von Solr (anpassen, falls erforderlich)
$solrUrl = 'http://localhost:8983/solr/productdata_core/select';

// Suchbegriff aus der GET-Anfrage abrufen
$searchQuery = isset($_GET['q']) ? $_GET['q'] : '';

// Überprüfen, ob der Suchbegriff leer ist
if (empty($searchQuery)) {
    http_response_code(400);
    echo json_encode(['error' => 'Suchbegriff darf nicht leer sein']);
    exit;
}

// Suchparameter im Format 'product_name:<Suchbegriff>' erstellen
$solrQuery = 'product_name:' . urlencode($searchQuery);

// URL für die Solr-Suche erstellen
$queryUrl = $solrUrl . '?q=' . $solrQuery . '&wt=json';

// Initialisierung von cURL
$ch = curl_init($queryUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Senden der Anfrage an Solr
$response = curl_exec($ch);

// Fehlerbehandlung
if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'Fehler beim Senden der Anfrage an Solr: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

// Überprüfen des HTTP-Statuscodes
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode(['error' => 'Fehler bei der Solr-Abfrage. HTTP-Code: ' . $httpCode]);
    exit;
}




// Die Antwort von Solr an den Client zurückgeben
header('Content-Type: application/json');
echo $response;
?>