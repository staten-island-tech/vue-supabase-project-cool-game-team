const { Server } = require('socket.io')

const io = new Server(3002, {
  cors: { 
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false
  }
})

io.on('connection', (socket) => {
  socket.on('join-game', (roomId) => {
    socket.join(roomId)
  })
  socket.on('game-state', (roomId, state) => {
    console.log(roomId, state)
    socket.to(roomId).emit('opponent-state', state)
  })
})

