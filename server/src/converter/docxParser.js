// Problems:
//  - In *getFullParagraf* stack overflow while reading with recursion      (No problem)
//      stack possibly can be too small for some cases
//  - Remove legacy *getNextParagraf*

import { DOMParser } from 'xmldom'
import { fileName } from '../fileName.js'

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

    getFullParagraf(buffer = "") {
        // You must be lower than main tag (<w:p>...</w:p>)

        if (this.currentNode.tagName !== "w:t" && this.hasChild(this.currentNode)) {
            this.currentNode = this.currentNode.firstChild
            buffer = this.getFullParagraf(buffer)
            this.currentNode = this.currentNode.parentNode
        }
        if (this.currentNode.tagName === "w:fldSimple") {
            let stratIndex = this.currentNode.attributes[0].value.indexOf("_Ref")
            if (stratIndex !== -1){
                let address = this.currentNode.attributes[0].value.substring(stratIndex)
                let finishIndex = address.indexOf(" ")
                address = address.substring(0, finishIndex)
                // console.log("REF:========:", this.currentNode.attributes[0].value, "}"+address)
                buffer += `<internalRef internalRefId="//**${address}**//" internalRefTargetType="//**Type${address}**//"/>`
                return buffer
            }
        } else if (this.currentNode.tagName === "w:instrText") {
            let stratIndex = this.currentNode.firstChild.data.indexOf("_Ref")
            if (stratIndex !== -1){
                let address = this.currentNode.firstChild.data.substring(stratIndex)
                let finishIndex = address.indexOf(" ")
                address = address.substring(0, finishIndex)
                // console.log("REF:========:", this.currentNode.attributes[0].value, "}"+address)
                buffer += `<internalRef internalRefId="//**${address}**//" internalRefTargetType="//**Type${address}**//"/>`
                return buffer
            }
        }
        if (this.currentNode.tagName === "w:t") {
            buffer += this.currentNode.firstChild
        }
        if (this.currentNode.nextSibling !== null) {
            this.currentNode = this.currentNode.nextSibling
            buffer = this.getFullParagraf(buffer)
        }
        return buffer
    }

    getPara() {
        if (this.currentNode.tagName === undefined || Object.keys(this.currentNode.childNodes) == false) { return "" }
        this.currentNode = this.currentNode.firstChild
        let paragrafText = this.getFullParagraf("")
        this.currentNode = this.currentNode.parentNode
        return paragrafText
    }

    isEnter() {
        if (this.currentNode.tagName === "w:p" && this.getPara() === "") return true
        return false
    }

    getRelsContents() {
        while (this.currentRelsNode) {
            if (this.currentRelsNode.attributes)
                if (this.currentRelsNode.attributes[1].value.endsWith('/image'))
                    this.imagesRels[fileName(this.currentRelsNode.attributes[2].value)] = this.currentRelsNode.attributes[0].value
            this.currentRelsNode = this.currentRelsNode.nextSibling
        }
        return this.imagesRels
    }

    getContents() {
        let buffer = ""

        while (buffer !== "Содержание" && this.currentNode.nextSibling) {
            this.currentNode = this.currentNode.nextSibling
            buffer = this.getPara()
            // console.log(buffer)
        }

        let previousNode = this.currentNode
        let contents = []
        while (!this.isEnter()) {
            this.currentNode = this.currentNode.nextSibling
            buffer = this.getPara()
            // console.log(this.getPara())

            if (buffer.startsWith("1.1.1 ")) {
                contents.push({ "infoCode": "020", "startId": this.getLinkId(this.currentNode.firstChild) })
            }
            if (buffer.startsWith("1.1.2 ")) {
                contents.push({ "infoCode": "030", "startId": this.getLinkId(this.currentNode.firstChild) })
            }
            if (buffer.startsWith("1.1.3 ")) {
                contents.push({ "infoCode": "034", "startId": this.getLinkId(this.currentNode.firstChild) })
            }
            if (buffer.startsWith("1.1.4 ")) {
                contents.push({ "infoCode": "041", "startId": this.getLinkId(this.currentNode.firstChild) })
            }
            if (buffer.startsWith("1.2 ")) {
                contents.push({ "infoCode": "044", "startId": this.getLinkId(this.currentNode.firstChild) })
            }
            if (buffer.startsWith("2.2.3 ")) {
                contents.push({ "infoCode": "122", "startId": this.getLinkId(this.currentNode.firstChild) })
            }
            if (buffer.startsWith("2.2.4 ")) {
                contents.push({ "infoCode": "123", "startId": this.getLinkId(this.currentNode.firstChild) })
            }
            if (buffer.startsWith("2.3.3 ")) {
                contents.push({ "infoCode": "410", "startId": this.getLinkId(this.currentNode.firstChild) })
            }

            if (buffer.startsWith("1.1.2 ")) {
                contents.find(element => element.infoCode === "020").stopId = this.getLinkId(previousNode.firstChild)
            }
            if (buffer.startsWith("1.1.3 ")) {
                contents.find(element => element.infoCode === "030").stopId = this.getLinkId(previousNode.firstChild)
            }
            if (buffer.startsWith("1.1.4 ")) {
                contents.find(element => element.infoCode === "034").stopId = this.getLinkId(previousNode.firstChild)
            }
            if (buffer.startsWith("1.1.5 ")) {
                contents.find(element => element.infoCode === "041").stopId = this.getLinkId(previousNode.firstChild)
            }
            if (buffer.startsWith("2 ")) {
                contents.find(element => element.infoCode === "044").stopId = this.getLinkId(previousNode.firstChild)
            }
            if (buffer.startsWith("2.2.4 ")) {
                contents.find(element => element.infoCode === "122").stopId = this.getLinkId(previousNode.firstChild)
            }
            if (buffer.startsWith("2.3 ")) {
                contents.find(element => element.infoCode === "123").stopId = this.getLinkId(previousNode.firstChild)
            }
            if (buffer.startsWith("2.3.4 ")) {
                contents.find(element => element.infoCode === "410").stopId = this.getLinkId(previousNode.firstChild)
            }
            previousNode = this.currentNode
        }

        return contents
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

    getImageRId (node = this.currentNode.firstChild, id = null) {
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

    getBookmarkId (node = this.currentNode.firstChild, id = null) {
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
