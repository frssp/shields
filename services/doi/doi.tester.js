'use strict'

const { isMetric } = require('../test-validators')
const { ServiceTester } = require('../tester')

const t = (module.exports = new ServiceTester({
  id: 'doi',
  title: 'DOI citation',
}))

t.create('Citation')
  .get('/citation.json?doi_string=10.1039%2FD0EE00291G')
  .expectBadge({
    label: 'Energy Environ. Sci. 13, 1481-1491',
    message: isMetric,
    link: ['https://doi.org/10.1039/D0EE00291G'],
  })

t.create('Invalid DOI Specified (non-existent doi)')
  .get('/citation.json?doi_string=INVALID%2FDOI&label=DOI')
  .expectBadge({
    label: 'DOI',
    message: 'invalid doi',
  })

t.create('Invalid DOI Specified (only spaces)')
  .get('/citation.json?doi_string=%20%20&label=DOI')
  .expectBadge({
    label: 'DOI',
    message: 'invalid doi',
  })
