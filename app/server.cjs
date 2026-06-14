const { Server } = require('socket.io')

const io = new Server(3002, {
  cors: { 
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false
  }
})
const fruitId = fruitCounter++;

io.on('connection', (socket) => {
  socket.on('join-game', (roomId) => {
    socket.join(roomId)
  })
  socket.on('game-state', (roomId, state) => {
    socket.to(roomId).emit('opponent-state', state)
  })
  socket.on('move-fruit', (roomId, data) => {
    io.to(roomId).emit('opponent-move-fruit', data)
  })
})

