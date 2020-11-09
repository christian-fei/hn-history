#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const getCommitsWithDiffs = require('./get-commits-with-diffs')

if (require.main === module) {
  createCache()
    .then(() => {
      console.log('written to cache.json')
    })
} else {
  module.exports = createCache
}

async function createCache () {
  const cache = await getCommitsWithDiffs(100)
  fs.writeFileSync(path.resolve(__dirname, 'cache.json'), JSON.stringify(cache), { encoding: 'utf-8' })
}
