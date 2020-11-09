#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const commits = require('./cache.json')
// const getCommitsWithDiffs = require('./get-commits-with-diffs')
const getCommitHtml = require('./get-commit-html')

if (require.main === module) {
  makeStatic()
    .then(() => {
      console.log('written to _site')
    })
} else {
  module.exports = makeStatic
}

async function makeStatic () {
  // const commits = await getCommitsWithDiffs()
  console.log('#', commits.length)
  try { fs.rmdirSync(path.resolve(__dirname, '_site'), { recursive: true }) } catch (err) {}
  fs.mkdirSync(path.resolve(__dirname, '_site'))
  const prefix = process.env.CI ? '/hn-history' : ''

  for (const commit of commits) {
    if (commit.hash === commits[0].hash) {
      const html = await getCommitHtml(commit, commits, { prefix })
      const filename = 'index.html'
      const filepath = path.resolve(__dirname, '_site', filename)
      console.log('writing', filepath)
      fs.writeFileSync(filepath, html, { encoding: 'utf-8' })
    }
    const html = await getCommitHtml(commit, commits, { prefix })
    const filename = `${commit.hash}.html`
    const filepath = path.resolve(__dirname, '_site', filename)
    console.log('writing', filepath)
    fs.writeFileSync(filepath, html, { encoding: 'utf-8' })
  }
  console.log('success')
}
