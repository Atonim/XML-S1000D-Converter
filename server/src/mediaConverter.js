//const Jimp = require('jimp')
import { fileName } from './fileName.js'
import sharp from 'sharp'

export async function mediaConverter(media) {
	try {
		//console.log(media)
		const imgFileNames = Object.keys(media)
		for (let fullName of imgFileNames) {
			//console.log(fullName) // delete
			const name = fileName(fullName)
			const extension = name.split('.').pop()

			if (extension !== 'jpeg' && extension !== 'jpg') {
				//console.log(media[fullName]) // delete
				const fileData = await media[fullName].async('arraybuffer')
				//console.log(fileData) // delete

				//	console.log(name) // delete
				//	console.log(extension) // delete

				console.log(fullName)
				const outputFilePath = fullName.slice(0, -extension.length) + 'jpeg'
				console.log(outputFilePath) //

				sharp(fileData)
					.toFormat('jpeg')
					.toFile(outputFilePath, (err, info) => {
						if (err) {
							console.error(err)
						} else {
							console.log('Изображение успешно конвертировано')
							console.log(info)
						}
					})
			}
		}
	} catch (e) {
		console.error(e)
	} finally {
	}
}
