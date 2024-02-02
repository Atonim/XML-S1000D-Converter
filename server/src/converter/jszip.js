import JSZip from "jszip";
import fs from 'fs';
import { linker } from '../linker/index.js'
import { fileSelector } from '../linker/fileSelector.js'
//import { relsAnalyzer } from '../linker/relsAnalyzer.js'
import { convertor } from './converter.js'

export async function startUnzip(file) {
  return new Promise((resolve) => {
    fs.readFile(file.path, (err, data) => {
      if (!err) {
        const jszip = new JSZip();
        jszip.loadAsync(data)
          .then((unzipped) => {

            fileSelector(unzipped).then(filesToConvert => {
              //const rels = relsAnalyzer(filesToConvert.documentRels)
              let a = new convertor(filesToConvert.document, filesToConvert.documentRels)
              const result = a.start()
              //отправляю media и выход из конвертера
              linker(result, filesToConvert.media)
                .then(zipped => {
                  zipped.generateAsync({ type: "base64" })
                    .then(content => {
                      resolve(content)
                    });
                })
            })

          })
      }
      else {
        console.log(err)
      }
    })
  })
}

