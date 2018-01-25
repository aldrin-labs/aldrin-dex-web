const fastify = require('fastify')()
const path = require('path')
// Declare a route
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'dist'),
})

fastify.get('/', function (req, reply) {
  reply.sendFile('index.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
})

// Run the server!
fastify.listen(3000, function (err) {
  if (err) throw err
  fastify.log.info(`server listening on ${fastify.server.address().port}`)
})
