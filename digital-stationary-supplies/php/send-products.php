<?php
header('Content-Type: application/json');

// Prüfen, ob die Anfrage POST ist
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Empfangen der Produktdaten aus der Anfrage
    $data = file_get_contents('php://input');
    $jsonData = json_decode($data, true);

    // Validierung der empfangenen Daten
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['error' => 'Ungültige JSON-Daten']);
        http_response_code(400);
        exit;
    }

    $productId = $jsonData['id'];
    $newLastModified = $jsonData['product_data_last_modified'];

    // URL von Solr für die Abfrage
    $solrQueryUrl = 'http://localhost:8983/solr/productdata_core/select?q=id:' . urlencode($productId) . '&fl=product_data_last_modified&rows=1';

    // Initialisierung von curl für die Abfrage
    $ch = curl_init($solrQueryUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Senden der Anfrage an Solr
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        // Fehlerbehandlung
        $error = curl_error($ch);
        curl_close($ch);
        echo json_encode(['error' => 'Fehler beim Abrufen der Daten von Solr: ' . $error]);
        http_response_code(500);
        exit;
    }

    // Überprüfen des HTTP-Statuscodes
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        echo json_encode(['error' => 'Fehler beim Abrufen der Daten. HTTP-Code: ' . $httpCode]);
        http_response_code($httpCode);
        exit;
    }

    // Überprüfen, ob Daten vorhanden sind
    $result = json_decode($response, true);
    $currentLastModified = null;

    if (isset($result['response']['docs'][0]['product_data_last_modified'])) {
        $currentLastModified = $result['response']['docs'][0]['product_data_last_modified'];
    }

    // Debug-Ausgabe
    error_log("Current Last Modified: " . $currentLastModified);
    error_log("New Last Modified: " . $newLastModified);

    // Überprüfen, ob der Datensatz nicht vorhanden ist oder der Zeitstempel sich geändert hat
    if ($currentLastModified !== $newLastModified || $currentLastModified === null) {
        // URL von Solr für die Aktualisierung
        $solrUpdateUrl = 'http://localhost:8983/solr/productdata_core/update/json?commit=true';

        // Initialisierung von curl für die Aktualisierung
        $ch = curl_init($solrUpdateUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'add' => ['doc' => $jsonData]
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);

        // Senden der Anfrage an Solr
        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            // Fehlerbehandlung
            $error = curl_error($ch);
            curl_close($ch);
            echo json_encode(['error' => 'Fehler beim Weiterleiten der Anfrage an Solr: ' . $error]);
            http_response_code(500);
            exit;
        }

        // Überprüfung des HTTP-Statuscodes
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            echo json_encode(['error' => 'Fehler beim Hinzufügen des Produkts. HTTP-Code: ' . $httpCode]);
            http_response_code($httpCode);
            exit;
        }

        echo json_encode(['success' => 'Produkt erfolgreich aktualisiert']);
    } else {
        echo json_encode(['success' => 'Keine Änderung festgestellt. Produkt wurde nicht aktualisiert.']);
    }
} else {

    echo json_encode(['error' => 'Nur POST-Anfragen sind erlaubt']);
    http_response_code(405);
}
?>
