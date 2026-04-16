from flask import Flask, jsonify, request
from flask_cors import CORS

import service


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173"])

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": str(e)}), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": str(e)}), 404

    # ── GET /api/assignments ──────────────────────────────────────────────────
    @app.route("/api/assignments", methods=["GET"])
    def list_assignments():
        course = request.args.get("course") or None
        sort_by = request.args.get("sort") or None
        assignments = service.get_assignments(course_filter=course, sort_by=sort_by)
        result = [a.to_dict() for a in assignments]
        for item, assignment in zip(result, assignments):
            item["upcoming_soon"] = service.is_upcoming_soon(assignment)
        return jsonify({"assignments": result}), 200

    # ── POST /api/assignments ─────────────────────────────────────────────────
    @app.route("/api/assignments", methods=["POST"])
    def create_assignment():
        data = request.get_json(silent=True) or {}
        try:
            assignment = service.create_assignment(data)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        result = assignment.to_dict()
        result["upcoming_soon"] = service.is_upcoming_soon(assignment)
        return jsonify(result), 201

    # ── PUT /api/assignments/<id> ─────────────────────────────────────────────
    @app.route("/api/assignments/<assignment_id>", methods=["PUT"])
    def update_assignment(assignment_id: str):
        data = request.get_json(silent=True) or {}
        try:
            assignment = service.update_assignment(assignment_id, data)
        except KeyError as e:
            return jsonify({"error": str(e)}), 404
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        result = assignment.to_dict()
        result["upcoming_soon"] = service.is_upcoming_soon(assignment)
        return jsonify(result), 200

    # ── DELETE /api/assignments/<id> ──────────────────────────────────────────
    @app.route("/api/assignments/<assignment_id>", methods=["DELETE"])
    def delete_assignment(assignment_id: str):
        try:
            service.delete_assignment(assignment_id)
        except KeyError as e:
            return jsonify({"error": str(e)}), 404
        return jsonify({"message": "Assignment deleted"}), 200

    # ── PATCH /api/assignments/<id>/complete ──────────────────────────────────
    @app.route("/api/assignments/<assignment_id>/complete", methods=["PATCH"])
    def toggle_complete(assignment_id: str):
        try:
            assignment = service.toggle_complete(assignment_id)
        except KeyError as e:
            return jsonify({"error": str(e)}), 404
        result = assignment.to_dict()
        result["upcoming_soon"] = service.is_upcoming_soon(assignment)
        return jsonify(result), 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
