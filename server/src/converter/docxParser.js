// Problems:
//  - In *getFullParagraf* stack overflow while reading with recursion      (No problem)
//      stack possibly can be too small for some cases


// import { parseFromString } from 'dom-parser'
import { DOMParser } from 'xmldom'

export class docxParser {
    document = null
    DOMxml  = null
    oParser = new DOMParser()
    currentNode = null

    constructor (doc) {
        this.document = doc
        this.DOMxml = this.oParser.parseFromString(this.document, "text/xml")
        // console.log(this.DOMxml.lastChild.tagName)
        // console.log(this.DOMxml.lastChild.childNodes[1].tagName);
        this.currentNode = this.DOMxml.lastChild.childNodes[1] // w:body
        // console.log(this.DOMxml.lastChild.childNodes[1].childNodes[1200]);
    }

    getTechName () {
        if (this.currentNode === null) { return null }
        this.currentNode = this.currentNode.firstChild
        while (this.currentNode.tagName !== "w:tbl" && this.currentNode.nextSibling) {
            this.currentNode = this.currentNode.nextSibling
            // console.log(this.currentNode.tagName)
        }
        this.getFullParagraf()
    }

    getFullParagraf (buffer = "", depth = 0) {
        if (this.currentNode.tagName === "w:tblW") {
            console.log(Object(this.currentNode.childNodes) === Object({})) }
        if (this.currentNode.tagName !== "w:t" && this.currentNode.childNodes) {
            console.log("here")
            this.currentNode = this.currentNode.firstChild
            this.getFullParagraf (buffer, depth + 1)
        }
        if (this.currentNode.tagName === "w:t") {
            console.log(this.currentNode)
        }
        if (this.currentNode.nextSibling != null) {
            console.log("here2")
            this.currentNode = this.currentNode.nextSibling
            this.getFullParagraf (buffer, depth)
        }
    }
}
