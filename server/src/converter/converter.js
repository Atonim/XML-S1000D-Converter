
import * as tegs from "./xmlTags.js"
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

    constructor(document, documentRels) {
        //this.media = media
        this.documentRels = documentRels
        this.imagesId = {
            'image1.jpeg': 'rId8',
            'image2.jpeg': 'rId9',
            'image3.jpeg': 'rId10',
            'image4.jpeg': 'rId11',
            'image5.jpeg': 'rId12',
            'image17.emf': 'rId24',
            'image18.emf': 'rId25',
        }
        this.document = document
        this.docxParser = new docxParser(this.document)
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
        this.documentContents = this.docxParser.getContents()

        let result = {
            "Images": {},
            "XML": {}
        }
        this.builder()
        this.setResult(result)
        console.log(this.files['044'].stringify())
        return result
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

    setResult(result) {
        for (let infoCode of this.stringCodes) {
            let key = "DMC-VBMA-A-46-20-01-00A-" + infoCode + "A-A_000_01_ru_RU.xml"
            result.XML[key] = this.files[infoCode].stringify()
        }

        const imagesNames = Object.keys(this.imagesId)
        let index = 1

        for (let name of imagesNames) {
            let stringIndex = this.indexToString(index)
            let convertedName = "ICN-VBMA-A-462001-A-00000-" + stringIndex + "-A-001-1.jpg"
            result.Images[name] = convertedName
            index++
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
            let paragrafText = this.docxParser.getPara().trim()
            creator.chooseTag(paragrafText.trim(), this.docxParser.getStyleId())
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

let a = new convertor(document, 1,1)
// a.startPrototype()
a.start()
// console.log(a.start())