const moment = require('moment')
const PersianDate = require('persian-date')
const CRUD = require('./CRUD.js')
// import * as PersianDate from 'persian-date'

class Model {
  constructor(data, props, enumKeysForLoad) {
    this.crud = new CRUD()
    this.apiResource = null
    this.loadInputData(data)
    this.warn = {
      mode: false,
      keys: []
    }
    this.editMode = false
    this.loading = false
    this.props = props
    this.initProps()

    this.loadEnums(enumKeysForLoad)
  }

  loadInputData (data) {
    this.inputData = this.optional(data, {})
    if (data && data.inputData) {
      delete data.inputData
    }
  }

  initProps () {
    for (let i = 0; typeof this.props[i] !== 'undefined'; i++) {
      this.setPropKey(this.props[i])
      this.setPropKeyModel(this.props[i])
    }
  }

  setPropKey (prop) {
    const key = prop.key
    const defaultVal = this.getDefaultVal(prop, key)
    const value = this.getVal(prop, key)
    this[key] = this.optional(value, defaultVal)
  }

  getVal (prop, key) {
    let val
    const value = prop.value
    if (typeof value === 'function') {
      val = value(this.inputData[key], this.inputData)
    } else if (typeof value !== 'undefined') {
      val = value
    } else {
      val = this.inputData[key]
    }

    return val
  }

  getDefaultVal (prop, key) {
    let defaultVal = null
    const defaultProp = prop.default
    if (typeof defaultProp === 'function') {
      defaultVal = defaultProp(this.inputData[key], this.inputData)
    } else if (typeof defaultProp !== 'undefined') {
      defaultVal = defaultProp
    }

    return defaultVal
  }

  setPropKeyModel (prop) {
    const key = prop.key
    if (typeof prop.relatedModel === 'undefined') {
      return
    }
    this[key] = new prop.relatedModel(this.inputData[key])
    this.relatedModelId(key)
  }

  isValidData(data) {
    return (typeof data !== 'undefined' && data !== null && data !== '')
  }

  optional(data, optionalData, refinementData) {
    if (this.isValidData(data)) {
      if (typeof refinementData === 'function') {
        return refinementData(data)
      } else {
        return data
      }
    } else {
      if (typeof optionalData !== 'undefined') {
        return optionalData
      } else {
        return null
      }
    }
  }

  shamsiDate(key) {
    return {
      dateTime: new PersianDate(new Date(this[key])).format('HH:mm:ss YYYY/MM/DD'),
      date: new PersianDate(new Date(this[key])).format('YYYY/MM/DD'),
      time: new PersianDate(new Date(this[key])).format('HH:mm:ss')
    }
  }

  relatedModelId (relatedModelName) {
    if (!this[relatedModelName] || !this[relatedModelName].id) {
      return
    }
    this[relatedModelName + '_id'] = this[relatedModelName].id

    return this[relatedModelName + '_id']
  }

  findProp(key) {
    return this.props.find(function (prop) {
      return (prop.key === key)
    })
  }

  set(newData) {
    for (let i = 0; typeof newData[i] !== 'undefined'; i++) {
      const prop = this.findProp(newData[i].key)
      if (prop) {
        if (prop.relatedModel) {
          this[prop.key] = new prop.relatedModel(newData[i].value)
          this[prop.key + '_id'] = this[prop.key].id
        } else {
          this[prop.key] = newData[i].value
        }
      }
    }
  }

  bufferNewData(data, clear) {
    const prop = this.findProp(data.key)
    if (typeof prop === 'undefined') {
      return
    }

    if (typeof clear !== 'undefined') {
      delete this[prop.key + '_buffer']
      delete this[prop.key + '_id_buffer']
      return
    }

    if (prop.relatedModel) {
      data.value = new prop.relatedModel(data.value)
      this[prop.key + '_id_buffer'] = data.value.id
    }
    this[prop.key + '_buffer'] = data.value
  }

  buffer(newData) {
    if (typeof newData === 'undefined') {
      for (let i = 0; typeof this.props[i] !== 'undefined'; i++) {
        this.bufferNewData({
          key: this.props[i].key,
          value: this[this.props[i].key]
        })
      }
    } else {
      for (let i = 0; typeof newData[i] !== 'undefined'; i++) {
        this.bufferNewData(newData[i])
      }
    }
  }

