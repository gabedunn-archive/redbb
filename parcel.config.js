const Bundler = require('parcel-bundler')
const {join} = require('path')

const entryFiles = join(__dirname, 'src', 'index.js')

const options = {
  outDir: __dirname,
  outFile: 'redbb.js',
  watch: true,
  contentHash: false,
  minify: false,
  scopeHoist: false,
  target: 'node',
  logLevel: 3,
  sourceMaps: false,
  detailedReport: true
}

async function runBundle () {
  const bundler = new Bundler(entryFiles, options)
  await bundler.bundle()
}

runBundle()