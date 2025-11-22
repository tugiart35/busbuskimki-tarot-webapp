import requests

BASE_URL = "http://localhost:3000"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bG9rZGtjZXJqcmJydHBobHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE0ODA5NywiZXhwIjoyMDczNzI0MDk3fQ.Z9GuxWdEpsAhnz405LM7aVBmZNyJbZOnOdi8A3cMKWI"
HEADERS = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
TIMEOUT = 30

def test_get_product_catalog():
    try:
        response = requests.get(f"{BASE_URL}/products", headers=HEADERS, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
        json_data = response.json()

        # Basic validation of response structure
        assert isinstance(json_data, dict), "Response is not a JSON object"
        # Check expected keys likely to be in product catalog response
        # For example, we expect categories like 'tarot_readings', 'numerology', 'premium_packages'
        expected_keys = ["tarot_readings", "numerology", "premium_packages"]
        for key in expected_keys:
            assert key in json_data, f"Response missing expected key '{key}'"
            assert isinstance(json_data[key], list), f"Key '{key}' should map to a list"

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_get_product_catalog()