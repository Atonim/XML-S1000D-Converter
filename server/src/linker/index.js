import JSZip from "jszip";

export async function linker(result) {
  const zipped = new JSZip();
  let imgFolder = zipped.folder("Images");
  let xmlFolder = zipped.folder("XML");

  const xmlFileNames = Object.keys(result.XML)
  const imgFileNames = Object.keys(result.Images)
  //console.log(keys)
  //console.log(result.XML[0])
  //console.log(result.XML['DMC-VBMA-A-46-20-01-00A-018A-A_000_01_ru_RU.xml'])
  //console.log(result.XML)
  //console.log(result.Images)
  //var uint8array = new TextEncoder().encode("someString");

  for (let filename of xmlFileNames) {
    //let fileData = await result.XML[filename].async('arraybuffer')
    xmlFolder.file(filename, result.XML[filename])
  }
  //for (let filename of imgFileNames) {
  //  imgFolder.file(filename, result.Images[filename])
  //}
  return zipped;
}

const fileName = (fullPath) => {
  let fileNameArr = fullPath.split("/")
  return fileNameArr[fileNameArr.length - 1];
}
