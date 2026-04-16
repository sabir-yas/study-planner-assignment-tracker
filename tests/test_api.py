"""T20–T27: Flask API endpoint tests."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

import pytest
import repository as repo
from app import create_app


@pytest.fixture
def client(tmp_path, monkeypatch):
    tmp_file = tmp_path / "assignments.json"
    monkeypatch.setattr(repo, "ASSIGNMENTS_FILE", tmp_file)
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


def post_valid(client, overrides=None):
    data = {"title": "Lab Report", "course": "BIO101", "due_date": "2026-04-15", "priority": "medium"}
    if overrides:
        data.update(overrides)
    return client.post("/api/assignments", json=data)


# T20
def test_get_assignments_empty(client):
    res = client.get("/api/assignments")
    assert res.status_code == 200
    body = res.get_json()
    assert body == {"assignments": []}


# T21
def test_post_assignment_valid(client):
    res = post_valid(client)
    assert res.status_code == 201
    body = res.get_json()
    assert "id" in body
    assert body["title"] == "Lab Report"
    assert body["course"] == "BIO101"
    assert body["completed"] is False


# T22
def test_post_assignment_missing_field(client):
    res = client.post("/api/assignments", json={"course": "BIO101", "due_date": "2026-04-15", "priority": "low"})
    assert res.status_code == 400
    assert "error" in res.get_json()


# T23
def test_put_assignment_valid(client):
    created = post_valid(client).get_json()
    res = client.put(f"/api/assignments/{created['id']}", json={"title": "Updated Lab"})
    assert res.status_code == 200
    assert res.get_json()["title"] == "Updated Lab"


# T24
def test_put_assignment_not_found(client):
    res = client.put("/api/assignments/nonexistent-id", json={"title": "X"})
    assert res.status_code == 404
    assert "error" in res.get_json()


# T25
def test_delete_assignment_valid(client):
    created = post_valid(client).get_json()
    res = client.delete(f"/api/assignments/{created['id']}")
    assert res.status_code == 200
    # verify it's gone
    all_res = client.get("/api/assignments").get_json()
    assert all_res["assignments"] == []


# T26
def test_delete_assignment_not_found(client):
    res = client.delete("/api/assignments/nonexistent-id")
    assert res.status_code == 404
    assert "error" in res.get_json()


# T27
def test_patch_toggle_complete(client):
    created = post_valid(client).get_json()
    assert created["completed"] is False
    res = client.patch(f"/api/assignments/{created['id']}/complete")
    assert res.status_code == 200
    assert res.get_json()["completed"] is True
    # toggle back
    res2 = client.patch(f"/api/assignments/{created['id']}/complete")
    assert res2.get_json()["completed"] is False
