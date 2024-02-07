import * as tags from "./xmlTags.js"

export class xmlCreator {
    currentElement = null
    resultDocument = null
    levelStack = []

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
        console.log(this.currentElement.name)
        if (this.currentElement.content.at(-1) && this.currentElement.content.at(-1).name !== "listItem") {
            this.currentElement = this.currentElement.content.at(-1)
        } else if (this.currentElement.content.at(-1) && this.currentElement.content.at(-1).content.at(-1)) {
            this.currentElement = this.currentElement.content.at(-1).content.at(-1)
        }
        console.log(this.currentElement.name)
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

    inSequence (seqId) {
        // Будем считать, что мы не поднимаемся в иерархии выше первого уровня 
        //  в стеке, а если поднимимся, то это будет уже конец модуля данных 
        //  и, следовательно, переход к следующему
        console.log("this.levelStack", this.levelStack, this.levelStack.length, typeof(seqId))
        if (seqId !== null && this.levelStack.length === 0) {
            this.levelStack.push(seqId)
            return true
        }
        if (seqId === null) {
            // console.log("HERE")
            return true
        } else if (this.levelStack.lenght === 0) {
            console.log("HERE")
            this.levelStack.push(seqId)
            return true
        } else if (this.levelStack.indexOf(seqId) !== -1 && this.levelStack.at(-1) !== seqId) {
            console.log("HERE")
            while(this.levelStack.at(-1) !== seqId) {
                this.levelStack.pop()
            }
            return false
        // } else if (this.levelStack.lenght === 1 && this.levelStack.at(0) !== seqId) {
        //     levelStack.pop()
        //     return false
        }
        return true
    }

    chooseTextParagraf (paragraf, seqId = null) {
        console.log(seqId)
        // console.log(paragraf, paragraf.startsWith('ВНИМАНИЕ'))
        const seqVariants = ["sequentialList", "randomList"]
        if (seqVariants.indexOf(this.currentElement.name) !== -1 && this.inSequence(seqId)) {
            // console.log()
            this.addListItem(paragraf)
        } else if (seqVariants.indexOf(this.currentElement.name) !== -1 && !this.inSequence(seqId)) {
            this.goUp()
            this.addPara(paragraf)
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

        if (paragraf.endsWith(':') && this.currentElement.name === "sequentialList") {
            // console.log("randomList detected")
            this.addRandomList()
        } else if (paragraf.endsWith(':')) {
            // console.log("sequentialList detected")
            this.addSequentialList()
        }
    }

}