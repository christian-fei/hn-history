const http = require('http')
const simpleGit = require('simple-git')
const git = simpleGit()
const Convert = require('ansi-to-html')
let convert = new Convert()

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
  const log = await git.log()
  const commits = log.all.filter(l => l.message.startsWith('Latest'))
  const hashes = commits.map(l => l.hash)
  console.log('# commits', hashes.length)
  let commit = hashes[0]
  // console.log(log)
  const server = http.createServer(async (req, res) => {
    // commit = req.url
    console.log(req.method, req.url)
    const userCommit = req.url.match(/\w+/)
    if (userCommit) {
      commit = userCommit[0]
    }
    const diff = await git.show(commit).catch(Function.prototype)
    if (!diff) return res.end()
    console.log('commit', commit)
    // console.log('diff', diff)
    res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>hn-history</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    </head>
    <body>
      <div class="container-xl">
        <div class="row">
          <div class="col-md-5" style="max-height: 100vh; overflow-y: scroll">
            ${commits.map(c => `<div>
              <a href="/${c.hash}" data-toggle="tooltip" data-placement="top" title="${c.message + '\n' + c.date + '\n' + c.author_name}">${c.hash}</a>
            </div>`).join('')}
          </div>
          <div class="col-md-7" style="max-height: 100vh; overflow-y: scroll">
            <pre>${convert.toHtml(diff)}</pre>
          </div>
        </div>
      </div>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
      <script type="text/javascript">
        $(function () {
          $('[data-toggle="tooltip"]').tooltip()
        })
      </script>
    </body>
    </html>
    `)
  })

  return server
}
