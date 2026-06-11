const { Server } = require('socket.io')

const io = new Server(3002, {
  cors: { 
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log('player connected:', socket.id)
  socket.on('join-game', (roomId) => {
    socket.join(roomId)
  })

  socket.on('game-state', (roomId, state) => {
    console.log(roomId, state)
    socket.to(roomId).emit('opponent-state', state)
  })
})

console.log('Socket.io server running on port 3001')
