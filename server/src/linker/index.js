import JSZip from "jszip";

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
    let fileData = await media[fullName].async('arraybuffer')
    imgFolder.file(result.Images[name], fileData)
  }
  return zipped;
}

const fileName = (fullPath) => {
  let fileNameArr = fullPath.split("/")
  return fileNameArr[fileNameArr.length - 1];
}
