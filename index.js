const http = require('http')
const commits = require('./cache.json')
const getCommitHTML = require('./get-commit-html')

if (require.main === module) {
  createServer()
    .then(server => {
      const port = +process.env.PORT || 3000
      server.listen(port)
      console.log(`listening on http://localhost:${port}`)
    })
} else {
  module.exports = createServer
}

async function createServer () {
  console.log('# commits', commits.length)
  const server = http.createServer(async (req, res) => {
    console.log(req.method, req.url)
    const userCommit = req.url.match(/\w+/)
    const hash = Array.isArray(userCommit) ? userCommit[0] : commits[0].hash
    console.log('hash', hash)
    const commit = commits.find(c => c.hash === hash)
    if (!commit) return res.end('404')
    res.end(await getCommitHTML(commit, commits))
  })

  return server
}
