// not needed because server is hosted on railway in another repo
// had to be on another repo or else it would try to deploy the whole repo including nuxt
// commented out the code and didnt delete because it might be useful if 
// doing testing on local host in the future
/* const { createServer } = require("http")
const { Server } = require("socket.io")

const PORT = process.env.PORT || 3002

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
})

io.on("connection", (socket) => {
  console.log("connected:", socket.id)

  socket.on("join-game", (roomId) => {
    socket.join(roomId)
  })

  socket.on("game-state", (roomId, state) => {
    console.log('game-state received from room:', roomId) 
    socket.to(roomId).emit("opponent-state", state)
  })

  socket.on("move-fruit", (roomId, data) => {
    socket.to(roomId).emit("opponent-move-fruit", data)
  })
})

httpServer.listen(PORT, () => {
  console.log("Socket server running on", PORT)
}) */