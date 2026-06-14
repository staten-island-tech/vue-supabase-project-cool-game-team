const { Server } = require('socket.io')

const PORT = process.env.PORT || 3002;

const io = new Server(PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  socket.on('join-game', (roomId) => {
    socket.join(roomId)
  })
  socket.on('game-state', (roomId, state) => {
    socket.to(roomId).emit('opponent-state', state)
  })
  socket.on('move-fruit', (roomId, data) => {
    socket.to(roomId).emit('opponent-move-fruit', data)
  })
})

