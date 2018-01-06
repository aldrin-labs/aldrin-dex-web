import React from 'react'
const fs = require('fs')
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

import ClientContainer from '../client/index'
import routes from '../client/routes'

const ServerContainer = request => (
  <ClientContainer>
    <StaticRouter location={request.url} context={{}}>
      {renderRoutes(routes)}
    </StaticRouter>
  </ClientContainer>
)

const fastify = require('fastify')()

fastify.get('*', async (request, reply) => {
  const stream = fs.createReadStream('./index.html')
  // reply.header('Content-Type', 'text/html')
  reply.type('text/html').send(stream)
  // reply.send('index.html')
})

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
