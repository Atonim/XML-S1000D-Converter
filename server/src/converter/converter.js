
import * as tegs from "./xmlTegs.js"
import { document } from "./temp.js"
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
        this.setResultXML()
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

        let element = this.docxParser.getNextParagraf()
        while (element.status === "success") {
            creator.addPara(element.value)
            element = this.docxParser.getNextParagraf()
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
        while (!this.docxParser.hasBookmarkId(id)) {
            // console.log(this.docxParser.getPara(), this.docxParser.hasBookmarkId(id))
            creator.addPara(this.docxParser.getPara())
            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()
        this.files['410'] = creator.getDocument()
    }

    build(code) {
        let creator = new xmlCreator(code, this.techName)

        let id = this.documentContents.find(element => element.infoCode === code).startId
        let element = this.docxParser.nextParagraf()
        // console.log(id)
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
        // console.log(id)

        id = this.documentContents.find(element => element.infoCode === code).stopId
        while (!this.docxParser.hasBookmarkId(id)) {
            // console.log(this.docxParser.getPara(), this.docxParser.hasBookmarkId(id))
            creator.addPara(this.docxParser.getPara())
            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()

        this.files[code] = creator.getDocument()
    }
}