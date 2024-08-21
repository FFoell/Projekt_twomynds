let commentCount = 0;

document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const feedbackText = document.getElementById('feedback').value;

    if (feedbackText.trim() !== '') {
        // Zähle das Feedback
        commentCount += 1;

        // Erstelle ein Feedback-Objekt
        const feedbackData = {
            commentCount: commentCount,
            feedback: feedbackText,
            timestamp: new Date().toISOString()
        };

        // Sende die Daten an Elasticsearch
        sendFeedbackToElasticsearch(feedbackData);

        // Feedback zur Liste hinzufügen
        const feedbackItem = document.createElement('div');
        feedbackItem.classList.add('feedback-item');
        feedbackItem.textContent = feedbackText;
        document.getElementById('feedback-list').appendChild(feedbackItem);

        // Textarea-Feld leeren
        document.getElementById('feedback').value = '';
    }
});

function sendFeedbackToElasticsearch(feedbackData) {
    fetch('http://localhost:9200/user_feedback/_doc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
    })
    .then(response => response.json())
    .then(data => console.log('Erfolgreich an Elasticsearch gesendet:', data))
    .catch(error => console.error('Fehler beim Senden an Elasticsearch:', error));
}
