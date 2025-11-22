import requests

BASE_URL = "http://localhost:3000"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bG9rZGtjZXJcmJydHBobHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE0ODA5NywiZXhwIjoyMDczNzI0MDk3fQ.Z9GuxWdEpsAhnz405LM7aVBmZNyJbZOnOdi8A3cMKWI"
HEADERS = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}


def test_auth_check_session_validation():
    timeout = 30
    auth_check_url = f"{BASE_URL}/auth-check"

    # Test GET method: should validate current session and return user role information
    try:
        get_response = requests.get(auth_check_url, headers=HEADERS, timeout=timeout)
    except requests.RequestException as e:
        assert False, f"GET request to auth-check failed: {e}"

    assert get_response.status_code == 200, f"Expected status code 200 for GET, got {get_response.status_code}"
    content_type = get_response.headers.get('Content-Type', '')
    assert 'application/json' in content_type.lower(), f"GET response Content-Type '{content_type}' does not contain 'application/json'"
    content = get_response.content
    assert content, "GET response content is empty"
    try:
        get_data = get_response.json()
    except ValueError:
        assert False, "GET response is not valid JSON"
    assert isinstance(get_data, dict), "GET response is not a JSON object"
    assert "role" in get_data, "GET response does not contain 'role'"
    assert get_data["role"] == "service_role", f"Expected role 'service_role', got {get_data['role']}"

    # Test POST method: validate session and retrieve user role information
    post_payload = {}  # Assuming no payload needed for validation or an empty object is accepted
    try:
        post_response = requests.post(auth_check_url, headers=HEADERS, json=post_payload, timeout=timeout)
    except requests.RequestException as e:
        assert False, f"POST request to auth-check failed: {e}"

    assert post_response.status_code == 200, f"Expected status code 200 for POST, got {post_response.status_code}"
    content_type = post_response.headers.get('Content-Type', '')
    assert 'application/json' in content_type.lower(), f"POST response Content-Type '{content_type}' does not contain 'application/json'"
    content = post_response.content
    assert content, "POST response content is empty"
    try:
        post_data = post_response.json()
    except ValueError:
        assert False, "POST response is not valid JSON"
    assert isinstance(post_data, dict), "POST response is not a JSON object"
    assert "role" in post_data, "POST response does not contain 'role'"
    assert post_data["role"] == "service_role", f"Expected role 'service_role', got {post_data['role']}"


test_auth_check_session_validation()
