import JSZip from "jszip";
import fs from 'fs';
import { linker } from '../linker/index.js'

export async function startUnzip(file) {
  return new Promise((resolve) => {
    fs.readFile(file.path, (err, data) => {
      if (!err) {
        const jszip = new JSZip();
        jszip.loadAsync(data)
          .then((unzipped) => {
            //тут converter
            linker(unzipped)
              .then(data => {
                console.log(data.documentRels)
                data.zipped.generateAsync({ type: "base64" })
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

