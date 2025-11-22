import requests
import uuid

BASE_URL = "http://localhost:3000"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bG9rZGtjZXJqcmJydHBobHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE0ODA5NywiZXhwIjoyMDczNzI0MDk3fQ.Z9GuxWdEpsAhnz405LM7aVBmZNyJbZOnOdi8A3cMKWI"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
TIMEOUT = 30

def test_card_reactions():
    card_id = "the-fool"
    fingerprint = str(uuid.uuid4())

    try:
        add_payload = {
            "card_id": card_id,
            "reaction": "like",
            "fingerprint": fingerprint
        }
        add_response = requests.post(
            f"{BASE_URL}/api/tarotokumasi/cards/reactions",
            headers=HEADERS,
            json=add_payload,
            timeout=TIMEOUT
        )
        assert add_response.status_code == 201, f"Add reaction failed: {add_response.text}"
        add_result = add_response.json()
        reaction_id = add_result.get("id")
        assert reaction_id, "Reaction ID missing in add response"
        assert add_result.get("reaction") == "like"
        assert add_result.get("card_id") == card_id
        assert add_result.get("fingerprint") == fingerprint

        update_payload = {
            "reaction": "love"
        }
        update_response = requests.put(
            f"{BASE_URL}/api/tarotokumasi/cards/reactions/{reaction_id}",
            headers=HEADERS,
            json=update_payload,
            timeout=TIMEOUT
        )
        assert update_response.status_code == 200, f"Update reaction failed: {update_response.text}"
        update_result = update_response.json()
        assert update_result.get("id") == reaction_id
        assert update_result.get("reaction") == "love"

        count_response = requests.get(
            f"{BASE_URL}/api/tarotokumasi/cards/reactions/count",
            headers=HEADERS,
            params={"card_id": card_id, "reaction": "love"},
            timeout=TIMEOUT
        )
        assert count_response.status_code == 200, f"Count retrieval failed: {count_response.text}"
        count_result = count_response.json()
        assert isinstance(count_result.get("count"), int), "Count is not an integer"
        assert count_result.get("count") >= 1, "Reaction count less than expected"

        remove_response = requests.delete(
            f"{BASE_URL}/api/tarotokumasi/cards/reactions/{reaction_id}",
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert remove_response.status_code == 204, f"Remove reaction failed: {remove_response.text}"

        get_removed_response = requests.get(
            f"{BASE_URL}/api/tarotokumasi/cards/reactions/{reaction_id}",
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert get_removed_response.status_code == 404, "Deleted reaction still accessible"

    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"


test_card_reactions()
