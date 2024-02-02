export async function fileSelector(unzipped) {

  const keys = Object.keys(unzipped.files)
  //console.log(unzipped)
  //console.log(keys)
  let media = {}
  let documentRels = null
  let document = null

  for (let fullPath of keys) {

    if (fullPath.includes('/media')) {
      media[fullPath] = unzipped.files[fullPath]
    }
    else if (fullPath.endsWith('document.xml.rels')) {
      documentRels = await unzipped.files[fullPath].async('arraybuffer')
      documentRels = new TextDecoder().decode(documentRels);

    }
    else if (fullPath.endsWith('document.xml')) {
      document = await unzipped.files[fullPath].async('arraybuffer')
      document = new TextDecoder().decode(document);
    }
  }
  return { media, documentRels, document };
}

const fileName = (fullPath) => {
  let fileNameArr = fullPath.split("/")
  return fileNameArr[fileNameArr.length - 1];
}