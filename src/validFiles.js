var globby = require('globby')
var deep = require('deep-aplus')(Promise)

/**
 * List of ignored files (from https://docs.npmjs.com/files/package.json#files)
 * @type {string[]}
 */
var alwaysIgnored = [
  '.git',
  'CVS',
  '.svn',
  '.hg',
  '.lock-wscript',
  '.wafpickle-*',
  '.*.swp',
  '.DS_Store',
  '._*',
  'npm-debug.log',
  '.npmrc',
  'node_modules',
  'config.gypi',
  '*.orig'
]

var alwaysIncluded = [
  'package.json'
]

var alwaysIncludedIgnoreCase = [
  'README', 'README.*',
  'CHANGES', 'CHANGES.*',
  'CHANGELOG', 'CHANGELOG.*',
  'HISTORY', 'HISTORY.*',
  'LICENSE', 'LICENSE.*',
  'LICENCE', 'LICENCE.*',
  'NOTICE', 'NOTICE.*'
]

/**
 *
 * @param {string} cwd the projects basedir
 * @param {{files: string[]} packageJson the parsed package.json
 * @param {string[]} npmIgnore non-comment lines of the npm-ignore file
 * @returns {Promise.<string[]>} a promise for a list of valid files in the project
 */
function validFiles (cwd, packageJson, npmIgnore = []) {
  var ignored = alwaysIgnored.concat(npmIgnore).map(withChildren)

  var globs
  if (packageJson.files) {
    globs = packageJson.files
      .map((file) => file.replace(/\/?$/, '{,/**}'))
      .concat(alwaysIncluded)
  } else {
    globs = '**'
  }

  return deep({
    withCase: globby(globs, {nocase: false, ignore: ignored, cwd, mark: true, dot: true}),
    ignoreCase: globby(alwaysIncludedIgnoreCase, {nocase: true, ignore: ignored, cwd, mark: true})
  })
  // Join
    .then(({withCase, ignoreCase}) => withCase.concat(ignoreCase, '/'))
    // remove duplicates
    .then(files => Array.from(new Set(files)))
}

/**
 * Returns a glob the matches the file itself and its children (if it is an directory)
 * @param file
 */
function withChildren (file) {
  return file.replace(/\/?$/, '{,/**}')
}

/**
 * Returns an array of globs that match a file, its children (if it is an directory) and its
 * parent directories (recursively)
 * @param file
 */
function withParentsAndChildren (file) {
  // Determine globs for parents matching
  const globs = file.replace(/\/$/, '').match(/.*?\//g)
    .map((item, index, array) => array.slice(0, index + 1).join(''))
  // Add pattern to match children
  globs.push(withChildren(file))
  return globs
}

module.exports = {
  validFiles,
  withParentsAndChildren
}
