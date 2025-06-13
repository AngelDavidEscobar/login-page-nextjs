export async function createUser(userData: { name: string; email: string; password: string; role: string }) {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al crear usuario")
    }

    return await res.json()
  } catch (error: any) {
    throw new Error(error.message)
  }
}
