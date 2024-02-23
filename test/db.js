import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://bebogaravano:b.3823584568@cluster0.gcmvsft.mongodb.net/testingDesafio?retryWrites=true&w=majority')
.then(()=>console.log("conectado a db"))
.catch(error=>console.log(error))