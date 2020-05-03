const fse = require('fs-extra')
const path = require('path')
const args = require('minimist')(process.argv.slice(2))
const { run } = require('./utils')

const scope = args.scope

const filesNeedReplace = [
  `./scripts/setting.js`,
  `./package.json`,
  `./tsconfig.json`,
  `./packages/sandbox/package.json`,
  `./packages/sandbox/README.md`
]

main()

async function main() {
  try {
    await run(
      `git remote add template https://github.com/tarnishablec/mono-starter.git`
    )
  } catch (error) {}
  await run(`git fetch template`)
  await run(`git merge template/master --allow-unrelated-histories`)

  scope &&
    filesNeedReplace.forEach((f) => {
      let filePath = path.resolve(__dirname, '..', f)
      const res = fse.readFileSync(filePath, 'utf-8').replace(/~scope~/g, scope)
      fse.writeFileSync(filePath, res)
    })
}
