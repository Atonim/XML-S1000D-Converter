import * as tags from "./xmlTags.js"

export class xmlCreator {
    currentElement = null
    resultDocument = null
    imagesList = null
    levelStack = []
    isCurrentElementInSeq = true
    seqVariants = ["sequentialList", "randomList"]
    refsDict = {}
    mediaList = []
    // lastInsertedTag = null

    constructor (infoCode, techName, imagesList) {
        this.currentElement = new tags.dmodule(infoCode, techName)
        this.imagesList = imagesList
        // console.log(imagesList)
        // let newElement = new tags.caution()
        // newElement.parent = this.currentElement
        // this.currentElement.addContent(newElement)
        // this.currentElement = newElement
    }

    preproccessing (xmlCode) {
        let start = xmlCode.indexOf("//**")
        let stop  = xmlCode.indexOf("**//")
        while (start !== -1 && stop !== -1) {
            let ref = xmlCode.substring(start + 4, stop)
            let fullRef = xmlCode.substring(start, stop + 4)

            let pasteElement = ""
            if (ref.startsWith("Type") && this.refsDict[ref.replace("Type", "")]) {
                ref = ref.replace("Type", "")
                pasteElement = this.refsDict[ref].type
                xmlCode = xmlCode.replace(fullRef, pasteElement)
            } else if (this.refsDict[ref]) {
                pasteElement = this.refsDict[ref].id
                xmlCode = xmlCode.replace(fullRef, pasteElement)
            } else {
                xmlCode = xmlCode.replace(fullRef, pasteElement)
            }

            start = xmlCode.indexOf("//**")
            stop  = xmlCode.indexOf("**//")

        }
        return xmlCode
    }

    getDocument () {
        while (this.currentElement.parent) {
            this.currentElement = this.currentElement.parent
        }
        this.currentElement.media = this.mediaList
        let proccessedDoc = this.currentElement.stringify()
        proccessedDoc = this.preproccessing(proccessedDoc)
        return proccessedDoc
    }

    goUp () {
        if (this.currentElement && this.currentElement.parent) {
            this.currentElement = this.currentElement.parent
        }
    }

    goDown () {
        if (this.currentElement && this.currentElement.content.lengh) {
            this.currentElement = this.currentElement.content.at(-1)
        }
    }

    goToLastInsertedPara () {
        // console.log(this.currentElement.name)
        if (this.currentElement.content.at(-1) && this.currentElement.content.at(-1).name !== "listItem") {
            this.currentElement = this.currentElement.content.at(-1)
        } else if (this.currentElement.content.at(-1) && this.currentElement.content.at(-1).content.at(-1)) {
            this.currentElement = this.currentElement.content.at(-1).content.at(-1)
        }
        // console.log(this.currentElement.name)
    }

    goToLastParent () {
        if (this.currentElement.name === "dmodule") {
            
        } else {
            this.currentElement = this.currentElement.parent
        }
    }

    addPara (paragraf) {
        if (this.currentElement) {
            let newP = new tags.para()
            let newT = new tags.text(paragraf)
            newP.setParent(this.currentElement)
            newT.setParent(newP)
            
            newP.addContent(newT)
            this.currentElement.addContent(newP)
        }
    }

    addListItem (paragraf = "") {
        if (this.currentElement) {
            let newI = new tags.listItem()
            // let newP = new tags.para()
            // let newT = new tags.text(paragraf)
            newI.setParent(this.currentElement)
            // newP.setParent(newI)
            // newT.setParent(newP)
            
            // newP.addContent(newT)
            // newI.addContent(newP)
            this.currentElement.addContent(newI)
        }
    }

    addSequentialList () {
        // Если встречено ":" на конце абзаца, далее будет идти перечисление
        //  Находим подходящее место и
        //  включаем в структуру документа sequentialList
        if (this.currentElement) {
            let newL = new tags.sequentialList()
            this.goToLastInsertedPara()
                
            newL.parent = this.currentElement
            this.currentElement.content.push(newL)
            this.currentElement = newL
        }
    }

    addRandomList () {
        // Если встречено ":" на конце абзаца, далее будет идти перечисление
        //  Находим подходящее место и
        //  включаем в структуру документа randomList
        if (this.currentElement) {
            let newL = new tags.randomList()
            this.goToLastInsertedPara()

            newL.parent = this.currentElement
            this.currentElement.content.push(newL)
            this.currentElement = newL
        }
    }

