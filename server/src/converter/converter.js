
import * as tegs from "./xmlTegs.js"
import { document } from "./temp.js"
import { docxParser } from "./docxParser.js"
import { xmlCreator } from "./xmlCreator.js"

export class convertor {
    // document = null
    document = document
    file_018 = null
    file_020 = null
    file_030 = null
    file_034 = null
    file_040 = null
    file_044 = null
    file_122 = null
    file_123 = null
    file_410 = null
    docxParser = null
    // xmlCreator = null
    documentContents = null
    techName = "default name"

    start (document = '') {
        // this.document = document
        this.docxParser = new docxParser(this.document)
        this.startLogic()
    }

    startPrototype () {
        let result = new tegs.dmodule("018", "Разработка программы-конвертера")
        console.log(result.stringify())
    }

    startLogic () {
        this.techName = this.docxParser.getTechName()
        this.documentContents = this.docxParser.getContents()
        this.build_018()
        this.build_041()
        // console.log(this.file_020.stringify())

    }

    build_018 () {
        let creator = new xmlCreator("018", this.techName)

        let element = this.docxParser.getNextParagraf()
        while (element.status === "success") {
            creator.addPara(element.value)
            element = this.docxParser.getNextParagraf()
        }

        this.file_018 = creator.getDocument()
        // console.log(this.file_018.stringify())
    }

    build_020 () {

        // console.log(this.documentContents.find(element => element.infoCode === "020"))
        let creator = new xmlCreator("020", this.techName)

        let id = this.documentContents.find(element => element.infoCode === "020").startId
        let element = this.docxParser.nextParagraf()
            // console.log(id)
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
            // console.log(id)

        id = this.documentContents.find(element => element.infoCode === "020").stopId
        element = this.docxParser.getNextParagraf()
        // console.log(element, id, this.docxParser.hasBookmarkId(id)) //this.docxParser.currentNode, id))
        while (!this.docxParser.hasBookmarkId(id) && element.status === "success") {
            creator.addPara(element.value)
            console.log(element.value, this.docxParser.hasBookmarkId(id))
            element = this.docxParser.getNextParagraf()
        }
        this.file_020 = creator.getDocument()

    }

    build_030 () {

        let creator = new xmlCreator("030", this.techName)

        let id = this.documentContents.find(element => element.infoCode === "030").startId
        let element = this.docxParser.nextParagraf()
            // console.log(id)
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
            // console.log(id)

        id = this.documentContents.find(element => element.infoCode === "030").stopId
        element = this.docxParser.getNextParagraf()
        // console.log(element, id, this.docxParser.hasBookmarkId(id)) //this.docxParser.currentNode, id))
        while (!this.docxParser.hasBookmarkId(id) && element.status === "success") {
            creator.addPara(element.value)
            console.log(element.value)
            element = this.docxParser.getNextParagraf()
        }
        this.file_030 = creator.resultDocument
    }

    build_034 () {

        let creator = new xmlCreator("034", this.techName)
        let id = this.documentContents.find(element => element.infoCode === "034").bookmarkId
        let element = this.docxParser.nextParagraf()
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
        this.file_034 = creator.resultDocument
    }

    build_041 () {

        let creator = new xmlCreator("041", this.techName)

        let id = this.documentContents.find(element => element.infoCode === "041").startId
        let element = this.docxParser.nextParagraf()
            console.log(this.documentContents.find(element => element.infoCode === "041"))
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
            // console.log(id)

        id = this.documentContents.find(element => element.infoCode === "041").stopId
        element = this.docxParser.getNextParagraf()
        // console.log(element, id, this.docxParser.hasBookmarkId(id)) //this.docxParser.currentNode, id))
        while (!this.docxParser.hasBookmarkId(id) && element.status === "success") {
            creator.addPara(element.value)
            console.log(element.value, this.docxParser.hasBookmarkId(id))
            element = this.docxParser.getNextParagraf()
        }
        this.file_041 = creator.resultDocument
    }

    build_044 () {

        let creator = new xmlCreator("044", this.techName)
        this.file_044 = creator.resultDocument
    }

    build_122 () {

        let creator = new xmlCreator("122", this.techName)
        this.file_122 = creator.resultDocument
    }

    build_123 () {

        let creator = new xmlCreator("123", this.techName)
        this.file_123 = creator.resultDocument
    }

    build_410 () {

        let creator = new xmlCreator("410", this.techName)
        this.file_410 = creator.resultDocument
    }

}

let a = new convertor()
// a.startPrototype()
a.start()