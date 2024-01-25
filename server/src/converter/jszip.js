import JSZip from "jszip";
import FileSaver from "file-saver";


export const startUnzip = (file) => {

  const unzip = new JSZip();

  unzip.loadAsync(file).then(function (zip) {

    console.log(zip.files)

    Object.keys(zip.files).forEach(function (filename) {
      unzip.folder(filename)
      //console.log(filename)
      //zip.files[filename].async('string').then(function (fileData) {
      //  //console.log(fileData) // These are your file contents   
      //  xml.file(filename, fileData);
      //})

    })

    //img.file("smile.gif", imgData, { base64: true });
    const img = unzip.folder("Images");
    const xml = unzip.folder("XML");

    unzip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "example.zip"); //по идее это можно сделать на клиенте
    });
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

