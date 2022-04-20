const jsonServer = require('json-server')
const auth = require('json-server-auth')

const server = jsonServer.create()
const router = jsonServer.router('db.json',)
const middlewares = jsonServer.defaults({
  static: 'dist'
})

server.db = router.db

const rules = auth.rewriter({
  // Permission rules
  users: 640,
  sessions: 640,
  "/": 600,
  // "db": 600,
  "/api/*": "/$1",
})

server.use(middlewares)
server.use(rules)
server.use(auth)
server.use(router)
server.listen(2042, () => {
  console.log('JSON Server is running on http://localhost:2042')
})