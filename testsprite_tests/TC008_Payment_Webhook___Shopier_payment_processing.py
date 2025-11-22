import requests
import hashlib
import hmac
import time

BASE_URL = "http://localhost:3000"
WEBHOOK_ENDPOINT = "/api/webhook/shopier"
API_KEY = "sbp_d20ce89d09f9d7346066e44eed8011b5a3a96fc4"
API_VALUE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bG9rZGtjZXJqcmJydHBobHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE0ODA5NywiZXhwIjoyMDczNzI0MDk3fQ.Z9GuxWdEpsAhnz405LM7aVBmZNyJbZOnOdi8A3cMKWI"
TIMEOUT = 30

def generate_shopier_signature(payload: dict, secret: str) -> str:
    # Shopier webhook signature is HMAC-SHA256 of the payload string (sorted keys, joined by &)
    # Build the string payload to sign from sorted keys (excluding signature itself)
    # For test purpose, simulate this signature generation similarly
    
    sorted_items = sorted(payload.items())
    sign_string = "&".join(f"{k}={v}" for k,v in sorted_items if k != "signature")
    signature = hmac.new(secret.encode(), sign_string.encode(), hashlib.sha256).hexdigest()
    return signature

def test_payment_webhook_shopier_payment_processing():
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "apikey": API_VALUE
    }

    # Sample valid payment confirmation payload
    payload = {
        "merchant_id": "123456789",
        "transaction_id": f"txn-{int(time.time()*1000)}",
        "order_id": "order1234",
        "amount": "100.00",
        "currency": "TRY",
        "status": "success",
        "pay_time": str(int(time.time())),
        # other shopier webhook fields can be added here
    }

    # Generate a valid signature for payload using API_KEY as secret
    signature = generate_shopier_signature(payload, API_KEY)
    payload["signature"] = signature

    url = BASE_URL + WEBHOOK_ENDPOINT

    # Test successful payment processing
    response = requests.post(url, headers=headers, data=payload, timeout=TIMEOUT)
    assert response.status_code == 200, f"Expected 200 OK but got {response.status_code}"
    resp_json = response.json()
    assert resp_json.get("status") == "success", "Payment processing failed or status not success"

    # Test with invalid signature (tampered)
    bad_payload = dict(payload)
    bad_payload["signature"] = "invalidsignature"

    bad_response = requests.post(url, headers=headers, data=bad_payload, timeout=TIMEOUT)
    assert bad_response.status_code == 400 or bad_response.status_code == 401, \
        "Expected 400 or 401 for invalid signature"
    bad_resp_json = bad_response.json()
    assert "error" in bad_resp_json, "Error message expected for invalid signature"

    # Test duplicate transaction detection by sending same transaction_id again
    dup_response = requests.post(url, headers=headers, data=payload, timeout=TIMEOUT)
    assert dup_response.status_code == 409 or dup_response.status_code == 400, \
        "Expected 409 Conflict or 400 Bad Request for duplicate payment"
    dup_resp_json = dup_response.json()
    assert "error" in dup_resp_json, "Error message expected for duplicate payment"

    # Optionally validate credit balance update and transaction log via GET endpoints
    # Assuming an API endpoint to retrieve user credit balance or transaction log (not provided in PRD)
    # These checks would require user context and reading the backend state - omitted here.

test_payment_webhook_shopier_payment_processing()