    addLeveledPara (title="default title") {
        let newLP = new tags.levelledPara()
        let newTi = new tags.title(title)

        newTi.parent = newLP
        newLP.parent = this.currentElement

        newLP.content.push(new tags.title(title))
        this.currentElement.content.push(newLP)
        this.currentElement = newLP

    }

    addCaution () {
        if (this.currentElement) {
            let newC = new tags.caution()

            newC.parent = this.currentElement
            this.currentElement.content.push(newC)
            this.currentElement = newC
        }
    }

    addCautionPara (paragraf) {
        if (this.currentElement) {
            let newCP = new tags.warningAndCautionPara()
            let newT = new tags.text(paragraf)

            newCP.parent = this.currentElement
            newT.parent = newCP
            newCP.content.push(newT)
            this.currentElement.content.push(newCP)
        }
    }

    addNote (paragraf) {
        if (this.currentElement) {
            let newN = new tags.note()
            let newNP = new tags.notePara()
            let newT = new tags.text(paragraf)

            newN.parent = this.currentElement
            newNP.parent = newN
            newT.parent = newNP
            newNP.content.push(newT)
            newN.content.push(newNP)
            this.currentElement.content.push(newN)
        }
    }

    addId (node, id) {
        node.id = id
        node.addAttribute(` id="${id}"`)
    }

    checkNote (paragraf) {
        if (paragraf.startsWith("Примечание – ")) {
            // this.chooseTextParagraf(paragraf.replace("Примечание – ", ''), seqId)
            this.addNote(paragraf.replace("Примечание – ", ''))
        } else if (paragraf.startsWith("Примечание - ")) {
            // this.chooseTextParagraf(paragraf.replace("Примечание - ", ''), seqId)
            this.addNote(paragraf.replace("Примечание - ", ''))
        }
    }

    chooseListVariant (paragraf) {
        if (paragraf.endsWith(':') && this.currentElement.name === "sequentialList" && this.currentElement.content[0]) {
            // console.log("randomList detected", )
            this.addRandomList()
        } else if (paragraf.endsWith(':') && this.currentElement.content[0]) {
            // console.log("sequentialList detected", paragraf)
            this.addSequentialList()
        }
    }

    addFigure (rIds) {
        rIds.forEach(element => {
            let newF = new tags.figure()
            let id = `fig-${element.replace('rId', '')}`
            let newG = new tags.graphic()
            newG.addAttribute(` infoEntityIdent="${this.imagesList[element]}"`)
            this.mediaList.push(this.imagesList[element])
            this.addId(newF, id)

            newF.parent = this.currentElement
            newG.parent = newF
            // newT.parent = newF

            // newF.addContent(newT)
            newF.addContent(newG)
            this.currentElement.addContent(newF)
        })
    }

    addFigureTitle (paragraf, bookmarkIds) {
        let tag = null
        let lastImg = null
        for (tag of this.currentElement.content) {
            if (tag.name === "figure" && tag.content[0] && tag.content[0].name === "graphic") {

                let newT = new tags.title(paragraf)
                newT.setParent(tag)
                tag.content.unshift(newT)
                lastImg = tag
            }
        }

        if (lastImg && bookmarkIds) {
            let id = lastImg.id

            bookmarkIds.forEach(element => {
                this.refsDict[element] = {"id": id, "type": "irtt01"}
            })
        }
    }

    setBookmark (bookmarkIds) {
        if (bookmarkIds === null) { return }

        let node = this.currentElement
        if (node.name === "leveledPara") {
            this.addId(node, bookmarkIds[0])
        } else {
            // this.goToLastInsertedPara()
            // node = node.content.at(-1).content.at(-1)
            this.addId(node, bookmarkIds[0])
        }
        // console.log(this.currentElement.name)
        // while (node.name !== "dmodule" && node.id === null) {
        //     node = node.parent
        // }

        if (node.id && bookmarkIds) {
            let id = node.id

            bookmarkIds.forEach(element => {
                this.refsDict[element] = {"id": id, "type": "irtt07"}
            })
        }
    }

    actualizeSeqStack (paragraf, seqId) {
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
            if(seqId === "3e") {
                this.addLeveledPara()
            }
            this.levelStack.push(seqId)
            return true
        }

        if (seqId === this.levelStack.at(-1)) {
            if(seqId === "3e") {
                this.goUp()
                this.addLeveledPara()
            }
            return true
        }

