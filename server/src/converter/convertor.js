
import * as tegs from "./xmlTegs.js"
import { document } from "./temp.js"
import { docxParser } from "./docxParser.js"

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
    xmlCreator = null

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
        this.docxParser.getTechName()
    }

    // runParser () {

    // }
}

let a = new convertor()
// a.startPrototype()
a.start()