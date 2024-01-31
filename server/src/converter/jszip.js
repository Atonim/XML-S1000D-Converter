import JSZip from "jszip";
import fs from 'fs';
import { linker } from '../linker/index.js'
import { fileSelector } from '../linker/fileSelector.js'
import { convertor } from './converter.js'

export async function startUnzip(file) {
  return new Promise((resolve) => {
    fs.readFile(file.path, (err, data) => {
      if (!err) {
        const jszip = new JSZip();
        jszip.loadAsync(data)
          .then((unzipped) => {

            const filesToConvert = fileSelector(unzipped)
            let a = new convertor(filesToConvert.documentRels)
            const xmlArray = a.start()

            //отправляю media и выход из конвертера
            linker(unzipped, xmlArray)
              .then(zipped => {
                zipped.generateAsync({ type: "base64" })
                  .then(content => {
                    resolve(content)
                  });
              })
          })
      }
      else {
        console.log(err)
      }
    })
  })
}

