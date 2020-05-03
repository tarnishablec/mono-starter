const { run, resolveTargets } = require('./utils')
const { scope } = require('./setting')
const args = require('minimist')(process.argv.slice(2))
const fse = require('fs-extra')
const path = require('path')

const cleanTest = args.notest

main()

async function main() {
  const cache = [...args._]
  await createPackages(args._)
  await run(`yarn run boot ${resolveTargets(cache).join(' ')} --init --force`)
  if (cleanTest) {
    cache.forEach((c) =>
      fse.rmdirSync(path.resolve(`packages/${c}/__tests__`), {
        recursive: true
      })
    )
  }
}

async function createPackages(names) {
  if (names.length === 0) {
    return
  } else {
    await run(`lerna create @${scope}/${names.shift()} --yes`)
    await createPackages(names)
  }
}
