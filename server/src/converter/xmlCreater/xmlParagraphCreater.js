import * as tags from "./xmlTags.js"

export const xmlParagraphCreater = {


    addPara(paragraf) {

        if (this.currentElement) {
            let newP = new tags.para()
            let newT = new tags.text(paragraf)
            newP.setParent(this.currentElement)
            newT.setParent(newP)

            newP.addContent(newT)
            this.currentElement.addContent(newP)
        }
    },

    addListItem() {

        if (this.currentElement) {
            let newI = new tags.listItem()
            
            newI.setParent(this.currentElement)

            this.currentElement.addContent(newI)
        }
    },

    addSequentialList() {
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
    },

    addRandomList() {
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
    },

    addLeveledPara(title = "default title") {
        let newLP = new tags.levelledPara()
        let newTi = new tags.title(title)

        newTi.parent = newLP
        newLP.parent = this.currentElement

        newLP.content.push(new tags.title(title))
        this.currentElement.content.push(newLP)
        this.currentElement = newLP

    },

    addCaution() {
        if (this.currentElement) {
            let newC = new tags.caution()

            newC.parent = this.currentElement
            this.currentElement.content.push(newC)
            this.currentElement = newC
        }
    },

    addCautionPara(paragraf) {
        if (this.currentElement) {
            let newCP = new tags.warningAndCautionPara()
            let newT = new tags.text(paragraf)

            newCP.parent = this.currentElement
            newT.parent = newCP
            newCP.content.push(newT)
            this.currentElement.content.push(newCP)
        }
    },

    addNote(paragraf) {
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
    },

    checkNote(paragraf) {

        if (paragraf.startsWith("Примечание – ")) {
            this.addNote(paragraf.replace("Примечание – ", ''))
        } else if (paragraf.startsWith("Примечание - ")) {
            this.addNote(paragraf.replace("Примечание - ", ''))
        }
    },

    chooseListVariant(paragraf) {

        if (paragraf.endsWith(':') && this.currentElement.name === "randomList" && this.currentElement.content[0]) {
            this.addSequentialList()
        } else if (paragraf.endsWith(':') && this.currentElement.content[0]) {
            this.addRandomList()
        }
    },

    addFigure (rIds) {

        if (this.currentElement.name === "dmodule") {
            this.addLeveledPara()
        } else if (this.seqVariants.indexOf(this.currentElement.name) !== -1) {
            this.addListItem()
            this.currentElement = this.currentElement.content.at(-1)
        }
        rIds.forEach(element => {
            let newF = new tags.figure()
            let id = `fig-${element.replace('rId', '')}`
            let newG = new tags.graphic()
            newG.addAttribute(` infoEntityIdent="${this.imagesList[element]}"`)
            this.mediaList.push(this.imagesList[element])
            this.addId(newF, id)

            newF.parent = this.currentElement
            newG.parent = newF
            
            newF.addContent(newG)
            this.currentElement.addContent(newF)
        })
        if (this.seqVariants.indexOf(this.currentElement.parent.name) !== -1) {
            this.currentElement = this.currentElement.content.at(-1)
        }
    },

    addFigureTitle(paragraf, bookmarkIds) {

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
                this.refsDict[element] = { "id": id, "type": "irtt01" }
            })
        }
    },

    getParaTitle (paragraph) {
        
        if (paragraph.indexOf(" предназначен") !== -1) { 
            paragraph = paragraph.substring(0, paragraph.indexOf(" предназначен")) 
        }

        let point = paragraph.indexOf('.')
        let coma = paragraph.indexOf(',')
        let exclamationMark = paragraph.indexOf('!')
        let questionMark = paragraph.indexOf('?')
        let colon = paragraph.indexOf(':')
        let semicolon = paragraph.indexOf(';')
        let dash = paragraph.indexOf(' -')
        if (point !== -1) { paragraph = paragraph.substring(0, point) }
        if (coma !== -1) { paragraph = paragraph.substring(0, coma) }
        if (exclamationMark !== -1) { paragraph = paragraph.substring(0, exclamationMark) }
        if (questionMark !== -1) { paragraph = paragraph.substring(0, questionMark) }
        if (colon !== -1) { paragraph = paragraph.substring(0, colon) }
        if (semicolon !== -1) { paragraph = paragraph.substring(0, semicolon) }
        if (dash !== -1) { paragraph = paragraph.substring(0, dash) }

        if (paragraph.indexOf('<') !== -1) 
            paragraph = paragraph.substring(0, paragraph.indexOf('<'))
        // if (paragraph.startsWith("Рисунок 1")) console.log(paragraph)
        return paragraph
    }

}