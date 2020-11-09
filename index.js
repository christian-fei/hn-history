const http = require('http')

if (require.main === module) {
  const server = createServer()
  const port = +process.env.PORT || 3000
  server.listen(port)
  console.log(`listening on http://localhost:${port}`)
} else {
  module.exports = createServer
}

function createServer () {
  const server = http.createServer((req, res) => {
    console.log(req.url)
    res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>hn-history</title>
    </head>
    <body>
      <h1>
        hn-history
      </h1>
    </body>
    </html>
    `)
  })

  return server
}
