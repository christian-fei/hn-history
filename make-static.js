#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const commits = require('./cache.json')
const getCommitHtml = require('./get-commit-html')

if (require.main === module) {
  makeStatic()
    .then(() => {
      console.log('written to cache.json')
    })
} else {
  module.exports = makeStatic
}

async function makeStatic () {
  console.log('#', commits.length)
  try { fs.rmdirSync(path.resolve(__dirname, '_site'), { recursive: true }) } catch (err) {}
  fs.mkdirSync(path.resolve(__dirname, '_site'))

  for (const commit of commits) {
    if (commit.hash === commits[0].hash) {
      const html = await getCommitHtml(commit, commits, {prefix: '/hn-history'})
      const filename = 'index.html'
      const filepath = path.resolve(__dirname, '_site', filename)
      console.log('writing', filepath)
      fs.writeFileSync(filepath, html, { encoding: 'utf-8' })
    }
    const html = await getCommitHtml(commit, commits, {prefix: '/hn-history'})
    const filename = `${commit.hash}.html`
    const filepath = path.resolve(__dirname, '_site', filename)
    console.log('writing', filepath)
    fs.writeFileSync(filepath, html, { encoding: 'utf-8' })
  }
  console.log('success')
}
