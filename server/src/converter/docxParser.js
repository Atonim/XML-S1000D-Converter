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
        this.currentNode = this.DOMxml.lastChild.childNodes[1] // w:body
        this.currentRelsNode = this.DOMxmlRels.lastChild.childNodes[1] // w:body
        // console.log('-----------')
        // console.log(this.DOMxmlRels)
        // console.log('-----------')
        // console.log(this.currentRelsNode.tagName)
        //console.log('-----------')
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
        if (this.currentNode.tagName === "w:t") {
            buffer += this.currentNode.firstChild
            // let textNode = this.currentNode.firstChild  // Same as string higher, but must work in case when text separeted in many Text elements
            // buffer += textNode.data
            // while (textNode.nextSibling) {
            //     textNode = textNode.nextSibling
            //     buffer += textNode.data
            // }
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

    getRelsPara() {
        if (this.currentRelsNode.tagName === undefined || Object.keys(this.currentRelsNode.childNodes) == false) { return "" }
        this.currentRelsNode = this.currentRelsNode.firstChild
        let paragrafText = this.getFullParagraf("")
        this.currentNode = this.currentNode.parentNode
        return paragrafText
    }

    isEnter() {
        if (this.currentNode.tagName === "w:p" && this.getPara() === "") return true
        return false
    }

    isRelsEnter() {
        if (this.currentRelsNode.tagName === "w:p" && this.getRelsPara() === "") return true
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

        let keepNode = this.currentNode
        let contents = []
        while (!this.isEnter()) {
            this.currentNode = this.currentNode.nextSibling
            buffer = this.getPara()
            // console.log(this.getPara())

            keepNode = this.currentNode
            if (buffer.startsWith("1.1.1 ")) {
                contents.push({ "infoCode": "020", "startId": this.getLinkId(keepNode.firstChild) })
            }
            if (buffer.startsWith("1.1.2 ")) {
                contents.push({ "infoCode": "030", "startId": this.getLinkId(keepNode.firstChild) })
            }
            if (buffer.startsWith("1.1.3 ")) {
                contents.push({ "infoCode": "034", "startId": this.getLinkId(keepNode.firstChild) })
            }
            if (buffer.startsWith("1.1.4 ")) {
                contents.push({ "infoCode": "041", "startId": this.getLinkId(keepNode.firstChild) })
            }
            if (buffer.startsWith("1.2 ")) {
                contents.push({ "infoCode": "044", "startId": this.getLinkId(keepNode.firstChild) })
            }
            if (buffer.startsWith("2.2.3 ")) {
                contents.push({ "infoCode": "122", "startId": this.getLinkId(keepNode.firstChild) })
            }
            if (buffer.startsWith("2.2.4 ")) {
                contents.push({ "infoCode": "123", "startId": this.getLinkId(keepNode.firstChild) })
            }
            if (buffer.startsWith("2.3.3 ")) {
                contents.push({ "infoCode": "410", "startId": this.getLinkId(keepNode.firstChild) })
            }

            if (buffer.startsWith("1.1.2 ")) {
                contents.find(element => element.infoCode === "020").stopId = this.getLinkId(keepNode.firstChild)
            }
            if (buffer.startsWith("1.1.3 ")) {
                contents.find(element => element.infoCode === "030").stopId = this.getLinkId(keepNode.firstChild)
            }
            if (buffer.startsWith("1.1.4 ")) {
                contents.find(element => element.infoCode === "034").stopId = this.getLinkId(keepNode.firstChild)
            }
            if (buffer.startsWith("1.1.5 ")) {
                contents.find(element => element.infoCode === "041").stopId = this.getLinkId(keepNode.firstChild)
            }
            if (buffer.startsWith("2 ")) {
                contents.find(element => element.infoCode === "044").stopId = this.getLinkId(keepNode.firstChild)
            }
            if (buffer.startsWith("2.2.4 ")) {
                contents.find(element => element.infoCode === "122").stopId = this.getLinkId(keepNode.firstChild)
            }
            if (buffer.startsWith("2.3 ")) {
                contents.find(element => element.infoCode === "123").stopId = this.getLinkId(keepNode.firstChild)
            }
            if (buffer.startsWith("2.3.4 ")) {
                contents.find(element => element.infoCode === "410").stopId = this.getLinkId(keepNode.firstChild)
            }
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
            // console.log(this.currentNode.childNodes[1].childNodes[1].attributes[0].value)
        try {
            return this.currentNode.childNodes[1].childNodes[1].attributes[0].value
        } catch (e) {
            return null
        }
    }

    getNextParagraf() {
        // if (this.currentNode.nextSibling === undefined) {console.log("undefined")}
        this.currentNode = this.currentNode.nextSibling
        let buffer = ""

        while (!this.isEnter() && buffer === "") {
            buffer = this.getPara()
            this.currentNode = this.currentNode.nextSibling
        }
        // console.log(this.currentNode.tagName)

        if (buffer !== "") {
            return { "status": "success", "value": buffer }
        }
        return { "status": "fail", "value": buffer }
    }

    nextParagraf() {
        if (this.currentNode.nextSibling) {
            this.currentNode = this.currentNode.nextSibling
        }
        // while (this.currentNode.nextSibling && this.currentNode.tagName === undefined) {
        //     this.currentNode = this.currentNode.nextSibling
        // }
        // console.log("next", this.currentNode.tagName)
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
                    // console.log(node.attributes[1].nodeValue, id)
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



}
