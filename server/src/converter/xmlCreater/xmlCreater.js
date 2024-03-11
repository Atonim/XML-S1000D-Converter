import * as tags from "./xmlTags.js"
import { xmlTableCreater } from "./xmlTableCreater.js"
import { xmlParagraphCreater } from "./xmlParagraphCreater.js"
import { xmlMoverCreater } from "./xmlMoverCreater.js"
import CyrillicToTranslit from 'cyrillic-to-translit-js'

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
    cyrillicToTranslit = new CyrillicToTranslit();

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

    actualizeSeqStack(paragraph, seqId) {
        // Будем считать, что мы не поднимаемся в иерархии выше первого уровня 
        //  в стеке, а если поднимимся, то это будет уже конец модуля данных 
        //  и, следовательно, переход к следующему
        // let newT = new tags.text("\n[" + String(this.levelStack) + " | " + String(this.currentElement.name) + "]")
        // this.currentElement.addContent(newT)
        // newT.setParent(this.currentElement)

        if (seqId === null) {
            return true
        }

        if (this.levelStack.length === 0) {
            this.addLeveledPara()
            this.levelStack.push(seqId)
            return true
        }

        if (seqId === this.levelStack.at(-1)) {
            if (this.currentElement.name === "levelledPara" && this.levelStack.length === 1) {
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
                } else if (this.levelStack.at(-2) === "affffa") {
                } else if (this.levelStack.at(-1) === "affffa" && this.currentElement.name === "levelledPara") {
                } else if (this.levelStack.at(-1) === "affffa") {
                    this.goUp()
                    this.goUp()
                    this.goUp()
                } else if (this.levelStack.at(-1) === "preserve" && this.currentElement.name === "listItem") {
                // } else if (this.levelStack.at(-1) === "preserve") {
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
            } else if (this.currentElement.name === "levelledPara" && this.levelStack.length === 1) {
                this.goUp()
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

    chooseTextParagraph(paragraph, seqId = null, bookmarkIds = null) {
        if (this.currentElement.name === "levelledPara" && this.currentElement.content.length === 1) {
            // this.currentElement.content[0] = new tags.title(this.getParaTitle(paragraph + " | | " + String(seqId)))
            // this.currentElement.content[0] = new tags.title(this.getParaTitle(this.cyrillicToTranslit.transform(paragraph)))
            this.currentElement.content[0] = new tags.title(this.getParaTitle(paragraph))
        }

        if (this.seqVariants.indexOf(this.currentElement.name) !== -1) {
            this.addListItem()
            this.currentElement = this.currentElement.content.at(-1)
            this.chooseTextParagraph(paragraph, seqId)
            this.goUp()
        } 
        else if (this.currentElement.name === "caution" && paragraph === paragraph.toUpperCase()) {
            this.addCautionPara(paragraph)
            // this.addCautionPara(this.cyrillicToTranslit.transform(paragraph))
        } 
        else if (this.currentElement.name === "caution" && paragraph !== paragraph.toUpperCase()) {
            this.goUp()
            this.chooseTextParagraph(paragraph, seqId)
        } 
        else if (paragraph.startsWith("Рисунок")) {
            // this.addFigureTitle(this.cyrillicToTranslit.transform(paragraph))
            this.addFigureTitle(paragraph)
        } 
        else if (paragraph.startsWith("ВНИМАНИЕ: ")) {
            this.addCaution()
            this.chooseTextParagraph(paragraph.replace("ВНИМАНИЕ: ", ''), seqId)
        } 
        else if (paragraph.startsWith("Примечание – ")) {
            this.addNote(paragraph.replace("Примечание – ", ''))
        } 
        else if (paragraph.startsWith("Примечание - ")) {
            this.addNote(paragraph.replace("Примечание - ", ''))
        } 
        else {
            this.addPara(paragraph)
            // this.addPara(this.cyrillicToTranslit.transform(paragraph))
            // this.addPara(paragraph + " | " + String(seqId))
        }

        if (paragraph.replaceAll('\u00A0', '').startsWith('Таблица') || paragraph.startsWith('Рисунок')) { return }
        this.setParaBookmark(bookmarkIds)
    }

    chooseTag(paragraph, seqId, imageIds, table, bookmarkIds) {
        
        if (table) {
            this.addTable(table)
        } else if (paragraph) {
            this.isCurrentElementInSeq = this.actualizeSeqStack(paragraph, seqId)

            this.chooseTextParagraph(paragraph, seqId, bookmarkIds)
            this.chooseListVariant(paragraph)
        } else if (imageIds) {
            this.addFigure(imageIds)
        }
    }

}

Object.assign(xmlCreater.prototype, xmlTableCreater)
Object.assign(xmlCreater.prototype, xmlParagraphCreater)
Object.assign(xmlCreater.prototype, xmlMoverCreater)