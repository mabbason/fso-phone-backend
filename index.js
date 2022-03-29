const { response } = require('express')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan((tokens, req, res) => {
  const baseLog = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
  const body = JSON.stringify(req.body)
  
  return req.method === "POST" ? `${baseLog} ${body}` : baseLog 
}))


app.disable('etag');

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

app.get('/api/persons', (req, res) => {
  res.status(200).send(persons)
})

app.get('/api/info', (req, res) => {
  const now = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
            <p>${now.toString()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.status(200).send(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end()
    res.text('Person not found')
  }
})

const generateId = () => Math.floor((Math.random() * 100000))

const isUniqueName = (name) => {
  return persons.every(p => p.name.toLowerCase().trim() !== name.toLowerCase().trim())
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({ error: "content missing" })
  }
  
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "must include name and number" })
  } else if (!isUniqueName(body.name)) {
    return res.status(400).json({ error: "name must be unique" })
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId(),
  }
  
  persons = [...persons, person]
  
  res.json(person)
})

const unknownEndpoint = (req, res) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
