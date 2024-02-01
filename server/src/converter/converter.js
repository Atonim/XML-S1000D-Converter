
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
    file_041 = null
    file_044 = null
    file_122 = null
    file_123 = null
    file_410 = null
    docxParser = null
    // xmlCreator = null
    documentContents = null
    techName = "default name"

    constructor(document, documentRels) {

        this.document = document
        this.docxParser = new docxParser(this.document)
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
        this.build_018()
        result.XML["DMC-VBMA-A-46-20-01-00A-018A-A_000_01_ru_RU.xml"] = this.file_018.stringify()
        this.build_020()
        result.XML["DMC-VBMA-A-46-20-01-00A-020A-A_000_01_ru_RU.xml"] = this.file_020.stringify()
        this.build_030()
        result.XML["DMC-VBMA-A-46-20-01-00A-030A-A_000_01_ru_RU.xml"] = this.file_030.stringify()
        this.build_034()
        result.XML["DMC-VBMA-A-46-20-01-00A-034A-A_000_01_ru_RU.xml"] = this.file_034.stringify()
        this.build_041()
        result.XML["DMC-VBMA-A-46-20-01-00A-041A-A_000_01_ru_RU.xml"] = this.file_041.stringify()
        this.build_044()
        result.XML["DMC-VBMA-A-46-20-01-00A-044A-A_000_01_ru_RU.xml"] = this.file_044.stringify()
        this.build_122()
        result.XML["DMC-VBMA-A-46-20-01-00A-122A-A_000_01_ru_RU.xml"] = this.file_122.stringify()
        this.build_123()
        result.XML["DMC-VBMA-A-46-20-01-00A-123A-A_000_01_ru_RU.xml"] = this.file_123.stringify()
        this.build_410()
        result.XML["DMC-VBMA-A-46-20-01-00A-410A-A_000_01_ru_RU.xml"] = this.file_410.stringify()
        // console.log(this.documentContents)
        // console.log(this.file_020.stringify())


        return result
    }

    build_018() {
        let creator = new xmlCreator("018", this.techName)

        let element = this.docxParser.getNextParagraf()
        while (element.status === "success") {
            creator.addPara(element.value)
            element = this.docxParser.getNextParagraf()
        }

        this.file_018 = creator.getDocument()
        // console.log(this.file_018.stringify())
    }

    build_020() {

        let creator = new xmlCreator("020", this.techName)

        let id = this.documentContents.find(element => element.infoCode === "020").startId
        let element = this.docxParser.nextParagraf()
        // console.log(id)
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
        // console.log(id)

        id = this.documentContents.find(element => element.infoCode === "020").stopId
        while (!this.docxParser.hasBookmarkId(id)) {
            // console.log(this.docxParser.getPara(), this.docxParser.hasBookmarkId(id))
            creator.addPara(this.docxParser.getPara())
            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()

        this.file_020 = creator.getDocument()

    }

    build_030() {

        let creator = new xmlCreator("030", this.techName)
        // this.docxParser = new docxParser(this.document)

        let id = this.documentContents.find(element => element.infoCode === "030").startId
        let element = this.docxParser.nextParagraf()
        // console.log(id)
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
        // console.log(id)

        id = this.documentContents.find(element => element.infoCode === "030").stopId
        while (!this.docxParser.hasBookmarkId(id)) {
            // console.log(this.docxParser.getPara(), this.docxParser.hasBookmarkId(id))
            creator.addPara(this.docxParser.getPara())
            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()
        this.file_030 = creator.getDocument()
    }

    build_034() {

        let creator = new xmlCreator("034", this.techName)

        let id = this.documentContents.find(element => element.infoCode === "034").startId
        let element = this.docxParser.nextParagraf()
        // console.log(id)
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
        // console.log(id)

        id = this.documentContents.find(element => element.infoCode === "034").stopId
        while (!this.docxParser.hasBookmarkId(id)) {
            // console.log(this.docxParser.getPara(), this.docxParser.hasBookmarkId(id))
            creator.addPara(this.docxParser.getPara())
            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()
        this.file_034 = creator.getDocument()
    }

    build_041() {

        let creator = new xmlCreator("041", this.techName)

        let id = this.documentContents.find(element => element.infoCode === "041").startId
        let element = this.docxParser.nextParagraf()
        //console.log(this.documentContents.find(element => element.infoCode === "041"))
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
        // console.log(id)

        id = this.documentContents.find(element => element.infoCode === "041").stopId
        while (!this.docxParser.hasBookmarkId(id)) {
            // console.log(this.docxParser.getPara(), this.docxParser.hasBookmarkId(id))
            creator.addPara(this.docxParser.getPara())
            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()
        this.file_041 = creator.getDocument()
    }

    build_044() {

        let creator = new xmlCreator("044", this.techName)

        let id = this.documentContents.find(element => element.infoCode === "044").startId
        let element = this.docxParser.nextParagraf()
        // console.log(id)
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
        // console.log(id)

        id = this.documentContents.find(element => element.infoCode === "044").stopId
        while (!this.docxParser.hasBookmarkId(id)) {
            // console.log(this.docxParser.getPara(), this.docxParser.hasBookmarkId(id))
            creator.addPara(this.docxParser.getPara())
            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()
        this.file_044 = creator.getDocument()
    }

    build_122() {

        let creator = new xmlCreator("122", this.techName)

        let id = this.documentContents.find(element => element.infoCode === "122").startId
        let element = this.docxParser.nextParagraf()
        // console.log(id)
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
        // console.log(id)

        id = this.documentContents.find(element => element.infoCode === "122").stopId
        while (!this.docxParser.hasBookmarkId(id)) {
            // console.log(this.docxParser.getPara(), this.docxParser.hasBookmarkId(id))
            creator.addPara(this.docxParser.getPara())
            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()
        this.file_122 = creator.getDocument()
    }

    build_123() {

        let creator = new xmlCreator("123", this.techName)

        let id = this.documentContents.find(element => element.infoCode === "123").startId
        let element = this.docxParser.nextParagraf()
        // console.log(id)
        while (!this.docxParser.hasBookmarkId(id)) {
            element = this.docxParser.nextParagraf()
        }
        // console.log(id)

        id = this.documentContents.find(element => element.infoCode === "123").stopId
        while (!this.docxParser.hasBookmarkId(id)) {
            // console.log(this.docxParser.getPara(), this.docxParser.hasBookmarkId(id))
            creator.addPara(this.docxParser.getPara())
            this.docxParser.nextParagraf()
        }
        this.docxParser.prevSibling()
        this.file_123 = creator.getDocument()
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
        this.file_410 = creator.getDocument()
    }

}

//let a = new convertor(document)
// a.startPrototype()
//console.log(a.start())