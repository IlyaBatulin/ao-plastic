// Dedicated web-delivery assets; the original product videos remain unchanged.
const { spawnSync } = require('node:child_process')
const { mkdirSync, statSync } = require('node:fs')
const path = require('node:path')
const ffmpeg = require('ffmpeg-static')
const root = path.resolve(__dirname, '..', 'public', 'videos')
const output = path.join(root, 'hero')
mkdirSync(output, { recursive: true })
const clips = { factory: 'factory-video-day.mp4', abs: 'abs-category.mp4', polystyrene: 'polystyrene-category.mp4', dispersion: 'dispersion-home.mp4', hoztovary: 'xoztov.mp4' }
for (const [key, source] of Object.entries(clips)) {
  const input = path.join(root, source)
  for (const [variant, width, crf] of [['desktop', 1280, 23], ['mobile', 768, 25]]) {
    const file = path.join(output, `${key}-${variant}.mp4`)
    const result = spawnSync(ffmpeg, ['-y', '-v', 'error', '-i', input, '-an', '-vf', `scale=${width}:-2,setsar=1`, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-g', '48', '-movflags', '+faststart', file], { encoding: 'utf8' })
    if (result.status !== 0) throw new Error(result.stderr)
    console.log(key, variant, statSync(file).size)
  }
  const result = spawnSync(ffmpeg, ['-y', '-v', 'error', '-i', input, '-frames:v', '1', '-vf', 'scale=1280:-2,setsar=1', '-quality', '85', path.join(output, `${key}-poster.webp`)], { encoding: 'utf8' })
  if (result.status !== 0) throw new Error(result.stderr)
}
