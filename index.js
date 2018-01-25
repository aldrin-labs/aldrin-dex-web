const fastify = require('fastify')()
const path = require('path')

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'dist'),
})

fastify.get('/:any', async (req, reply) => {
  reply.sendFile('index.html')
})

fastify.listen(3000, err => {
  if (err) throw console.error(err)
  console.log('server port 3k eee boii')
})
