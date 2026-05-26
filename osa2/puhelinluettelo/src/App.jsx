import { useState, useEffect } from 'react'
import PersonForm from './personForm'
// import update from './post'
// import getAll from './post'
// import create from './post'
// import remove from './post'
import Notification from './Notification'
import './index.css'
import * as postService from './post'



const App = () => {
  const [persons, setPersons] = useState([
    // { name: 'Arto Hellas', number: '040-123456' }, jne
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [addMessage, setAddMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')



  useEffect(() => {
    postService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      postService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))

          setMessageType('success')
          setAddMessage(`Deleted ${person.name}`)
          setTimeout(() => {
            setAddMessage(null)
          }, 5000);

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
      postService.update(existingPerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
          setMessageType('success')
          setAddMessage(`Updated ${newName}'s number`)
          setTimeout(() => {
            setAddMessage(null)
          }, 5000);
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setMessageType('error')
          setAddMessage(`Information of ${newName} has already been removed from server`)
          setTimeout(() => {
            setAddMessage(null)
          }, 5000);
        })
    }
    return
  }
  

    // setPersons(persons.concat(personObject))
    postService.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessageType('success')
        setAddMessage(`Added ${newName}`)
        setNewName('')
        setNewNumber('')
        setTimeout(() => {
          setAddMessage(null)
        }, 5000);
      })
      .catch(error => {
        setMessageType('error')
        setAddMessage('Failed to add person')
        setTimeout(() => {
          setAddMessage(null)
        }, 5000);
      })
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
      <Notification message={addMessage} type={messageType} />
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map(person => <li key={person.name}>{person.name} {person.number} {''} <button onClick={() => deletePerson(person.id)}>Delete</button></li>)}
      </ul>
    </div>
  )
}

export default App