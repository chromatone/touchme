const jsonServer = require('json-server')
const auth = require('json-server-auth')

// https://www.npmjs.com/package/json-server-auth
// https://github.com/typicode/json-server#api
// https://jasonwatmore.com/post/2021/09/20/fetch-http-put-request-examples
// https://glitch.com/edit/#!/powerful-scented-galley?path=index.js%3A1%3A0

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