  apply() {
    for (let i = 0; typeof this.props[i] !== 'undefined'; i++) {
      this[this.props[i].key + '_old'] = this[this.props[i].key]
      if (typeof this[this.props[i].key + '_buffer'] !== 'undefined') {
        this[this.props[i].key] = this[this.props[i].key + '_buffer']
      }
      if (this[this.props[i].key + '_id']) {
        this[this.props[i].key + '_id_old'] = this[this.props[i].key + '_id']
        if (typeof this[this.props[i].key + '_id' + '_buffer'] !== 'undefined') {
          this[this.props[i].key + '_id'] = this[this.props[i].key + '_id' + '_buffer']
        }
      }
      this.bufferNewData({
        key: this.props[i].key,
        value: null
      }, true)
    }
  }

  revertToOldData() {
    for (let i = 0; typeof this.props[i] !== 'undefined'; i++) {
      this[this.props[i].key] = this[this.props[i].key + '_old']
      this[this.props[i].key + '_buffer'] = null
      if (this[this.props[i].key + '_id']) {
        this[this.props[i].key + '_id_buffer'] = null
        this[this.props[i].key + '_id'] = this[this.props[i].key + '_id_old']
      }
    }
  }

  list(data, url) {
    if (!this.baseRoute) {
      return new Promise(() => {
        throw new Error('baseRoute is not set')
      })
    }

    if (!url) {
      url = this.baseRoute
    }

    return this.crud.fetch(url, data)
  }

  create(data, url) {
    if (!this.baseRoute) {
      return new Promise(() => {
        throw new Error('baseRoute is not set')
      })
    }

    if (!url) {
      url = this.baseRoute
    }

    if (!data) {
      data = this.loadApiResource()
    }

    return this.crud.create(url, data)
  }

  show(id, url) {
    if (!this.baseRoute) {
      return new Promise(() => {
        throw new Error('baseRoute is not set')
      })
    }

    if (!id) {
      id = this.id
    }

    if (!url) {
      url = this.baseRoute + '/' + id
    }

    return this.crud.fetch(url)
  }

  update(url) {
    if (!this.baseRoute) {
      return new Promise(() => {
        throw new Error('baseRoute is not set')
      })
    }

    if (!url) {
      url = this.baseRoute + '/' + this.id
    }

    const data = this.loadApiResource()

    return this.crud.update(url, data)
  }

  delete(url) {
    if (!this.baseRoute) {
      return new Promise(() => {
        throw new Error('baseRoute is not set')
      })
    }

    if (!url) {
      url = this.baseRoute + '/' + this.id
    }

    return this.crud.delete(url)
  }

  loadApiResource_item (field, loadItem) {
    if (field.value) {
      if (typeof field.value === 'function') {
        const fieldValue = field.value()
        loadItem(field.key, fieldValue)
      } else {
        loadItem(field.key, field.value)
      }
    } else {
      loadItem(field.key, this[field.key])
    }
  }

  loadApiResource() {
    if (!this.apiResource) {
      const data = {}
      for (let i = 0; typeof this.props[i] !== 'undefined'; i++) {
        const key = this.props[i].key
        if (typeof this.props[i] !== 'undefined') {
          const relatedModelId = this.relatedModelId(key)
          if (relatedModelId) {
            data[key + '_id'] = relatedModelId
          }
        }
        data[key] = this[key]
      }
      return data
    }

    if (this.apiResource.sendType === 'form-data') {
      const formData = new FormData()
      for (let i = 0; typeof this.apiResource.fields[i] !== 'undefined'; i++) {
        const field = this.apiResource.fields[i]
        this.loadApiResource_item(field, function (key, value) {
          formData.append(key, value)
        })
      }

      return formData
    } else {
      const data = {}
      for (let i = 0; typeof this.apiResource.fields[i] !== 'undefined'; i++) {
        const field = this.apiResource.fields[i]
        this.loadApiResource_item(field, function (key, value) {
          data[key] = value
        })
      }

      return data
    }
  }

  diffToNow(key) {
    const now = new moment(new Date()),
      target = new moment(new Date(this[key])),
      duration = moment.duration(target.diff(now))

    return {
      diff: duration,
      humanize: duration.humanize(true)
    }
  }

  loadEnums (enumKeysForLoad) {
    if (!enumKeysForLoad) {
      return
    }
    Object.keys(enumKeysForLoad).forEach(enumKey => {
      this.loadEnum(enumKey, enumKeysForLoad[enumKey])
    })
  }

  loadEnum (enumKey, enumItem) {
    const target = enumItem.enums.find(type => type.value === this[enumKey])
    if (!target) {
      this[enumItem.infoKey] = {
        label: null,
        value: null
      }
      if (enumItem.enumListKey) {
        this[enumItem.enumListKey] = enumItem.enums
      }
    } else {
      this[enumItem.infoKey] = target
    }
  }
}

module.exports = Model
module.exports.default = Model
