import fs from 'fs'
import JSZip from 'jszip'
import { linker } from './linker/index.js'
import { converter } from './converter/converter.js'
import { fileSelector } from './linker/fileSelector.js'

export async function startUnzip(file) {
	return new Promise(resolve => {
		fs.readFile(file.path, (err, data) => {
			if (!err) {
				const jszip = new JSZip()
				jszip.loadAsync(data).then(unzipped => {
					fileSelector(unzipped).then(filesToConvert => {
						//const rels = relsAnalyzer(filesToConvert.documentRels)
						let a = new converter(
							filesToConvert.document,
							filesToConvert.documentRels
						)
						const result = a.start()

						//отправляю media и выход из конвертера
						linker(result, filesToConvert.media).then(zipped => {
							zipped.generateAsync({ type: 'base64' }).then(content => {
								resolve(content)
							})
						})
					})
				})
			} else {
				console.log(err)
			}
		})
	})
}
