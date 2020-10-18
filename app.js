const express = require('express')
const Joi = require('joi');
const morgan = require ('morgan')
const logger = require('./logger');
const app = express() // crear una instancia de express

// TODO: MiddlWare
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.use(morgan('tiny'))
console.log('Morgan Habilitado');

app.use(logger.log)

const usuarios =[
    {id:1, name:'jose'},
    {id:2, name:'Luis'},
    {id:3, name:'Marco'},
    {id:4, name:'Pedro'},
]
app.get('/',(req,res)=>{
    res.send('Hola mundo desde expres')
})

app.get('/api/numbers',(req,res)=>{
    res.send([1,2,3,4,5,6,7])
})
app.get('/api/users/',(req,res)=>{
    res.send(JSON.stringify(usuarios))
})
app.get('/api/users/:id',(req,res)=>{
   const user = usuarios.find(a=>a.id === parseInt(req.params.id) )
   if (!user) res.status(404).send('User not found')
   else res.send(user)
})

app.get("/api/user/:id/:name",(req,res)=>{
    res.send([req.params.id,req.params.name,req.params,req.query])
})


app.post("/api/users",(req,res)=>{
    // TODO VALIDACION BASICA
    //if (req.body.name.length < 2 || req.body.name ){
    //    res.status(404).send('Nombre invalido')
    //    return
    // }

    const schema = Joi.object({
        name: Joi.string()
        .min(3)
        .required()
    })
    const {error,value} = schema.validate({ name:req.body.name})
    if (!error){
        const user = {
            id : usuarios.length + 1,
            name: req.body.name 
        }
        usuarios.push(user)
        res.send(user)
    }
    else {
        const mensaje = error.details[0].message
        res.status(404).send(mensaje)
   
    }
})

app.put('/api/users/:id',(req,res)=>{
    const id_request = req.params.id
    const eschema = Joi.object({id:Joi.number().integer().min(1).required()})
    const {error,VA} = eschema.validate({id:id_request})
    if (!error) {
        const name = req.body.name
        const userFind = usuarios.find(a=>a.id==id_request)
        userFind.name = name
        res.send(userFind)
    }
    else res.status(404).send(error.details[0].message) 
})

app.delete('/api/users/:id',(req,res)=>{
    const id_request = req.params.id
    const userFind = usuarios.find(a=>a.id==id_request) 
    const index = usuarios.indexOf(userFind)
    usuarios.splice(index,1)
    res.send(userFind)
})


const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Escuchando en el puerto http://localhost:${PORT}`)
})