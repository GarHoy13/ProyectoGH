// servidor personalizado para la api del proyecto
// se usa esto porque json-server no permite controlar el formato de los ids

import { watch } from 'chokidar'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { App } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { json } from 'milliparsec'

const FILE = 'db.json'
const PORT = 3001

const db = new Low(new JSONFile(FILE), {})
await db.read()

// calcula el siguiente id numerico basandose en el maximo actual
function nextId(col) {
  if (!Array.isArray(col) || col.length === 0) return 1
  const max = col.reduce((m, item) => {
    const n = Number(item.id)
    return Number.isFinite(n) ? Math.max(m, n) : m
  }, 0)
  return max + 1
}

// busca un item por su id, compara como string para evitar problemas de tipo
function findById(col, id) {
  return col?.find((item) => String(item.id) === String(id))
}

// retorna el indice del elemento o -1 si no lo encuentra
function indexById(col, id) {
  return col?.findIndex((item) => String(item.id) === String(id)) ?? -1
}

const app = new App()

// CORS + body parser
app
  .use((req, res, next) =>
    cors({
      allowedHeaders: req.headers['access-control-request-headers']
        ?.split(',')
        .map((h) => h.trim()),
    })(req, res, next),
  )
  .options('*', cors())
  .use(json())

// obtener todos los elementos de una coleccion
app.get('/:name', (req, res) => {
  const data = db.data[req.params.name]
  if (data === undefined) return res.status(404).json({ error: 'Not Found' })
  res.json(data)
})

// obtener un solo elemento por id
app.get('/:name/:id', (req, res) => {
  const col = db.data[req.params.name]
  if (!Array.isArray(col)) return res.status(404).json({ error: 'Not Found' })
  const item = findById(col, req.params.id)
  if (!item) return res.status(404).json({ error: 'Not Found' })
  res.json(item)
})

// crear nuevo elemento, el id se asigna automaticamente
app.post('/:name', async (req, res) => {
  const col = db.data[req.params.name]
  if (!Array.isArray(col)) return res.status(404).json({ error: 'Not Found' })
  const item = { ...req.body, id: nextId(col) }
  col.push(item)
  await db.write()
  res.status(201).json(item)
})

// reemplazar un elemento completo
app.put('/:name/:id', async (req, res) => {
  const col = db.data[req.params.name]
  if (!Array.isArray(col)) return res.status(404).json({ error: 'Not Found' })
  const idx = indexById(col, req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not Found' })
  const item = { ...req.body, id: col[idx].id }
  col.splice(idx, 1, item)
  await db.write()
  res.json(item)
})

// actualizar solo algunos campos
app.patch('/:name/:id', async (req, res) => {
  const col = db.data[req.params.name]
  if (!Array.isArray(col)) return res.status(404).json({ error: 'Not Found' })
  const idx = indexById(col, req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not Found' })
  const item = { ...col[idx], ...req.body }
  col.splice(idx, 1, item)
  await db.write()
  res.json(item)
})

// eliminar un elemento por id
app.delete('/:name/:id', async (req, res) => {
  const col = db.data[req.params.name]
  if (!Array.isArray(col)) return res.status(404).json({ error: 'Not Found' })
  const idx = indexById(col, req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not Found' })
  const [item] = col.splice(idx, 1)
  await db.write()
  res.json(item)
})

app.listen(PORT, () => {
  const endpoints = Object.keys(db.data)
    .filter((k) => !k.startsWith('$'))
    .map((k) => `  http://localhost:${PORT}/${k}`)
    .join('\n')

  console.log(`
API server → http://localhost:${PORT}
IDs:        numéricos autoincrementales
Watching:   ${FILE}

Endpoints:
${endpoints}
`)
})

// se manda llamar si alguien edita el archivo db.json manualmente
let serverWriting = false
const _originalWrite = db.write.bind(db)
db.write = async () => {
  serverWriting = true
  await _originalWrite()
  setTimeout(() => {
    serverWriting = false
  }, 200)
}

watch(FILE).on('change', () => {
  if (!serverWriting) {
    db.read().catch(console.error)
  }
})
