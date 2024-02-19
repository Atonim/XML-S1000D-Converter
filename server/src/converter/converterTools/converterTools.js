import { codes } from "./codes.js"

export const converterTools = {

    codesToString() {
        const lastCodeLength = codes[codes.length - 1].toString().length
        for (let code of codes) {
            code = code.toString()
            while (code.length !== lastCodeLength) {
                code = 0 + code
            }
            this.stringCodes.push(code)
        }
    },

    indexToString(index) {
        const maxIndexLength = 5
        index = index.toString()
        while (index.length !== maxIndexLength) {
            index = 0 + index
        }
        return index
    },

    preprocessing(xmlCode) {
        let start = xmlCode.indexOf("//**")
        let stop = xmlCode.indexOf("**//")
        while (start !== -1 && stop !== -1) {
            let ref = xmlCode.substring(start + 4, stop)
            let fullRef = xmlCode.substring(start, stop + 4)

            let pasteElement = ""
            if (ref.startsWith("Type") && this.documentReferences[ref.replace("Type", "")]) {
                ref = ref.replace("Type", "")
                pasteElement = this.documentReferences[ref].type
                xmlCode = xmlCode.replace(fullRef, pasteElement)
            } else if (this.documentReferences[ref]) {
                pasteElement = this.documentReferences[ref].id
                xmlCode = xmlCode.replace(fullRef, pasteElement)
            } else {
                xmlCode = xmlCode.replace(fullRef, pasteElement)
            }

            start = xmlCode.indexOf("//**")
            stop = xmlCode.indexOf("**//")

        }
        return xmlCode
    },

    extendDocReferences (references) {
        for (let ref in references) {
            // let repeatedReference = references.find(element => )
            if (this.documentReferences.hasOwnProperty(ref)) { continue }
            this.documentReferences[ref] = references[ref]
        }
    }
}