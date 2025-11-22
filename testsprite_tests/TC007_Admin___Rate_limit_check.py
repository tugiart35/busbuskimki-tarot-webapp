import requests
import time

BASE_URL = "http://localhost:3000"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bG9rZGtjZXJqcmJydHBobHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE0ODA5NywiZXhwIjoyMDczNzI0MDk3fQ.Z9GuxWdEpsAhnz405LM7aVBmZNyJbZOnOdi8A3cMKWI"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
TIMEOUT = 30

def test_admin_rate_limit_check():
    url = f"{BASE_URL}/admin/login/rate-limit"
    
    # Sending multiple login attempts simulating admin login to check rate limiting.
    max_attempts = 10
    rate_limited = False
    last_status = None
    for i in range(max_attempts):
        response = requests.post(url, headers=HEADERS, timeout=TIMEOUT)
        last_status = response.status_code
        if response.status_code == 429:
            rate_limited = True
            break
        # small delay to not saturate immediately (simulate rapid attempts)
        time.sleep(0.2)

    # Assert we received some success or rate-limiting status code
    assert last_status in [200, 429], f"Unexpected status code: {last_status}"
    # There should eventually be a rate limiting response
    assert rate_limited, "Rate limiting was not enforced as expected."

test_admin_rate_limit_check()