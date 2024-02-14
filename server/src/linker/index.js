import JSZip from 'jszip'
import sharp from 'sharp'
import { fileName } from '../fileName.js'

export async function linker(result, media) {
	const zipped = new JSZip()
	let imgFolder = zipped.folder('Images')
	let xmlFolder = zipped.folder('XML')

	const xmlFileNames = Object.keys(result.XML)
	const imgFileNames = Object.keys(media)

	for (let filename of xmlFileNames) {
		xmlFolder.file(filename, result.XML[filename])
	}
	//console.log(imgFileNames)
	for (let fullName of imgFileNames) {
		let name = fileName(fullName)
		let extension = name.split('.').pop()
		let fileData = await media[fullName].async('arraybuffer')
		//console.log(name)
		if (extension !== 'jpeg' && extension !== 'jpg') {
			if (extension === 'emf') {
				if (result.Images[name] !== undefined) {
          imgFolder.file(result.Images[name], fileData);
        }
			} else {
				// png
        await sharp(fileData)
					.flatten( {background: {r: 255, g: 255, b: 255}})
					.toFormat('jpeg') //	.jpeg({quality: 100})
					.toBuffer()
					.then(jpegData => {
            if (result.Images[name] !== undefined) {
              imgFolder.file(result.Images[name], jpegData)
            }
          })
          .catch( err => {
            console.error( err )
          })
			}
		} else {
			if (result.Images[name] !== undefined) {
				imgFolder.file(result.Images[name], fileData)
			}
		}
	}
	return zipped
}
