
const mongoose = require('mongoose')
const ARGS_LENGTH = process.argv.length
if (ARGS_LENGTH < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.jpgrf.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (ARGS_LENGTH === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name, number })
  
  person.save().then(result => {
    console.log(`added ${name} number: ${number} to phonebook`)
    mongoose.connection.close()
  })
} else if (ARGS_LENGTH === 3) {
    let allPersons
    Person.find({})
      .then(persons => {
        console.log('phonebook:')
        persons.forEach(p => console.log(`${p.name} ${p.number}`))
        mongoose.connection.close()
      })
      // .then(console.log(allPersons))
    
}
