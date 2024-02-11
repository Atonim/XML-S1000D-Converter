
import * as tegs from "./xmlTags.js"
import { document } from "./temp.js"
import { documentRels } from "./temp2.js"
import { docxParser } from "./docxParser.js"
import { xmlCreator } from "./xmlCreator.js"
import { codes } from "./codes.js"

export class convertor {

    document = document
    stringCodes = []
    files = {}
    docxParser = null
    // xmlCreator = null
    documentContents = null
    techName = "default name"
    imageIdObject = null
    idImage_S1000D_Object = {}
    result = {
        "Images": {},
        "XML": {}
    }

    constructor(document, documentRels) {
        //this.media = media
        this.documentRels = documentRels
        this.document = document
        this.docxParser = new docxParser(this.document, this.documentRels)
        this.codesToString()

        for (const code of this.stringCodes) {
            this.files[code] = null
        }
    }

    codesToString() {
        const lastCodeLength = codes[codes.length - 1].toString().length
        for (let code of codes) {
            code = code.toString()
            while (code.length !== lastCodeLength) {
                code = 0 + code
            }
            this.stringCodes.push(code)
        }
    }
    indexToString(index) {
        const maxIndexLength = 5
        index = index.toString()
        while (index.length !== maxIndexLength) {
            index = 0 + index
        }
        return index
    }


    start() {
        return this.startLogic()
    }

    startPrototype() {
        let result = new tegs.dmodule("018", "Разработка программы-конвертера")
        //console.log(result.stringify())
    }

    startLogic() {
        this.techName = this.docxParser.getTechName()
        this.imageIdObject = this.docxParser.getRelsContents()

        this.setMediaObjects()

        this.documentContents = this.docxParser.getContents()

        this.builder()
        // this.setResult(result)
        // return result
        this.setResultXML()
        console.log(this.files['044'].stringify())
        return this.result
    }

    builder() {
        for (let code of this.stringCodes) {
            if (code === '018')
                this.build_018()
            else if (code === '410') {
                this.build_410()
            }
            else {
                this.build(code)
            }

        }

    }
    setMediaObjects() {
        let imagesNames = Object.keys(this.imageIdObject)

        for (let name of imagesNames) {
            let stringIndex = this.indexToString(name.split('.')[0].slice(5))
            let convertedName = "ICN-VBMA-A-462001-A-00000-" + stringIndex + "-A-001-1.jpg"
            this.result.Images[name] = convertedName
            this.idImage_S1000D_Object[this.imageIdObject[name]] = convertedName
        }
    }

    setResultXML() {
        for (let code of this.stringCodes) {
            let key = "DMC-VBMA-A-46-20-01-00A-" + code + "A-A_000_01_ru_RU.xml"
            this.result.XML[key] = this.files[code].stringify()
        }
    }

    build_018() {
        let creator = new xmlCreator("018", this.techName)

        // let element = this.docxParser.getNextParagraf()
        this.docxParser.nextParagraf()
        // let element = this.docxParser.getPara()
        while (!this.docxParser.isEnter()) {
            let paragrafText = this.docxParser.getPara().trim()
            creator.chooseTag(paragrafText.trim(), this.docxParser.getStyleId())
            // if (paragrafText.trim() != "") {
            //     creator.chooseTextParagraf(paragrafText.trim(), this.docxParser.getStyleId())
            // }
            this.docxParser.nextParagraf()
        }

        this.files['018'] = creator.getDocument()
        // console.log(this.file_018.stringify())
    }

    build_410() {

        let creator = new xmlCreator("410", this.techName)

        let id = this.documentContents.find(element => element.infoCode === "410").startId
        let element = this.docxParser.nextParagraf()
        // console.log(id)
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
        // console.log(id)

        id = this.documentContents.find(element => element.infoCode === "410").stopId
        // this.docxParser.getStyleId()
        while (!this.docxParser.hasBookmarkId(id)) {
            let paragrafText = this.docxParser.getPara().trim()
            creator.chooseTag(paragrafText.trim(), this.docxParser.getStyleId())
            // if (paragrafText.trim() != "") {
            //     creator.chooseTextParagraf(paragrafText.trim(), this.docxParser.getStyleId())
            // }
            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()
        this.files['410'] = creator.getDocument()
    }

    build(code) {
        let creator = new xmlCreator(code, this.techName, this.idImage_S1000D_Object)

        let id = this.documentContents.find(element => element.infoCode === code).startId
        let element = this.docxParser.nextParagraf()
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }

        id = this.documentContents.find(element => element.infoCode === code).stopId
        while (!this.docxParser.hasBookmarkId(id)) {
            let paragrafText = this.docxParser.getPara().trim()
            let imagesIds = this.docxParser.getImageRId()
                creator.chooseTag(paragrafText.trim(), this.docxParser.getStyleId(), imagesIds)
            if (paragrafText) {
            } else if (imagesIds) {
                // this.docxParser.nextParagraf()
                // this.docxParser.nextParagraf()
                // creator.addFigure(imagesIds, this.docxParser.getPara().trim())
                // if (this.docxParser.hasBookmarkId(id)) { break }
            }
            
            // if (paragrafText.trim() != "") {
            //     creator.chooseTextParagraf(paragrafText.trim(), this.docxParser.getStyleId())
            // // if (code === "030") { console.log(paragrafText) }
            // }
            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()

        this.files[code] = creator.getDocument()
    }
}

// let a = new convertor(document, documentRels)
// // a.startPrototype()
// a.start()
// // console.log(a.start())
