const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()
const Person = require('./models/persons')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', async (request, response, next) => {
  try {
    const persons = await Person.find({})
    console.log('Mongo returned:', persons)
    response.json(persons)
  } catch (error) {
    next(error)
  }
})



let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]


/*
app.get('/api/persons', (req, res) => {
  res.json(persons)
})
*/



app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments({})
    const date = new Date()
    res.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    `)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (person) {
      res.json(person)
    } else {
      res.status(404).json({ error: 'person not found' })
    }
  } catch (error) {
    next(error)
  }

})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body

    if (!name || !number) {
      return res.status(400).json({ error: 'name or number missing' })
    }

    const person = new Person({ name, number })

    const savedPerson = await person.save()
    res.json(savedPerson)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const person = {
    name,
    number,
  }

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})