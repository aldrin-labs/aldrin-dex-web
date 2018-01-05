import React from 'react'
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
  reply.header('Content-Type', 'text/html')
  reply.type('text/html')
  const ssr = `
  <!DOCTYPE html>
  <head>
    <title>Universal Reacl</title>
    <script src="/bundle.js" defer></script>
  </head>
  <body>

  <div id="app">${ReactDOMServer.renderToString(
    <ServerContainer request={request} />,
  )}</div>
  </body>
</html>`

  reply.send(ssr)
})

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
