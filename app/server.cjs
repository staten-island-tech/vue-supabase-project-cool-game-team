const { Server } = require('socket.io')

const io = new Server(3001, {
  cors: { origin: 'http://localhost:3000' }
})

io.on('connection', (socket) => {
  socket.on('join-game', (roomId) => {
    socket.join(roomId)
  })

  socket.on('game-state', (roomId, state) => {
    console.log(roomID, state)
    socket.to(roomId).emit('opponent-state', state)
  })
})

console.log('Socket.io server running on port 3001')
