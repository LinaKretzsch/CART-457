const express = require('express')
const app = express()

app.set('view-engine', 'html')

app.get('/', (req, res) => {
  res.render('index.html')
})

app.get('/login', (req , res) => {
  res.render('login.html')
})

app.get('/register', (req , res) => {
  res.render('register.html')
})

app.listen(3000)
