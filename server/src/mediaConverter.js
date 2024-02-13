import sharp from 'sharp'

export async function sharpConverter(fileData) {
	try {
		sharp(fileData)
			.toFormat('jpeg')
			.toBuffer()
			.then(jpegData => { return jpegData })
	} catch (e) {
		console.error(e)
	}
}
