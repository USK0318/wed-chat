const express = require('express')
const path = require('path')
const app = express()
const hbs = require("hbs");
const PORT = process.env.PORT || 4000


const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`))

const io = require('socket.io')(server)

app.set("view engine", "hbs");
app.engine("html", hbs.__express);
hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.use(express.static(path.join(__dirname, 'public')))

app.get('',(req,res)=>{
  res.send('hello world ')
})

app.get('/send',(req,res)=>{
  res.render('index')
})

let socketsConected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

  socket.on('message', (data) => {
    // console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}
