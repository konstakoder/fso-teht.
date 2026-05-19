import { useState } from 'react'
import PersonForm from './personForm'
import axios from 'axios'
import { useEffect } from 'react'
import getAll from './post'
import create from './post'
import update from './post'
import remove from './post'



const App = () => {
  const [persons, setPersons] = useState([
    // { name: 'Arto Hellas', number: '040-123456' }, jne
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')


  useEffect(() => {
    getAll.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      remove.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }


  const addPerson = (event) => {
    event.preventDefault()    
    const personObject = {
      name: newName,
      number: newNumber,
    }
  const existingPerson = persons.find(person => person.name === newName)

  if (existingPerson) {
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      update.update(existingPerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
    return
  }

    // setPersons(persons.concat(personObject))
    create.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      })
    setNewName('')
    setNewNumber('')
  }








const [numbers, setNumbers] = useState([
 { number: '' }
])

const [searchName, setSearchName] = useState('')

const filteredPersons = persons.filter(person => person.name && person.name.toLowerCase().includes(searchName.toLowerCase()))



  return (
    <div>
      <h2>Phonebook</h2>
      <input value={searchName} onChange={(e) => setSearchName(e.target.value)} />

      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map(person => <li key={person.name}>{person.name} {person.number} {''} <button onClick={() => deletePerson(person.id)}>Delete</button></li>)}
      </ul>
    </div>
  )
}

export default App