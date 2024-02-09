import * as tags from "./xmlTags.js"

export class xmlCreator {
    currentElement = null
    resultDocument = null
    levelStack = []
    isCurrentElementInSeq = true
    // inserted = false

    constructor (infoCode, techName) {
        this.currentElement = new tags.dmodule(infoCode, techName)
        // let newElement = new tags.caution()
        // newElement.parent = this.currentElement
        // this.currentElement.addContent(newElement)
        // this.currentElement = newElement
    }

    goUp () {
        if (this.currentElement && this.currentElement.parent) {
            this.currentElement = this.currentElement.parent
        }
    }

    goDown () {
        if (this.currentElement && this.currentElement.content.lenght) {
            this.currentElement = this.currentElement.content[0]
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

    getDocument () {
        while (this.currentElement.parent) {
            this.currentElement = this.currentElement.parent
        }
        return this.currentElement
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

    addListItem (paragraf) {
        if (this.currentElement) {
            let newI = new tags.listItem()
            let newP = new tags.para()
            let newT = new tags.text(paragraf)
            newI.setParent(this.currentElement)
            newP.setParent(newI)
            newT.setParent(newP)
            
            newP.addContent(newT)
            newI.addContent(newP)
            this.currentElement.addContent(newI)
        }
    }

    addSequentialList () {
        // Если встречено ":" на конце абзаца, далее будет идти перечисление
        //  Находим подходящее место и
        //  включаем в структуру документа sequentialList
        if (this.currentElement) {
            let newL = new tags.sequentialList()
            if(this.isCurrentElementInSeq) {
                this.goToLastInsertedPara()
            } else {
                this.goToLastParent()
            }

            // this.inserted = true
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
            // console.log
            if(this.isCurrentElementInSeq) {
                this.goToLastInsertedPara()
            } else {
                // console.log("goUp!!!")
                this.goToLastParent()
            }

            // this.inserted = true
            newL.parent = this.currentElement
            this.currentElement.content.push(newL)
            this.currentElement = newL
        }
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

    actualizeSeqSteck (seqId) {
        // Будем считать, что мы не поднимаемся в иерархии выше первого уровня 
        //  в стеке, а если поднимимся, то это будет уже конец модуля данных 
        //  и, следовательно, переход к следующему
        let newT = new tags.text(String(this.levelStack))
        this.currentElement.content.push(newT)
        
        // if (seqId === null) {
        //     return true
        // }
        // if (seqId && this.levelStack.length === 0) {
        if (this.levelStack.length === 0) {
            this.levelStack.push(seqId)
            return true
        }
        if (seqId === this.levelStack.at(-1)) {
            return true
        }
        if (seqId && this.levelStack.indexOf(seqId) !== -1 && this.levelStack.at(-1) !== seqId) {
            while(this.levelStack.at(-1) !== seqId) {
                if (this.levelStack.at(-2) === "a1") {

                } else if (this.levelStack.at(-2) === "4a") {
                    // this.goUp()
                } else {
                    this.goUp()
                    this.goUp()
                    this.goUp()
                    // this.goToLastParent()
                    // this.goToLastParent()
                    // this.goToLastParent()
                }
                this.levelStack.pop()
            }
            return false
        // } else if (seqId && this.levelStack.indexOf(seqId) === -1) {
        } else if (this.levelStack.indexOf(seqId) === -1) {
            this.levelStack.push(seqId)
            this.goDown()
            this.goDown()
            // this.goToLastInsertedPara()
            // this.goDown()
            return true
        }
        return true
    }

    chooseTextParagraf (paragraf, seqId = null) {
        // console.log(seqId)
        // console.log(paragraf, paragraf.startsWith('ВНИМАНИЕ'))
        this.isCurrentElementInSeq = this.actualizeSeqSteck(seqId)
        const seqVariants = ["sequentialList", "randomList"]
        if (this.isCurrentElementInSeq && seqVariants.indexOf(this.currentElement.name) !== -1) {
            // console.log()
            this.addListItem(paragraf)
        } else if (!this.isCurrentElementInSeq) {
            // this.goToLastParent()
            // this.goToLastParent()
            // this.goToLastParent()
            // this.addPara(paragraf)
            this.chooseTextParagraf(paragraf, seqId)
        } else if (this.currentElement.name === "caution" && paragraf === paragraf.toUpperCase()) {
            this.addCautionPara(paragraf)
        } else if (this.currentElement.name === "caution" && paragraf !== paragraf.toUpperCase()) {
            this.goUp()
            this.chooseTextParagraf(paragraf, seqId)
        } else if (paragraf.startsWith("ВНИМАНИЕ: ")) {
            // console.log("ВНИМАНИЕ", paragraf)
            this.addCaution()
            this.chooseTextParagraf(paragraf.replace("ВНИМАНИЕ: ", ''), seqId)
        } else if (paragraf.startsWith("Примечание - ")) {
            this.addNote()
            this.chooseTextParagraf(paragraf.replace("Примечание - ", ''), seqId)
        }
        else {
            this.addPara(paragraf)
        }

            if (paragraf.endsWith(':') && this.currentElement.name === "sequentialList" && this.currentElement.content[0]) {
                // console.log("randomList detected", )
                this.addRandomList()
            } else if (paragraf.endsWith(':') && this.currentElement.content[0]) {
                // console.log("sequentialList detected", paragraf)
                this.addSequentialList()
            }
        // this.inserted = false
    }

}