#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const simpleGit = require('simple-git')
const git = simpleGit()

if (require.main === module) {
  createCache()
    .then(() => {
      console.log('written to cache.json')
    })
} else {
  module.exports = createCache
}

async function createCache () {
  const log = await git.log()
  const commits = log.all.filter(l => l.message.startsWith('Latest'))
  commits.length = 100
  console.log('#', commits.length)
  const diffs = await Promise.all(commits.map(c => git.show(c.hash)))
  const cache = commits.map((c, index) => Object.assign(c, {
    diff: diffs[index]
  }))
  fs.writeFileSync(path.resolve(__dirname, 'cache.json'), JSON.stringify(cache), { encoding: 'utf-8' })
}
