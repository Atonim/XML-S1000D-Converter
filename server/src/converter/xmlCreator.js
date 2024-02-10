import * as tags from "./xmlTags.js"

export class xmlCreator {
    currentElement = null
    resultDocument = null
    levelStack = []
    isCurrentElementInSeq = true
    seqVariants = ["sequentialList", "randomList"]
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
            // if(this.isCurrentElementInSeq) {
                this.goToLastInsertedPara()
            // } else {
                // this.goToLastParent()
            // }

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
            // if(this.isCurrentElementInSeq) {
                this.goToLastInsertedPara()
            // } else {
                // console.log("goUp!!!")
                // this.goToLastParent()
            // }

            // this.inserted = true
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

    actualizeSeqStack (paragraf, seqId) {
        // Будем считать, что мы не поднимаемся в иерархии выше первого уровня 
        //  в стеке, а если поднимимся, то это будет уже конец модуля данных 
        //  и, следовательно, переход к следующему
        // let newT = new tags.text("\n[" + String(this.levelStack) + " | " + String(this.currentElement.name) + "]")
        // this.currentElement.content.push(newT)
        
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

    chooseTextParagraf (paragraf, seqId = null) {
        // console.log(seqId)
        // if (paragraf.startsWith('Примечание – ')) {console.log(paragraf, paragraf.startsWith('Примечание - '))}

        // this.isCurrentElementInSeq = this.actualizeSeqSteck(paragraf, seqId)
        if (this.seqVariants.indexOf(this.currentElement.name) !== -1) {
            // console.log()
            // this.addListItem(paragraf + " [" + String(this.levelStack) + " | " + String(this.currentElement.name) + "]")
            this.addListItem(paragraf)
            // this.goDown()
            // this.chooseTextParagraf(paragraf, seqId)
            // this.goUp()

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

        this.chooseListVariant(paragraf)

    }

    chooseTag (paragraf, seqId) {
        if (paragraf) {
            this.isCurrentElementInSeq = this.actualizeSeqStack(paragraf, seqId)
            // console.log(paragraf)
            this.chooseTextParagraf(paragraf, seqId)
        }
    }

}