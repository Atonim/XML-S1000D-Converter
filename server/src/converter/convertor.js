
import * as tegs from "./xmlTegs.js"
import document from "./temp.js"

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

    // start (document) {
    //     this.document = document
    //     startLogic()
    // }

    startPrototype () {
        let result = new tegs.dmodule("018", "Разработка программы-конвертера")
        console.log(result.stringify())
    }
}

// let a = new convertor()
// a.startPrototype()