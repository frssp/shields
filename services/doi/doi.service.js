'use strict'

const Joi = require('@hapi/joi')
const { metric } = require('../text-formatters')
const { BaseJsonService, NotFound } = require('..')

const queryParamSchema = Joi.object({
  doi_string: Joi.string().required(),
}).required()

const schema = Joi.any()

class DOICitation extends BaseJsonService {
  static get category() {
    return 'other'
  }

  static get route() {
    return {
      base: 'doi',
      pattern: 'citation',
      queryParamSchema,
    }
  }

  static get examples() {
    return [
      {
        title: 'DOI',
        namedParams: {},
        queryParams: {
          doi_string: '10.1039/D0EE00291G',
        },
        // hard code the static preview
        // because link[] is not allowed in examples
        staticPreview: {
          label: 'Energy Environ. Sci.',
          message: 5,
          style: 'flat',
        },
      },
    ]
  }

  static render({ data }) {
    const cited = data.message['is-referenced-by-count']
    const journal = data.message['short-container-title']
    const doi_ = data.message.DOI
    const page = data.message.page
    const vol = data.message.volume
    return {
      label: `${journal[0]} ${vol}, ${page}`,
      message: metric(cited),
      style: 'flat',
      link: `http://doi.org/${doi_}`,
    }
  }

  async fetch({ doi_string }) {
    return this._requestJson({
      schema,
      url: `http://api.crossref.org/works/${doi_string}`,
    })
  }

  async handle(_routeParams, { doi_string }) {
    const data = await this.fetch({ doi_string })
    console.log('data', `${data.status}`)
    if (!`${data.status}` === 'ok') {
      throw new NotFound({ prettyMessage: 'invalid doi' })
    }
    return this.constructor.render({ data })
  }
}
module.exports = [DOICitation]
