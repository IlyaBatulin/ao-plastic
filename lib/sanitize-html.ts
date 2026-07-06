/**
 * Лёгкий серверный санитайзер HTML для контента новостей (редактор TipTap).
 * Это защита в глубину: контент создаётся в админке, но мы всё равно убираем
 * опасные конструкции перед выводом через dangerouslySetInnerHTML.
 *
 * Подход — чёрный список самых опасных векторов XSS:
 *  - вырезаем теги-носители скриптов целиком (script/style/iframe/object/...)
 *  - удаляем inline-обработчики событий (on*)
 *  - чистим javascript:/vbscript:/data: в href/src
 */

const DANGEROUS_TAGS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "form",
  "svg",
  "math",
]

export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== "string") return ""

  let html = input

  // Удаляем опасные парные теги вместе с содержимым.
  for (const tag of DANGEROUS_TAGS) {
    const pair = new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi")
    html = html.replace(pair, "")
    // Одиночные/самозакрывающиеся варианты (link, meta, base).
    const single = new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi")
    html = html.replace(single, "")
  }

  // Удаляем inline-обработчики событий: onclick=, onerror= и т.п.
  html = html.replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
  html = html.replace(/\son\w+\s*=\s*'[^']*'/gi, "")
  html = html.replace(/\son\w+\s*=\s*[^\s>]+/gi, "")

  // Нейтрализуем опасные схемы в href/src.
  html = html.replace(
    /\s(href|src)\s*=\s*("|')\s*(javascript|vbscript|data)\s*:[^"']*\2/gi,
    ' $1="#"'
  )
  html = html.replace(
    /\s(href|src)\s*=\s*(javascript|vbscript|data)\s*:[^\s>]+/gi,
    ' $1="#"'
  )

  // Понижаем h1 до h2: h1 на странице новости уже занят заголовком,
  // второй h1 из контента редактора вредит SEO.
  html = html.replace(/<(\/?)h1(\b[^>]*)>/gi, "<$1h2$2>")

  return html
}
