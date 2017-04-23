/*!
 * analyze-size <https://github.com/nknapp/analyze-size>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

const analyzeSize = require('../')
const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

describe('analyze-size:', function () {
  it("should be executed", function () {
    expect(analyzeSize()).to.equal('analyzeSize')
  })
})
