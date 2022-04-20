import jsonServer from 'json-server'
import auth from 'json-server-auth'

const server = jsonServer.create()
const router = jsonServer.router('db.json',)
const middlewares = jsonServer.defaults({
  static: '../dist'
})

server.db = router.db

const rules = auth.rewriter({
  // Permission rules
  users: 600,
  messages: 640,
  "/": 600,
  // "db": 600,
  "/api/*": "/$1",
})

server.use(middlewares)
server.use(rules)
server.use(auth)
server.use(router)
server.listen(2242, () => {
  console.log('JSON Server is running')
})