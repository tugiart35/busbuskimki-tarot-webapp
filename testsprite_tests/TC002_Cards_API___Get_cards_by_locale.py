import requests

def test_cards_api_get_cards_by_locale():
    base_url = "http://localhost:3000"
    endpoint = "/api/cards"
    headers = {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bG9rZGtjZXJqcmJydHBobHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE0ODA5NywiZXhwIjoyMDczNzI0MDk3fQ.Z9GuxWdEpsAhnz405LM7aVBmZNyJbZOnOdi8A3cMKWI"
    }
    timeout = 30

    locales = ["tr", "en", "sr"]
    arcana_types = [None, "major", "minor"]  # example arcana types
    suits = [None, "cups", "swords", "pentacles", "wands"]  # example suits

    for locale in locales:
        for arcana in arcana_types:
            for suit in suits:
                params = {"locale": locale}
                if arcana:
                    params["arcanaType"] = arcana
                if suit:
                    params["suit"] = suit

                try:
                    response = requests.get(f"{base_url}{endpoint}", headers=headers, params=params, timeout=timeout)
                except requests.RequestException as e:
                    assert False, f"Request failed for locale={locale}, arcanaType={arcana}, suit={suit}: {e}"

                assert response.status_code == 200, f"Unexpected status code {response.status_code} for locale={locale}, arcanaType={arcana}, suit={suit}"

                json_data = None
                try:
                    json_data = response.json()
                except ValueError:
                    assert False, f"Response is not valid JSON for locale={locale}, arcanaType={arcana}, suit={suit}"

                # Validate response structure
                assert isinstance(json_data, list), f"Response JSON is not a list for locale={locale}, arcanaType={arcana}, suit={suit}"

                # Further validation: every card should have locale matching the request, and optional filters if present
                for card in json_data:
                    assert isinstance(card, dict), "Card item is not a dict"
                    assert "locale" in card, "Card missing 'locale' field"
                    assert card["locale"] == locale, f"Card locale mismatch: expected {locale}, got {card['locale']}"

                    if arcana:
                        assert "arcanaType" in card, "Card missing 'arcanaType' field"
                        assert card["arcanaType"].lower() == arcana, f"Card arcanaType mismatch: expected {arcana}, got {card['arcanaType']}"

                    if suit:
                        # Suit might be null or omitted for major arcana, so only validate if suit filter is set and card has suit
                        card_suit = card.get("suit")
                        assert card_suit is not None, "Card missing 'suit' field"
                        assert card_suit.lower() == suit, f"Card suit mismatch: expected {suit}, got {card_suit}"

test_cards_api_get_cards_by_locale()