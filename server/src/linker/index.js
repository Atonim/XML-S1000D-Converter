import JSZip from "jszip";
import { exec } from 'child_process';
import { fileName } from '../fileName.js';
import { sharpConverter } from "../mediaConverter.js";

export async function linker(result, media) {
  const zipped = new JSZip();
  let imgFolder = zipped.folder("Images");
  let xmlFolder = zipped.folder("XML");

  const xmlFileNames = Object.keys(result.XML)
  const imgFileNames = Object.keys(media)

  for (let filename of xmlFileNames) {
    xmlFolder.file(filename, result.XML[filename])

  }
  for (let fullName of imgFileNames) {
    let name = fileName(fullName)
    let extension = name.split('.').pop()
    let fileData = await media[fullName].async('arraybuffer')

    if (extension !== 'jpeg' && extension !== 'jpg') {
      name = name.slice(0, -extension.length) + 'jpeg'
      if (extension === 'emf') {
        //const buffer = Buffer.from(fileData);
        //const svg = convertEmfToSvg(buffer);
        //const jpegData = await sharpConverter(svg)
        imgFolder.file(result.Images[name], fileData); // temp
      }
      else {
        const jpegData = await sharpConverter(fileData)
        imgFolder.file(result.Images[name], jpegData);
      }
    }
    else {
      imgFolder.file(result.Images[name], fileData);
    }
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


