const simpleGit = require('simple-git')
const git = simpleGit()

module.exports = async function getCommitsWithDiffs (length = 100) {
  const log = await git.log()
  const commits = log.all.filter(l => l.message.startsWith('Latest'))
  commits.length = length
  const diffs = await Promise.all(commits.map(c => git.show(c.hash)))
  return commits.map((c, index) => Object.assign(c, {
    diff: diffs[index]
  }))
}
