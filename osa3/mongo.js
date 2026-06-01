const mongoose = require('mongoose')
//import mongoose from 'mongoose'
//const { MongoClient, ServerApiVersion } = require('mongodb');

if (process.argv.length < 3) {
  console.log('Give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://konstakorsu_db_user:${password}@cluster0.e6cptsg.mongodb.net/test?appName=Cluster0`;

mongoose.set('strictQuery', false)
mongoose.connect(uri)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} 

else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} 

else {
  console.log('Invalid number of arguments. Use:')
  mongoose.connection.close()
}