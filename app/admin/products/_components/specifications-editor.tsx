"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Trash2, Edit2, Check, X, Code, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SpecificationsEditorProps {
  value: Record<string, any>
  onChange: (specs: Record<string, any>) => void
}

export function SpecificationsEditor({ value, onChange }: SpecificationsEditorProps) {
  const [specs, setSpecs] = useState<Array<{ key: string; value: any }>>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [editKey, setEditKey] = useState("")
  const [editValue, setEditValue] = useState("")
  const [jsonInput, setJsonInput] = useState("")
  const [jsonError, setJsonError] = useState<string | null>(null)

  // Преобразуем объект в массив при загрузке
  useEffect(() => {
    if (value && typeof value === "object") {
      const entries = Object.entries(value).map(([key, value]) => ({
        key,
        value: typeof value === "object" ? JSON.stringify(value) : String(value),
      }))
      setSpecs(entries)
    }
  }, [value])

  // Преобразуем массив обратно в объект при изменении
  const updateSpecs = (newSpecs: Array<{ key: string; value: any }>) => {
    setSpecs(newSpecs)
    const obj: Record<string, any> = {}
    newSpecs.forEach(({ key, value }) => {
      if (key.trim()) {
        // Пытаемся распарсить как число или boolean, иначе оставляем строкой
        let parsedValue: any = value
        if (typeof value === "string" && value.trim()) {
          // Пробуем распарсить JSON (для массивов)
          if (value.startsWith("[") || value.startsWith("{")) {
            try {
              parsedValue = JSON.parse(value)
            } catch {
              // Если не JSON, оставляем строкой
            }
          } else {
            // Пробуем распарсить число
            const numValue = Number(value)
            if (!isNaN(numValue) && value.trim() !== "") {
              parsedValue = numValue
            }
          }
        }
        obj[key.trim()] = parsedValue
      }
    })
    onChange(obj)
  }

  const handleAdd = () => {
    if (newKey.trim()) {
      updateSpecs([...specs, { key: newKey.trim(), value: newValue }])
      setNewKey("")
      setNewValue("")
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditKey(specs[index].key)
    setEditValue(specs[index].value)
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null && editKey.trim()) {
      const newSpecs = [...specs]
      newSpecs[editingIndex] = { key: editKey.trim(), value: editValue }
      updateSpecs(newSpecs)
      setEditingIndex(null)
      setEditKey("")
      setEditValue("")
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditKey("")
    setEditValue("")
  }

  const handleDelete = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index)
    updateSpecs(newSpecs)
  }

  const handleImportJson = () => {
    setJsonError(null)
    try {
      const parsed = JSON.parse(jsonInput)
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        setJsonError("JSON должен быть объектом (не массивом)")
        return
      }

      // Преобразуем объект в массив ключ-значение
      const newSpecs = Object.entries(parsed).map(([key, value]) => ({
        key,
        value: typeof value === "object" ? JSON.stringify(value) : String(value),
      }))
      updateSpecs(newSpecs)
      setJsonInput("")
    } catch (error: any) {
      setJsonError(`Ошибка парсинга JSON: ${error.message}`)
    }
  }

  const handleExportJson = () => {
    const obj: Record<string, any> = {}
    specs.forEach(({ key, value }) => {
      if (key.trim()) {
        let parsedValue: any = value
        if (typeof value === "string" && value.trim()) {
          if (value.startsWith("[") || value.startsWith("{")) {
            try {
              parsedValue = JSON.parse(value)
            } catch {
              parsedValue = value
            }
          } else {
            const numValue = Number(value)
            if (!isNaN(numValue) && value.trim() !== "") {
              parsedValue = numValue
            }
          }
        }
        obj[key.trim()] = parsedValue
      }
    })
    setJsonInput(JSON.stringify(obj, null, 2))
  }

  return (
    <Tabs defaultValue="table" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="table">Таблица</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>

      <TabsContent value="table" className="space-y-4 mt-4">
      {/* Таблица характеристик */}
      {specs.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Ключ</TableHead>
                <TableHead className="w-[50%]">Значение</TableHead>
                <TableHead className="w-[10%] text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specs.map((spec, index) => (
                <TableRow key={index}>
                  {editingIndex === index ? (
                    <>
                      <TableCell>
                        <Input
                          value={editKey}
                          onChange={(e) => setEditKey(e.target.value)}
                          className="h-8"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit()
                            if (e.key === "Escape") handleCancelEdit()
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit()
                            if (e.key === "Escape") handleCancelEdit()
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={handleSaveEdit}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{spec.key}</TableCell>
                      <TableCell>
                        {typeof spec.value === "object"
                          ? JSON.stringify(spec.value)
                          : String(spec.value)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleEdit(index)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Форма добавления */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Plus className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Добавить характеристику</Label>
        </div>
        <div className="grid md:grid-cols-[2fr_3fr_auto] gap-2">
          <Input
            placeholder="Ключ (например, Плотность_кг_м3)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newKey.trim()) {
                e.preventDefault()
                handleAdd()
              }
            }}
          />
          <Input
            placeholder="Значение (например, 1040 или [1, 2, 3] для массива)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newKey.trim()) {
                e.preventDefault()
                handleAdd()
              }
            }}
          />
          <Button type="button" onClick={handleAdd} disabled={!newKey.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Подсказка: для чисел введите число (1040), для массивов - JSON формат ([1, 2, 3]),
          для объектов - JSON формат ({"{a: 1}"})
        </p>
      </div>
      </TabsContent>

      <TabsContent value="json" className="space-y-4">
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Импорт/Экспорт JSON</Label>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportJson}
            >
              <Upload className="h-4 w-4 mr-2" />
              Экспортировать в JSON
            </Button>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder='{"Плотность_кг_м3": 1040, "Усадка_проц": "0.3-0.7"}'
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value)
                setJsonError(null)
              }}
              rows={12}
              className="font-mono text-sm"
            />
            {jsonError && (
              <p className="text-sm text-destructive">{jsonError}</p>
            )}
            {!jsonError && jsonInput && (
              <p className="text-xs text-muted-foreground">
                Вставьте JSON объект и нажмите "Импортировать"
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleImportJson}
              disabled={!jsonInput.trim()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Импортировать JSON
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setJsonInput("")
                setJsonError(null)
              }}
            >
              Очистить
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Пример JSON:</strong></p>
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`{
  "Плотность_кг_м3": 1040,
  "Усадка_проц": "0.3-0.7",
  "Применение": ["Детали автомобилей", "Бытовая техника"]
}`}
            </pre>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

