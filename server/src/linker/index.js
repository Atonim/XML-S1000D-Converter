import JSZip from "jszip";

export async function linker(unzipped) {
  const zipped = new JSZip();
  let imgFolder = zipped.folder("Images");
  let xmlFolder = zipped.folder("XML");
  let documentRels = null;
  const keys = Object.keys(unzipped.files)

  for (let fullPath of keys) {
    if (fullPath.endsWith('.xml')) {
      let fileData = await unzipped.files[fullPath].async('arraybuffer')
      xmlFolder.file(fileName(fullPath), fileData)
    }
    else if (fullPath.endsWith('.jpeg') || fullPath.endsWith('.png')) {
      let fileData = await unzipped.files[fullPath].async('arraybuffer')
      imgFolder.file(fileName(fullPath), fileData)
    }
    else if (fullPath.endsWith('document.xml.rels')) {
      documentRels = await unzipped.files[fullPath].async('arraybuffer')
    }
    //еще есть формат enf в media
  }
  return { zipped, documentRels };
}

const fileName = (fullPath) => {
  let fileNameArr = fullPath.split("/")
  return fileNameArr[fileNameArr.length - 1];
}
