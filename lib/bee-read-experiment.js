const Hyperbee = require('hyperbee')
const Hypercore = require('hypercore')
const Experiment = require('./experiment')

class BeeReadExperiment extends Experiment {
  constructor (tmpDir, { nrEntries, entryByteSize }) {
    super(tmpDir, 'Bee Read Hyperdrive experiment')

    this.core = new Hypercore(this.tmpDir)
    this.db = new Hyperbee(this.core)

    this.nrEntries = nrEntries
    this.entryByteSize = entryByteSize

    this.node = 'a'.repeat(this.entryByteSize)
  }

  async _setup () {
    if (this.closing) return
    for (let i = 0; i < this.nrEntries; i += 1) {
      await this.db.put(`key${i}`, this.node)
      if (this.closing) return
    }
  }

  async _runExperiment () {
    for (let i = 0; i < this.nrEntries; i += 1) {
      await this.db.get(`key${i}`)
      if (this.closing) return
    }
  }

  async _teardown () {
    await this.db.close()
  }
}

module.exports = BeeReadExperiment
