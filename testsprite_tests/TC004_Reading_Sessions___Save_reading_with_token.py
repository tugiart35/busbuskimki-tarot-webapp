import requests

BASE_URL = "http://localhost:3000"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bG9rZGtjZXJqcmJydHBobHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE0ODA5NywiZXhwIjoyMDczNzI0MDk3fQ.Z9GuxWdEpsAhnz405LM7aVBmZNyJbZOnOdi8A3cMKWI"

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

def test_save_reading_with_token():
    url = f"{BASE_URL}/api/reading-sessions/save-reading"

    payload = {
        "reading": {
            "spread": "Love Spread",
            "cards": [
                {"card_id": 1, "orientation": "upright"},
                {"card_id": 12, "orientation": "reversed"},
                {"card_id": 25, "orientation": "upright"}
            ],
            "reading_type": "Simple"
        },
        "session_status": "active"
    }

    try:
        response = requests.post(url, headers=HEADERS, json=payload, timeout=30)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

    data = response.json()

    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    assert "session_id" in data, "Response missing 'session_id'"
    assert data.get("status") in ("active", "saved"), f"Unexpected session status: {data.get('status')}"
    assert "reading_id" in data, "Response missing 'reading_id'"
    assert isinstance(data.get("reading_id"), int) and data.get("reading_id") > 0, "Invalid 'reading_id' in response"


test_save_reading_with_token()
