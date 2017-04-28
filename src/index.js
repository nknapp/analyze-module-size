#!/usr/bin/env node

/*!
 * analyze-size <https://github.com/nknapp/analyze-size>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */
const pify = require('pify')
const glob = pify(require('glob'))
const fs = require('fs')
const readFile = pify(fs.readFile)
const stat = pify(fs.stat)
const deep = require('deep-aplus')(Promise)
const path = require('path')
const {PackageStats } = require('PackageStats')




function tree (cwd) {
  return glob('**/node_modules/*/package.json', {cwd})
    .then(packageJsonFiles => {
      return packageJsonFiles.map(extractMetadata)
    })
    .then(deep)
}

function extractMetadata (packageJsonFile) {
  const contents = readFile(packageJsonFile, {encoding: 'utf8'}).then(JSON.parse)
  return contents
    .then(json => {
      return {
        stats: PackageStats.loadFrom(packageJsonFile),
        requiredBy: json._requiredBy || [],
        location: json._location,
        id: json._id,
        deps: []
      }
    })
}

function indexBy (array, keyFn) {
  return array.reduce((done, next) => {
    done[keyFn(next)] = next
    return done
  }, {})
}

function totalSize (obj) {
  obj.total = obj.stats.merge(obj.deps.map(dep => {

  }))
}

/**
 * Convert to archy style
 * @param obj
 */
function toArchy (obj) {
  return {
    label: `${obj.id} ${obj.totalSize.blksize} (${obj.size.blksize})`,
    nodes: obj.deps.map(toArchy)
  }
}

tree('.')
  .then(items => {
    var byLocation = indexBy(items, (item) => item.location)
    byLocation['/'] = {
      id: 'ROOT',
      deps: []
    }
    byLocation['#DEV:/'] = {
      id: 'DEV:/',
      deps: []
    }
    items.forEach((item) => {
      item.requiredBy.forEach((dependentLocation) => {
        const dependent = byLocation[dependentLocation]
        if (dependent) {
          dependent.deps.push(item)
        } else {
          throw new Error(`Could not find dependent ${dependentLocation} of ${item.location}`)
        }
      })
    })
    return byLocation['/']
  })
  .then(rootItem => totalSize(rootItem))
  .then(
    result => {
      archy(toArchy(result))
      return console.log(JSON.stringify(result, 0, 2))
    },
    console.error
  )
