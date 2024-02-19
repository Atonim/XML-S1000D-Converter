import * as tags from "./xmlTags.js"
import { xmlTableCreater } from "./xmlTableCreater.js"
import { xmlParagraphCreater } from "./xmlParagraphCreater.js"
import { xmlMoverCreater } from "./xmlMoverCreater.js"

export class xmlCreater {
    currentElement = null
    resultDocument = null
    imagesList = null
    levelStack = []
    isCurrentElementInSeq = true
    seqVariants = ["sequentialList", "randomList"]
    refsDict = {}
    mediaList = []
    tableMergeState = []

    constructor(infoCode, techName, imagesList) {
        this.currentElement = new tags.dmodule(infoCode, techName)
        this.imagesList = imagesList
    }

    getDocument() {
        while (this.currentElement.parent) {
            this.currentElement = this.currentElement.parent
        }
        this.currentElement.media = this.mediaList
        let proccessedDoc = this.currentElement.stringify()
        return proccessedDoc
    }

    addId (node, id) {
        node.id = id
        node.addAttribute(`id="${id}"`)
    }

    setParaBookmark(bookmarkIds) {
        if (bookmarkIds === null) { return }
        for (let mark of bookmarkIds)
            if (this.refsDict.hasOwnProperty(mark)) { return }

        let node = this.currentElement
        if (node.name === "leveledPara") {
            this.addId(node, bookmarkIds[0])
        } else {
            this.addId(node, bookmarkIds[0])
        }

        if (node.id && bookmarkIds) {
            let id = node.id

            bookmarkIds.forEach(element => {
                this.refsDict[element] = { "id": id, "type": "irtt07" }
            })
        }
    }

    setTableBookmark (bookmarkId, tableId) {
        if (bookmarkId && tableId) {
            this.refsDict[bookmarkId] = { "id": `tab-${tableId}`, "type": "irtt02" }
        }
    }

    actualizeSeqStack(paragraf, seqId) {
        // Будем считать, что мы не поднимаемся в иерархии выше первого уровня 
        //  в стеке, а если поднимимся, то это будет уже конец модуля данных 
        //  и, следовательно, переход к следующему
        let newT = new tags.text("\n[" + String(this.levelStack) + " | " + String(this.currentElement.name) + "]")
        this.currentElement.addContent(newT)
        newT.setParent(this.currentElement)

        if (seqId === null) {
            return true
        }

        if (this.levelStack.length === 0) {
            this.addLeveledPara()
            this.levelStack.push(seqId)
            return true
        }
        // if (this.levelStack.length === 1 && this.currentElement.name === "dmodule") {
        //     this.addLeveledPara()
        // }

        if (seqId === this.levelStack.at(-1)) {
            if (this.currentElement.name === "levelledPara") {
                this.goUp()
                this.addLeveledPara()
            }
            return true
        }

        if (this.levelStack.indexOf(seqId) !== -1 && this.levelStack.at(-1) !== seqId) {
            while (this.levelStack.at(-1) !== seqId) {
                if (this.levelStack.at(-1) === null) {
                } else if (this.levelStack.at(-2) === "a1") {
                // } else if (this.levelStack.at(-1) === "-1") {
                } else if (this.levelStack.at(-2) === "4a") {
                    this.goUp()
                    this.goUp()
                    this.goUp()
                } else if (this.levelStack.at(-1) === "4a") {
                } else if (this.levelStack.at(-1) === "affffa") {
                    this.goUp()
                    this.goUp()
                } else if (this.levelStack.at(-1) === "preserve" && this.currentElement.name === "listItem") {
                } else if (this.levelStack.at(-2) === "preserve") {
                } else {
                    this.goUp()
                    this.goUp()
                    this.goUp()
                }
                this.levelStack.pop()
            }
            if (this.currentElement.name === "dmodule") {
                this.addLeveledPara()
            }

            return false
        } else if (this.levelStack.indexOf(seqId) === -1) {
            this.levelStack.push(seqId)
            if (seqId === "preserve" && this.seqVariants.indexOf(this.currentElement.name) !== -1) {
                this.goUp()
                this.goUp()
            } else {}
            return true
        }

        return true
    }

    chooseTextParagraf(paragraf, seqId = null, bookmarkIds = null) {

        if (this.currentElement.name === "levelledPara" && this.currentElement.content.length === 1) {
            this.currentElement.content[0] = new tags.title(this.getParaTitle(paragraf + " | " + String(seqId)))
        }

        if (this.seqVariants.indexOf(this.currentElement.name) !== -1) {
            this.addListItem()
            this.currentElement = this.currentElement.content.at(-1)
            this.chooseTextParagraf(paragraf, seqId)
            this.goUp()
        } 
        else if (this.currentElement.name === "caution" && paragraf === paragraf.toUpperCase()) {
            this.addCautionPara(paragraf)
        } 
        else if (this.currentElement.name === "caution" && paragraf !== paragraf.toUpperCase()) {
            this.goUp()
            this.chooseTextParagraf(paragraf, seqId)
        } 
        else if (paragraf.startsWith("Рисунок")) {
            this.addFigureTitle(paragraf + " | " + String(seqId), bookmarkIds)
        } 
        else if (paragraf.startsWith("ВНИМАНИЕ: ")) {
            this.addCaution()
            this.chooseTextParagraf(paragraf.replace("ВНИМАНИЕ: ", ''), seqId)
        } 
        else if (paragraf.startsWith("Примечание – ")) {
            this.addNote(paragraf.replace("Примечание – ", ''))
        } 
        else if (paragraf.startsWith("Примечание - ")) {
            this.addNote(paragraf.replace("Примечание - ", ''))
        } 
        else {
            // this.addPara(paragraf)
            this.addPara(paragraf + " | " + String(seqId))
        }

        if (paragraf.replaceAll('\u00A0', '').startsWith('Таблица') || paragraf.startsWith('Рисунок')) { return }
        this.setParaBookmark(bookmarkIds)
    }

    chooseTag(paragraf, seqId, imageIds, table, bookmarkIds) {
        
        if (table) {
            this.addTable(table)
        } else if (paragraf) {
            this.isCurrentElementInSeq = this.actualizeSeqStack(paragraf, seqId)

            this.chooseTextParagraf(paragraf, seqId, bookmarkIds)
            this.chooseListVariant(paragraf)
        } else if (imageIds) {
            this.addFigure(imageIds)
        }
    }

}

Object.assign(xmlCreater.prototype, xmlTableCreater)
Object.assign(xmlCreater.prototype, xmlParagraphCreater)
Object.assign(xmlCreater.prototype, xmlMoverCreater)