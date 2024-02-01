export async function fileSelector(unzipped) {

  const keys = Object.keys(unzipped.files)
  let media = []
  let documentRels = null

  for (let fullPath of keys) {
    if (fullPath.endsWith('.jpeg') || fullPath.endsWith('.png') || fullPath.endsWith('.enf')) {
      let fileData = await unzipped.files[fullPath].async('arraybuffer')
      media.push({
        name: fileName(fullPath),
        data: fileData
      })
    }
    else if (fullPath.endsWith('document.xml.rels')) {
      documentRels = await unzipped.files[fullPath].async('arraybuffer')
    }
    //еще есть формат enf в media
  }
  return { media, documentRels };
}

const fileName = (fullPath) => {
  let fileNameArr = fullPath.split("/")
  return fileNameArr[fileNameArr.length - 1];
}