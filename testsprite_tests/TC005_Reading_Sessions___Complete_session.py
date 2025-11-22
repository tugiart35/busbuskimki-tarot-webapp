import requests

BASE_URL = "http://localhost:3000"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bG9rZGtjZXJqcmJydHBobHJoIiwicm9sZSI6InNlcnZpY2VjZV9yb2xlIiwiaWF0IjoxNzU4MTQ4MDk3LCJleHAiOjIwNzM3MjQwOTd9.Z9GuxWdEpsAhnz405LM7aVBmZNyJbZOnOdi8A3cMKWI"
HEADERS = {"apikey": API_KEY, "Content-Type": "application/json"}

def test_reading_sessions_complete_session():
    # Create a new reading session first to complete it after
    create_session_payload = {
        "email": "testuser@example.com",
        "spread": "love_spread",
        "reading_type": "simple"
    }
    session = None
    try:
        create_response = requests.post(
            f"{BASE_URL}/api/admin/reading-sessions",
            json=create_session_payload,
            headers=HEADERS,
            timeout=30
        )
        assert create_response.status_code == 201, f"Session creation failed: {create_response.text}"
        session = create_response.json()
        session_id = session.get("id")
        assert session_id is not None, "Created session has no id"

        # Complete the session
        complete_payload = {
            "reading_id": session_id
        }
        complete_response = requests.post(
            f"{BASE_URL}/api/reading-sessions/complete",
            json=complete_payload,
            headers=HEADERS,
            timeout=30
        )
        assert complete_response.status_code == 200, f"Complete session failed: {complete_response.text}"
        result = complete_response.json()
        assert result.get("status") == "completed" or result.get("completed") is True, "Session not marked as completed"
        assert "reading_id" in result and result["reading_id"] == session_id, "reading_id missing or does not match"

        # Test token validation - sending with missing or wrong token
        invalid_headers = {"apikey": "invalid_token", "Content-Type": "application/json"}
        invalid_response = requests.post(
            f"{BASE_URL}/api/reading-sessions/complete",
            json=complete_payload,
            headers=invalid_headers,
            timeout=30
        )
        assert invalid_response.status_code == 401 or invalid_response.status_code == 403, "Invalid token not rejected"

    finally:
        # Cleanup - delete the created session
        if session and session_id:
            del_response = requests.delete(
                f"{BASE_URL}/api/admin/reading-sessions/{session_id}",
                headers=HEADERS,
                timeout=30
            )
            assert del_response.status_code in (200, 204), f"Session deletion failed: {del_response.text}"

test_reading_sessions_complete_session()