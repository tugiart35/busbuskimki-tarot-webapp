import requests

BASE_URL = "http://localhost:3000"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bG9rZGtjZXJqcmJydHBobHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE0ODA5NywiZXhwIjoyMDczNzI0MDk3fQ.Z9GuxWdEpsAhnz405LM7aVBmZNyJbZOnOdi8A3cMKWI"

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

def test_admin_create_reading_session():
    """Test creating a new reading session as admin with validations"""
    url = f"{BASE_URL}/admin/reading-sessions"

    # Valid payload example based on description (email validation, spread key, reading type)
    payload = {
        "customer_email": "testcustomer@example.com",
        "spread_key": "love_spread",
        "reading_type": "Simple"
    }

    try:
        response = requests.post(url, json=payload, headers=HEADERS, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 201, f"Expected status code 201, got {response.status_code}"
    data = response.json()

    assert "id" in data, "Response JSON must contain 'id'"
    assert data.get("customer_email") == payload["customer_email"], "Customer email mismatch"
    assert data.get("spread_key") == payload["spread_key"], "Spread key mismatch"
    assert data.get("reading_type") == payload["reading_type"], "Reading type mismatch"

    created_session_id = data["id"]

    # Additional validations for email format and reading_type against allowed values
    # Assuming API does validation and returns 400 on invalid data

    # Try invalid email
    invalid_payload_email = payload.copy()
    invalid_payload_email["customer_email"] = "invalid-email"
    r2 = requests.post(url, json=invalid_payload_email, headers=HEADERS, timeout=30)
    assert r2.status_code == 400, "Invalid email should return 400 status"

    # Try invalid spread_key
    invalid_payload_spread = payload.copy()
    invalid_payload_spread["spread_key"] = "invalid_spread_key"
    r3 = requests.post(url, json=invalid_payload_spread, headers=HEADERS, timeout=30)
    assert r3.status_code == 400, "Invalid spread_key should return 400 status"

    # Try invalid reading_type
    invalid_payload_reading_type = payload.copy()
    invalid_payload_reading_type["reading_type"] = "InvalidType"
    r4 = requests.post(url, json=invalid_payload_reading_type, headers=HEADERS, timeout=30)
    assert r4.status_code == 400, "Invalid reading_type should return 400 status"

    # Cleanup: delete created session
    delete_url = f"{url}/{created_session_id}"
    try:
        del_response = requests.delete(delete_url, headers=HEADERS, timeout=30)
        assert del_response.status_code in (200, 204), f"Failed to delete test session with id {created_session_id}"
    except requests.RequestException as e:
        # just print error in cleanup, don't fail test here
        print(f"Cleanup delete failed: {e}")

test_admin_create_reading_session()