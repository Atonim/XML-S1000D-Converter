// In this module we:
// - parse .docx (document.xml) by methods *.getModuleContent()*, 
//      *docxParser.nextParagraf()*, *docxParser.getPara()*, *docxParser.getImageRId()*,
//      *docxParser.getTable()* and *docxParser.getBookmarkId()* 
// - build .xml documents by methods *.builder()*, *.getModuleContent()* 
//      and *xmlCreator.chooseTag()* and write builded files into feild *.files*
// - preprocessing builded files by converterTools's method *.preprocessing()*
// - result is writing in feild-object *.result*

// Potential problems: 
//  - In module *.getModuleContent*. If it won't be any "020" module, "018" stopId will fall

import fs from 'fs'
import { docxParser } from "./docxParser/docxParser.js"
import { xmlCreater } from "./xmlCreater/xmlCreater.js"
import { converterTools } from './converterTools/converterTools.js'

export class converter {

    stringCodes = []
    files = {}
    docxParser = null
    documentContents = null
    techName = "default name"
    imageIdObject = null
    idImage_S1000D_Object = {}
    documentReferences = {}
    result = {
        "Images": {},
        "XML": {}
    }

    constructor(document, documentRels) {
        this.documentRels = documentRels
        this.document = document
        this.docxParser = new docxParser(this.document, this.documentRels)
        this.codesToString()

        for (const code of this.stringCodes) {
            this.files[code] = null
        }
    }

    start() {
        return this.startLogic()
    }

    startLogic() {
        this.techName = this.docxParser.getTechName()
        this.imageIdObject = this.docxParser.getRelsContents()

        this.setMediaObjects()

        this.documentContents = this.docxParser.getContents()

        this.builder()
        // console.log(this.documentReferences)

        this.setResultXML()

        return this.result
    }

    builder() {
        for (let code of this.stringCodes) {
            if (code === '018')
                this.build_018()
            if (!this.documentContents.find(element => element.infoCode === code)) { continue }
            if (!this.documentContents.find(element => element.infoCode === code).startId) { continue }
            if (!this.documentContents.find(element => element.infoCode === code).stopId) { continue }
            if (code === '018') {
            } 
            else if (code === '410') {}
            else 
            // if (code === '044')
            {
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
            if (code !== "018" && this.files[code] === null) { continue }
            let key = "DMC-VBMA-A-46-20-01-00A-" + code + "A-A_000_01_ru_RU.xml"

            this.result.XML[key] = this.preprocessing(this.files[code])
            fs.writeFile(`src/converter/temp/${key}`, this.result.XML[key], (err) => {  })
        }
    }

    build_018() {
        let creator = new xmlCreater("018", this.techName, this.idImage_S1000D_Object)

        this.getModuleContent("018", creator)

        let moduleReferences = creator.refsDict
        this.extendDocReferences(moduleReferences)
        this.files['018'] = creator.getDocument()
    }

    build(code) {
        let creator = new xmlCreater(code, this.techName, this.idImage_S1000D_Object)

        let id = this.documentContents.find(element => element.infoCode === code).startId
        this.docxParser.nextParagraf()
        while (!this.docxParser.hasBookmarkId(id)) {
            this.docxParser.nextParagraf()
        }

        this.getModuleContent(code, creator)

        let moduleReferences = creator.refsDict
        this.extendDocReferences(moduleReferences)
        this.files[code] = creator.getDocument()
    }

    getModuleContent (code, creator) {
        this.docxParser.nextParagraf()
        let id = null
        if (code === "018") {
            id = this.documentContents.find(element => element.infoCode === "020").startId
        } else {
            id = this.documentContents.find(element => element.infoCode === code).stopId
        }
        while (!this.docxParser.hasBookmarkId(id)) {
            if (code === "018" && this.docxParser.isEnter()) { break }
            let paragrafText = this.docxParser.getPara().trim()
            let imagesIds = this.docxParser.getImageRId()

            let tableInfo = this.docxParser.getTable()
            let bookmarks = this.docxParser.getBookmarkId()
            creator.chooseTag(paragrafText.trim(), this.docxParser.getStyleId(), imagesIds, tableInfo, bookmarks)

            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()
    }

}

Object.assign(converter.prototype, converterTools)