        if (this.levelStack.indexOf(seqId) !== -1 && this.levelStack.at(-1) !== seqId) {
            while(this.levelStack.at(-1) !== seqId) {
                if (this.levelStack.at(-1) === null) {
                } else if (this.levelStack.at(-2) === "a1") {
                } else if (this.levelStack.at(-2) === "4a") {
                    this.goUp()
                } else if (this.levelStack.at(-1) === "4a") {
                } else if (this.levelStack.at(-2) === "affffa") {
                } else if (this.levelStack.at(-1) === "preserve" && this.currentElement.name === "listItem") {
                } else if (this.levelStack.at(-2) === "preserve") {
                } else {
                    this.goUp()
                    this.goUp()
                    this.goUp()
                }
                this.levelStack.pop()
            }
            if(seqId === "3e") {
                this.addLeveledPara()
            }
            
            return false
        } else if (this.levelStack.indexOf(seqId) === -1) {
            this.levelStack.push(seqId)
            if (seqId === "preserve" && this.seqVariants.indexOf(this.currentElement.name) !== -1) {
                this.goDown()
                this.goDown()
                this.goUp()
                this.goUp()
            } else if(seqId === "3e" && this.currentElement.name === "dmodule") {
                this.addLeveledPara()
            } else {
                this.goDown()
                this.goDown()
            }
            return true
        }

        return true
    }

    chooseTextParagraf (paragraf, seqId = null, bookmarkIds = null) {
        // console.log(seqId)
        // if (paragraf.startsWith('Примечание – ')) {console.log(paragraf, paragraf.startsWith('Примечание - '))}

        // this.isCurrentElementInSeq = this.actualizeSeqSteck(paragraf, seqId)
        if (this.seqVariants.indexOf(this.currentElement.name) !== -1) {
            // console.log()
            // this.addListItem(paragraf + " [" + String(this.levelStack) + " | " + String(this.currentElement.name) + "]")
            this.addListItem()
            // this.goDown()
            this.currentElement = this.currentElement.content.at(-1)
            this.chooseTextParagraf(paragraf, seqId)
            this.goUp()

        // } else if (!this.isCurrentElementInSeq) {
        //     // this.goToLastParent()
        //     // this.goToLastParent()
        //     // this.goToLastParent()
        //     // this.addPara(paragraf)
        //     this.isCurrentElementInSeq = true
        //     this.chooseTextParagraf(paragraf, seqId)
        } else if (this.currentElement.name === "caution" && paragraf === paragraf.toUpperCase()) {
            this.addCautionPara(paragraf)
        } else if (this.currentElement.name === "caution" && paragraf !== paragraf.toUpperCase()) {
            this.goUp()
            this.chooseTextParagraf(paragraf, seqId)
        } else if (paragraf.startsWith("Рисунок")) {
            // console.log(paragraf)
            // console.log(this.currentElement.content.at(-1).name)
            // console.log(this.currentElement.name)
            // if (this.currentElement.name !== "figure") { this.goDown() }
            this.addFigureTitle(paragraf, bookmarkIds)
            // this.goUp()
            // this.goUp()

        } else if (paragraf.startsWith("ВНИМАНИЕ: ")) {
            // console.log("ВНИМАНИЕ", paragraf)
            this.addCaution()
            this.chooseTextParagraf(paragraf.replace("ВНИМАНИЕ: ", ''), seqId)
        } 
        else if (paragraf.startsWith("Примечание – ")) {
            // this.chooseTextParagraf(paragraf.replace("Примечание – ", ''), seqId)
            this.addNote(paragraf.replace("Примечание – ", ''))
        } else if (paragraf.startsWith("Примечание - ")) {
            // this.chooseTextParagraf(paragraf.replace("Примечание - ", ''), seqId)
            this.addNote(paragraf.replace("Примечание - ", ''))
        }
        else {
            // this.addPara(paragraf + " [" + String(this.levelStack) + " | " + String(this.currentElement.name) + "]")
            this.addPara(paragraf)
        }

        // this.chooseListVariant(paragraf)

        this.setBookmark(bookmarkIds)
    }

    chooseTag (paragraf, seqId, imageIds, bookmarkIds) {
        if (paragraf) {
            this.isCurrentElementInSeq = this.actualizeSeqStack(paragraf, seqId)
            // console.log(paragraf)
            this.chooseTextParagraf(paragraf, seqId, bookmarkIds)
                this.chooseListVariant(paragraf)
        } else if (imageIds) {
            // console.log(imageIds)
            this.addFigure(imageIds)
        }
    }

}