import { createGzip } from 'zlib'
import { createReadStream, createWriteStream } from 'fs'
import { compressStream } from 'iltorb'
import * as glob from 'glob'

const compressFile =
  (filename: string, compression: Function, ext: string) =>
    new Promise((res, _rej) => {
      const input = createReadStream(filename)
      const output = createWriteStream(filename + `.${ext}`)
      input.pipe(compression()).pipe(output)

      output.on('end', () => {
        return res()
      })
    })


glob('dist/flo-angular/**/*!(*.br|*.gz).{js,css,html,txt,json}', (_error, matches) => {
  matches.forEach(match => {
    compressFile(match, createGzip, 'gz')
    compressFile(match, compressStream, 'br')
  })
})
