import { useState } from 'react'
import PersonForm from './personForm'
import axios from 'axios'
import { useEffect } from 'react'



const App = () => {
  const [persons, setPersons] = useState([
    // { name: 'Arto Hellas', number: '040-123456' }, jne
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')


  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    if (persons.some(person => person.name === newName) || persons.some(person => person.number === newNumber)) {
      alert(`${newName} is already added to phonebook` + ` or the number ${newNumber} is already added to phonebook`)
      return
    }
    setPersons(persons.concat(personObject))
     setNewName('')
     setNewNumber('')
  }

const [numbers, setNumbers] = useState([
 { number: '' }
])

const [searchName, setSearchName] = useState('')

const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))




  return (
    <div>
      <h2>Phonebook</h2>
      <input value={searchName} onChange={(e) => setSearchName(e.target.value)} />

      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map(person => <li key={person.name}>{person.name} {person.number}</li>)}
      </ul>
    </div>
  )
}

export default App