const express = require('express')
const fs = require('fs')
const Multiparty = require('multiparty')
const path = require('path')

const app = express()
const port = 8888

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-control-Allow-Headers', '*')
  next()
})

app.post('/save_chunk', (req, res) => {
  const form = new Multiparty.Form()
  form.uploadDir='tmp'
  form.parse(req, function (err, fields, files) {
    console.log(err);
    if (err) return
    const filename = fields.filename[0]
    const chunk = files.chunk[0]
    if (!chunk || !filename) return
    const dir = filename.split('_')[0]

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    fs.renameSync(chunk.path, path.resolve(dir, filename))
  })
  res.send(req.body)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
