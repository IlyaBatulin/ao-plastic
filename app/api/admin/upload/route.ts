import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

export async function POST(req: NextRequest) {
  if (!(await hasAdminSectionAccess("upload"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 })
    }

    // Проверяем тип файла
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Файл должен быть изображением" }, { status: 400 })
    }

    // Проверяем размер файла (максимум 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Размер файла не должен превышать 5MB" }, { status: 400 })
    }

    // Создаем уникальное имя файла
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Генерируем имя файла: timestamp-random-originalname
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const extension = originalName.split(".").pop() || "jpg"
    const fileName = `${timestamp}-${random}.${extension}`

    // Папка загрузки: products по умолчанию, news — для новостей
    const rawFolder = req.nextUrl.searchParams.get("folder") || "products"
    const folder = rawFolder.replace(/[^a-z0-9_-]/gi, "") || "products"
    const uploadDir = join(process.cwd(), "public", "uploads", folder)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Сохраняем файл
    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // Возвращаем путь для использования в изображении
    const imageUrl = `/uploads/${folder}/${fileName}`

    return NextResponse.json({ url: imageUrl })
  } catch (error: any) {
    console.error("Ошибка загрузки файла:", error)
    return NextResponse.json({ error: error.message || "Ошибка загрузки файла" }, { status: 500 })
  }
}

