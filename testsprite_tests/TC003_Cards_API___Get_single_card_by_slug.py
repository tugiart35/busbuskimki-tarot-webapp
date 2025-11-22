import requests

def test_get_single_card_by_slug():
    base_url = "http://localhost:3000"
    api_key_name = "sbp_d20ce89d09f9d7346066e44eed8011b5a3a96fc4"
    api_key_value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bG9rZGtjZXJqcmJydHBobHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE0ODA5NywiZXhwIjoyMDczNzI0MDk3fQ.Z9GuxWdEpsAhnz405LM7aVBmZNyJbZOnOdi8A3cMKWI"

    headers = {
        "apikey": api_key_value,
        "Authorization": f"Bearer {api_key_value}"
    }

    # Use a known existing slug and locale for testing
    # If no such slug is provided, one would create a card before testing.
    # Here, assume "the-fool" as slug and "en" as locale for test purposes.

    slug = "the-fool"
    locale = "en"

    url = f"{base_url}/cards/{slug}?locale={locale}"

    try:
        response = requests.get(url, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    # Validate response
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    try:
        card_data = response.json()
    except ValueError:
        assert False, "Response is not in JSON format"

    # Validate that the returned card matches the slug and locale requested
    assert isinstance(card_data, dict), "Card data should be a JSON object"

    # Check slug presence and exact match
    assert "slug" in card_data, "Response JSON missing 'slug'"
    assert card_data["slug"] == slug, f"Expected slug '{slug}', got '{card_data['slug']}'"

    # Check locale is compatible or included in response if provided
    # It may be in a field called 'locale' or 'language', verify one
    assert "locale" in card_data or "language" in card_data, "Response JSON missing 'locale' or 'language'"

    loc_value = card_data.get("locale") or card_data.get("language")
    assert loc_value == locale, f"Expected locale '{locale}', got '{loc_value}'"


test_get_single_card_by_slug()