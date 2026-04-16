const BASE_URL = "/api";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export async function fetchAssignments({ course = "", sort = "" } = {}) {
  const params = new URLSearchParams();
  if (course) params.set("course", course);
  if (sort) params.set("sort", sort);
  const query = params.toString() ? `?${params}` : "";
  return handleResponse(await fetch(`${BASE_URL}/assignments${query}`));
}

export async function createAssignment(data) {
  return handleResponse(
    await fetch(`${BASE_URL}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
}

export async function updateAssignment(id, data) {
  return handleResponse(
    await fetch(`${BASE_URL}/assignments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
}

export async function deleteAssignment(id) {
  return handleResponse(
    await fetch(`${BASE_URL}/assignments/${id}`, { method: "DELETE" })
  );
}

export async function toggleComplete(id) {
  return handleResponse(
    await fetch(`${BASE_URL}/assignments/${id}/complete`, { method: "PATCH" })
  );
}
