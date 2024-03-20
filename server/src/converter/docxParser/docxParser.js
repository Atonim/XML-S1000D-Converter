// Problems:
//  - In *getFullParagraf* stack overflow while reading with recursion      (No problem)
//      stack possibly can be too small for some cases
//  - Remove legacy *getNextParagraf*

import { DOMParser } from 'xmldom'
import { docxRelsParser } from './docxRelsParser.js'
import { docxTableParser } from './docxTableParser.js'
import { docxContentsParser } from './docxContentsParser.js'

export class docxParser {
    document = null
    documentRels = null
    DOMxml = null
    oParser = new DOMParser()
    currentNode = null
    imagesRels = {}
    
    constructor(doc, docRels) {
        this.document = doc
        this.documentRels = docRels
        this.DOMxml = this.oParser.parseFromString(this.document, "text/xml")
        this.DOMxmlRels = this.oParser.parseFromString(this.documentRels, "text/xml")
        this.currentNode = this.DOMxml.lastChild.childNodes[0] // w:body
        this.currentRelsNode = this.DOMxmlRels.lastChild.childNodes[0] // w:body
    }

    getTechName() {
        if (this.currentNode === null) { return null }
        this.currentNode = this.currentNode.firstChild
        while (this.currentNode.tagName !== "w:tbl" && this.currentNode.nextSibling) {
            this.currentNode = this.currentNode.nextSibling
            // console.log(this.currentNode.tagName)
        }
        return this.getPara()
    }

    getFullParagraf(node = this.currentNode, buffer = "") {
        // You must be lower than main tag (<w:p>...</w:p>)

        if (node.tagName !== "w:t" && this.hasChild(node)) {
            node = node.firstChild
            buffer = this.getFullParagraf(node, buffer)
            node = node.parentNode
        }
        if (node.tagName === "w:fldSimple") {
            let stratIndex = node.attributes[0].value.indexOf("_Ref")

            if (stratIndex !== -1) {

                let address = node.attributes[0].value.substring(stratIndex)
                let finishIndex = address.indexOf(" ")
                address = address.substring(0, finishIndex)
                let refText = this.getFullParagraf(node.firstChild)
                if (!refText) { 
                    refText = buffer
                    buffer = ""
                }

                buffer += `<internalRef internalRefId="//**${address}**//" internalRefTargetType="//**Type${address}**//">${refText}</internalRef>`
                return buffer
            }
        } else if (node.tagName === "w:instrText") {
            let stratIndex = node.firstChild.data.indexOf("_Ref")
            if (stratIndex !== -1) {
                let address = node.firstChild.data.substring(stratIndex)
                let finishIndex = address.indexOf(" ")
                address = address.substring(0, finishIndex)
                let refText = this.getFullParagraf(node.firstChild)
                if (!refText) { 
                    refText = buffer
                    buffer = ""
                }

                buffer += `<internalRef internalRefId="//**${address}**//" internalRefTargetType="//**Type${address}**//">${refText}</internalRef>`
                return buffer
            }
        }
        if (node.tagName === "w:t") {
            let fragment = node.firstChild.data
            if (node.parentNode.firstChild.tagName === "w:rPr")
                if (node.parentNode.firstChild.firstChild.tagName === "w:caps")
                    fragment = fragment.toUpperCase()
            buffer += fragment
        }
        if (node.nextSibling !== null) {
            node = node.nextSibling
            buffer = this.getFullParagraf(node, buffer)
        }
        return buffer
    }

    getPara(node = this.currentNode) {
        if (node.tagName === undefined || Object.keys(node.childNodes) == false) { return "" }

        let paragrafText = this.getFullParagraf(node.firstChild, "")

        return paragrafText
    }

    isEnter() {
        if (this.currentNode.tagName === "w:p" && this.getPara() === "") return true
        return false
    }

    getLinkId(node, link = "") {
        if (node) {
            if (link === "" && node.tagName !== "w:hyperlink" && this.hasChild(node)) {
                link = this.getLinkId(node.firstChild, link)
            }
            if (link === "" && node.tagName === "w:hyperlink") {
                return node.attributes[0].value
            }
            if (link === "" && node.nextSibling !== null) {
                link = this.getLinkId(node.nextSibling, link)
            }
        }
        return link
    }

    getStyleId() {
        try {
            return this.currentNode.childNodes[0].childNodes[0].attributes[0].value
        } catch (e) {
            return null
        }
    }

    nextParagraf() {
        if (this.currentNode.nextSibling) {
            this.currentNode = this.currentNode.nextSibling
        }
    }

    prevSibling() {
        if (this.currentNode.previousSibling) {
            this.currentNode = this.currentNode.previousSibling
        }
    }

    hasBookmarkId(id, node = this.currentNode.firstChild) {
        let result = false
        if (node) {
            if (!result && node.tagName !== "w:bookmarkStart" && this.hasChild(node)) {
                result = this.hasBookmarkId(id, node.firstChild)
            }
            if (node.tagName === "w:bookmarkStart") {
                if (String(node.attributes[1].nodeValue) === String(id)) {
                    return true
                }
            }
            if (!result && node.nextSibling !== null) {
                result = this.hasBookmarkId(id, node.nextSibling)
            }
        }
        return result

    }

    hasChild(node) {
        if (node.childNodes && Object.keys(node.childNodes) != false) {
            return true
        }
        return false
    }

    getImageRId(node = this.currentNode.firstChild, id = null) {
        // Method run tree recursively, while searching every a:blip tag 
        //  - It returns xor null if no images found, xor array of rIds
        if (node) {
            if (node.tagName !== "a:blip" && this.hasChild(node)) {
                id = this.getImageRId(node.firstChild, id)
            }
            if (node.tagName === "a:blip") {
                if (id !== null) {
                    id.push(node.attributes[0].value)
                } else {
                    id = [node.attributes[0].value]
                }
            }
            if (node.nextSibling !== null) {
                id = this.getImageRId(node.nextSibling, id)
            }
        }
        return id
    }

    getBookmarkId(node = this.currentNode.firstChild, id = null) {
        // Method run tree recursively, while searching every w:bookmarkStart tag 
        //  - It returns xor null if no bookmarks found, xor array of bookmarks names
        if (node) {
            if (node.tagName !== "w:bookmarkStart" && this.hasChild(node)) {
                id = this.getBookmarkId(node.firstChild, id)
            }
            if (node.tagName === "w:bookmarkStart" && node.attributes[1].value.startsWith("_Ref")) {
                if (id !== null) {
                    id.push(node.attributes[1].value)
                } else {
                    id = [node.attributes[1].value]
                }
            }
            if (node.nextSibling !== null) {
                id = this.getBookmarkId(node.nextSibling, id)
            }
        }
        return id
    }

}

Object.assign(docxParser.prototype, docxRelsParser)
Object.assign(docxParser.prototype, docxTableParser)
Object.assign(docxParser.prototype, docxContentsParser)