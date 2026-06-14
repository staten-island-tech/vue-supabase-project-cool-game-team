const { Server } = require('socket.io')

const io = new Server(3002, {
  cors: { 
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false
  }
})

io.on('connection', (socket) => {
  console.log('player connected:', socket.id)
  socket.on('join-game', (roomId) => {
    socket.join(roomId)
  })
  socket.onAny((event, ...args) => {
    console.log('ANY event received:', event, args)
  })
  socket.on('game-state', (roomId, state) => {
    console.log('game-state received:', roomId)
    console.log(roomId, state)
    socket.to(roomId).emit('opponent-state', state)
  })
})

