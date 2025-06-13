import { NextResponse } from "next/server"
import clientPromise from "../../../../lib/mongo"
import bcrypt from "bcryptjs"


const DATABASE_NAME = "aportes_linea"
const COLLECTION_NAME = "users"

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    // Verificar si el usuario ya existe
    
    const existingUser = await db.collection(COLLECTION_NAME).findOne({ email })
    //console.log(existingUser)
    if (existingUser) {
      return NextResponse.json({ message: "El usuario ya existe" }, { status: 400 })
    }
    
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el nuevo usuario
    const newUser = { name, email, password: hashedPassword, role, createdAt: new Date() }

    const result = await db.collection(COLLECTION_NAME).insertOne(newUser)

    return NextResponse.json(
      { message: "Usuario creado exitosamente", userId: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error al crear usuario" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)

    const users = await db.collection(COLLECTION_NAME).find().toArray()

   
    const formattedUsers = users.map((user: any) => ({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      password: user.password, 
      role: user.role,
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error al obtener usuarios" }, { status: 500 })
  }
}
