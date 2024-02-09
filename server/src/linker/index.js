import JSZip from "jszip";
import { fileName } from '../fileName.js'
export async function linker(result, media) {
  const zipped = new JSZip();
  let imgFolder = zipped.folder("Images");
  let xmlFolder = zipped.folder("XML");

  const xmlFileNames = Object.keys(result.XML)
  const imgFileNames = Object.keys(media)

  for (let filename of xmlFileNames) {
    xmlFolder.file(filename, result.XML[filename])
  }
  //console.log(imgFileNames)
  for (let fullName of imgFileNames) {
    let name = fileName(fullName)
    let fileData = await media[fullName].async('arraybuffer')
    //console.log(name)
    if (result.Images[name] !== undefined)
      imgFolder.file(result.Images[name], fileData)
  }
  return zipped;
}


