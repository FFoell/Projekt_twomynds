<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    // Dekodiere die JSON-Daten
    $postData = json_decode($data, true);

    if ($postData) {
        // Definiere den Pfad zur JSON-Datei
        $file = '/Applications/XAMPP/xamppfiles/htdocs/digital-stationary-supplies/php/user_interactions.json';
        
        // Wenn die Datei existiert, lade die existierenden Daten
        $existingData = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

        // Füge Seitenbesuche hinzu
        if (isset($postData['visits'])) {
            $existingData['page_visits'] = array_merge($existingData['page_visits'] ?? [], $postData['visits']);
        }

        // Füge Warenkorb-Interaktionen hinzu
        if (isset($postData['cart_interactions'])) {
            $existingData['cart_interactions'] = array_merge($existingData['cart_interactions'] ?? [], $postData['cart_interactions']);
        }

        // Füge Suchanfragen hinzu
        if (isset($postData['search_queries'])) {
            $existingData['search_queries'] = array_merge($existingData['search_queries'] ?? [], $postData['search_queries']);
        }

        // Füge Verweildauern hinzu
        if (isset($postData['page_durations'])) {
            $existingData['page_durations'] = array_merge($existingData['page_durations'] ?? [], $postData['page_durations']);
        }

        // Speichere die zusammengeführten Daten in die JSON-Datei
        $result = file_put_contents($file, json_encode($existingData, JSON_PRETTY_PRINT));

        // Überprüfe, ob das Schreiben in die Datei erfolgreich war
        if ($result === false) {
            echo "Failed to write data to file.";
        } else {
            echo "Data saved successfully.";
        }
    } else {
        echo "No valid data received.";
    }
} else {
    echo "Invalid request method.";
}
?>
