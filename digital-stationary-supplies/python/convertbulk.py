import json

def load_json_from_file(file_path):
    """Lädt JSON-Daten aus einer Datei."""
    with open(file_path, 'r') as file:
        return json.load(file)

def convert_to_bulk_format(data, index_name="user_interactions"):
    """Konvertiert JSON-Daten in das Elasticsearch Bulk-Format."""
    bulk_lines = []

    # Verarbeite page_visits
    for i, visit in enumerate(data.get('page_visits', []), start=1):
        bulk_lines.append(f'{{ "index" : {{ "_index" : "{index_name}", "_id" : "page_visit_{i}" }} }}')
        bulk_lines.append(json.dumps({
            "type": "page_visit",
            "page": visit['page'],
            "timestamp": visit['timestamp']
        }))

    # Verarbeite cart_interactions
    for i, interaction in enumerate(data.get('cart_interactions', []), start=1):
        bulk_lines.append(f'{{ "index" : {{ "_index" : "{index_name}", "_id" : "cart_interaction_{i}" }} }}')
        bulk_lines.append(json.dumps({
            "type": "cart_interaction",
            "product_name": interaction['product_name'],
            "timestamp": interaction['timestamp']
        }))

    # Verarbeite search_queries
    for i, query in enumerate(data.get('search_queries', []), start=1):
        bulk_lines.append(f'{{ "index" : {{ "_index" : "{index_name}", "_id" : "search_query_{i}" }} }}')
        bulk_lines.append(json.dumps({
            "type": "search_query",
            "query": query['query'],
            "timestamp": query['timestamp']
        }))

    # Verarbeite page_durations
    for i, duration in enumerate(data.get('page_durations', []), start=1):
        bulk_lines.append(f'{{ "index" : {{ "_index" : "{index_name}", "_id" : "page_duration_{i}" }} }}')
        bulk_lines.append(json.dumps({
            "type": "page_duration",
            "page": duration['page'],
            "duration": duration['duration'],
            "timestamp": duration['timestamp']
        }))

    return '\n'.join(bulk_lines) + '\n'

def write_bulk_format_to_file(bulk_content, output_path):
    """Schreibt das Bulk-Format in eine Datei."""
    with open(output_path, 'w') as file:
        file.write(bulk_content)

def main():
    input_path = 'php/user_interactions.json'  
    output_path = 'output_bulk.txt'  

    # JSON-Daten laden
    data = load_json_from_file(input_path)
    
    # Konvertieren in Bulk-Format
    bulk_content = convert_to_bulk_format(data)
    
    # Schreiben der Bulk-Daten in eine Datei
    write_bulk_format_to_file(bulk_content, output_path)

    print(f"Bulk-Daten wurden in '{output_path}' geschrieben.")

if __name__ == '__main__':
    main()
