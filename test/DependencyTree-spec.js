/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const {DependencyTree} = require('../src/DependencyTree')

describe('The DependencyTree-class:', function () {
  describe('The loadFrom static-method', function () {
    this.timeout(5000)

    it('should create a DependencyTree with production dependencies', function () {
      return DependencyTree.loadFrom('test/fixtures/moduleWithDeps/package.json')
        .then((tree) => expect(visit(tree.prod)).to.deep.equal([
          {
            '_id': '@scope/pkg@1.0.0',
            'deps': []
          },
          {
            '_id': 'dep1@1.0.0',
            'deps': [
              {
                '_id': 'dep1a@1.0.0',
                'deps': []
              }
            ]
          },
          {
            '_id': 'dep2@1.0.0',
            'deps': [
              {
                '_id': 'dep2a@1.0.0',
                'deps': []
              }
            ]
          }
        ]))
    })

    it('should create a DependencyTree with dev dependencies', function () {
      return DependencyTree.loadFrom('test/fixtures/moduleWithDeps/package.json')
        .then((tree) => expect(visit(tree.dev)).to.deep.equal([
          {
            '_id': 'devdep1@1.0.0',
            'deps': [
              {
                '_id': 'dep1a@1.0.0',
                'deps': []
              }
            ]
          }
        ]))
    })

    it('should create a DependencyTree with manually installed dependencies', function () {
      return DependencyTree.loadFrom('test/fixtures/moduleWithDeps/package.json')
        .then((tree) => expect(visit(tree.manual)).to.deep.equal([
          {
            '_id': 'manualdep1@1.0.0',
            'deps': []
          }
        ]))
    })
  })
})

function visit (pkgs) {
  return pkgs.map((pkg) => {
    return {
      _id: pkg.packageJson._id,
      deps: visit(pkg.dependencies)
    }
  })
}
