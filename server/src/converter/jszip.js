import JSZip from "jszip";
import fs from 'fs';

export async function startUnzip(file) {
  return new Promise((resolve) => {

    console.log('zip')

    fs.readFile(file.path, function (err, data) {
      if (!err) {
        const unzip = new JSZip();
        unzip.loadAsync(data).then(function (zip) {
          Object.keys(zip.files).forEach(function (filename) {
            unzip.folder(filename)
          })

          const img = unzip.folder("Images");
          const xml = unzip.folder("XML");

          unzip.generateAsync({ type: "base64" }).then(content => {
            console.log('here')
            console.log(content)
            resolve(content)
          });
        })

      }
      else {
        console.log('net')
      }
    })


  })





}

export const startZip = () => {
  console.log('abrakadabra')
  const zip = new JSZip();

  //zip.file("Hello.txt", "Hello World\n");

  const img = zip.folder("Images");
  const xml = zip.folder("XML");
  //img.file("smile.gif", imgData, { base64: true });

  zip.generateAsync({ type: "blob" }).then(function (content) {
    FileSaver.saveAs(content, "example.zip");
  });
  //const contentUrl = URL.createObjectURL(content);
  //FileSaver.saveAs(contentUrl, "example.zip");
}

