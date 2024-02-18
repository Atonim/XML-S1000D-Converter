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

    constructor(infoCode, techName, imagesList) {
        this.currentElement = new tags.dmodule(infoCode, techName)
        this.imagesList = imagesList
        // console.log(imagesList)
        // let newElement = new tags.caution()
        // newElement.parent = this.currentElement
        // this.currentElement.addContent(newElement)
        // this.currentElement = newElement
    }


    preproccessing(xmlCode) {
        let start = xmlCode.indexOf("//**")
        let stop = xmlCode.indexOf("**//")
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
            stop = xmlCode.indexOf("**//")

        }
        return xmlCode
    }

    getDocument() {
        while (this.currentElement.parent) {
            this.currentElement = this.currentElement.parent
        }
        this.currentElement.media = this.mediaList
        let proccessedDoc = this.currentElement.stringify()
        proccessedDoc = this.preproccessing(proccessedDoc)
        return proccessedDoc
    }

    goUp() {

        if (this.currentElement && this.currentElement.parent) {
            this.currentElement = this.currentElement.parent
        }
    }


    goDown() {
        if (this.currentElement && this.currentElement.content.lengh) {

            this.currentElement = this.currentElement.content.at(-1)
        }
    }

    goToLastInsertedPara() {
        // console.log(this.currentElement.name)
        if (this.currentElement.content.at(-1) && this.currentElement.content.at(-1).name !== "listItem") {
            this.currentElement = this.currentElement.content.at(-1)
        } else if (this.currentElement.content.at(-1) && this.currentElement.content.at(-1).content.at(-1)) {
            this.currentElement = this.currentElement.content.at(-1).content.at(-1)
        }
        // console.log(this.currentElement.name)
    }

    goToLastParent() {
        if (this.currentElement.name === "dmodule") {

        } else {
            this.currentElement = this.currentElement.parent
        }
    }


    addPara(paragraf) {

        if (this.currentElement) {
            let newP = new tags.para()
            let newT = new tags.text(paragraf)
            newP.setParent(this.currentElement)
            newT.setParent(newP)

            newP.addContent(newT)
            this.currentElement.addContent(newP)
        }
    }


    addListItem(paragraf = "") {

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
    }

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
    }

    addLeveledPara(title = "default title") {
        let newLP = new tags.levelledPara()
        let newTi = new tags.title(title)

        newTi.parent = newLP
        newLP.parent = this.currentElement

        newLP.content.push(new tags.title(title))
        this.currentElement.content.push(newLP)
        this.currentElement = newLP

    }

    addCaution() {
        if (this.currentElement) {
            let newC = new tags.caution()

            newC.parent = this.currentElement
            this.currentElement.content.push(newC)
            this.currentElement = newC
        }
    }

    addCautionPara(paragraf) {
        if (this.currentElement) {
            let newCP = new tags.warningAndCautionPara()
            let newT = new tags.text(paragraf)

            newCP.parent = this.currentElement
            newT.parent = newCP
            newCP.content.push(newT)
            this.currentElement.content.push(newCP)
        }
    }

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
    }

    addId (node, id) {
        node.id = id
        node.addAttribute(` id="${id}"`)
    }

    checkNote(paragraf) {

        if (paragraf.startsWith("Примечание – ")) {
            // this.chooseTextParagraf(paragraf.replace("Примечание – ", ''), seqId)
            this.addNote(paragraf.replace("Примечание – ", ''))
        } else if (paragraf.startsWith("Примечание - ")) {
            // this.chooseTextParagraf(paragraf.replace("Примечание - ", ''), seqId)
            this.addNote(paragraf.replace("Примечание - ", ''))
        }
    }

    chooseListVariant(paragraf) {
        if (paragraf.endsWith(':') && this.currentElement.name === "randomList" && this.currentElement.content[0]) {
            // console.log("randomList detected", )
            this.addSequentialList()
        } else if (paragraf.endsWith(':') && this.currentElement.content[0]) {
            // console.log("sequentialList detected", paragraf)
            this.addRandomList()
        }
    }


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
            // newT.parent = newF

            // newF.addContent(newT)
            newF.addContent(newG)
            this.currentElement.addContent(newF)
        })
        if (this.seqVariants.indexOf(this.currentElement.parent.name) !== -1) {
            this.currentElement = this.currentElement.content.at(-1)
        }
    }

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
    }

    setBookmark(bookmarkIds) {
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
                this.refsDict[element] = { "id": id, "type": "irtt07" }
            })
        }
    }

    isTableNew(element = this.currentElement) {
        if (element.content.at(-1).name === 'para' && element.content.at(-1).content[0].openTag.startsWith('Продолжение таблицы')) {
            element.content.pop()
            return element.content.at(-1).content[0].content[1]
        }
        return null
    }

    setTable(element = this.currentElement) {
        let id = 0
        let titleText = ''
        if (element.content.at(-1).name === 'para') {
            let paraString = element.content.at(-1).content[0].openTag
            paraString = paraString.replaceAll('\u00A0', '')
            if (paraString.startsWith('Таблица')) {
                const titleArr = paraString.split(' ')
                console.log(titleArr)

                let idInString = titleArr[0].slice(7)
                console.log(idInString)
                if (idInString.length && !isNaN(idInString.trim())) {
                    id = idInString
                }


                for (let i = 1; i < titleArr.length; i++) {
                    if (id) {
                        if (titleArr[i] === '–' || titleArr[i] === '-')
                            continue
                        titleText.length ? titleText = titleText + ' ' + titleArr[i] : titleText = titleText + titleArr[i]
                    }
                    else if (!isNaN(titleArr[i]) && titleArr[i].length) {
                        id = titleArr[i]
                    }
                    else {
                        console.log('Не найден номер таблицы')
                    }
                }
                if (!titleText.length) console.log('Не найдено название таблицы', id)
            }
            element.content.pop()
        }
        console.log(id, titleText)
        return { id, titleText }
    }

    addTable(tableInfo) {
        let newTbody = this.isTableNew()
        let newThead = null
        let needHead = false
        if (!newTbody) {
            needHead = true
        }
        if (!newTbody) {
            const { id, titleText } = this.setTable()
            let newT = new tags.table()
            newT.addAttribute(`id="tab-${id}"`)
            newT.parent = this.currentElement

            let newTtitle = new tags.title(titleText)
            newTtitle.parent = newT

            let newTgroup = new tags.tgroup()
            newTgroup.addAttribute(`cols="${tableInfo.columns}"`)
            newTgroup.parent = newT

            for (let i = 1; i < tableInfo.columns + 1; i++) {
                let newTcolspec = new tags.colspec()
                newTcolspec.addAttribute(`colname="${i}"`) //иногда пишут col<i>
                newTcolspec.addAttribute(`colwidth=""`) //как формируется ширина?
                newTcolspec.parent = newTgroup
                newTgroup.addContent(newTcolspec)
            }



            newThead = new tags.thead()
            newTbody = new tags.tbody()
            newThead.parent = newTgroup
            newTbody.parent = newTgroup

            newTgroup.addContent(newThead)
            newTgroup.addContent(newTbody)
            newT.addContent(newTtitle)
            newT.addContent(newTgroup)
            this.currentElement.addContent(newT)
        }
        else {
            tableInfo.globalrows.shift()
        }




        //console.log(tableInfo.globalrows)
        for (let i = 0; i < tableInfo.globalrows.length; i++) {

            let newRow = new tags.row()
            if (i === 0 && needHead) {
                console.log('head')
                newRow.parent = newThead
                newThead.addContent(newRow)

            } else {
                newRow.parent = newTbody
                newTbody.addContent(newRow)
            }


            for (let j = 0; j < tableInfo.globalrows[i].columns.length; j++) {
                let newEntry = new tags.entry()
                newEntry.parent = newRow

                if (newRow.parent.name === 'thead') {
                    newEntry.addAttribute(`valign="top"`)
                }
                newRow.addContent(newEntry)

                for (let k = 0; k < tableInfo.globalrows[i].columns[j].paragraphs.length; k++) {
                    let newPara = new tags.para()
                    newPara.parent = newEntry
                    newEntry.addContent(newPara)

                    let newText = new tags.text(tableInfo.globalrows[i].columns[j].paragraphs[k].text)
                    newText.setParent(newPara)
                    newPara.addContent(newText)
                }
            }
        }
    }

    actualizeSeqStack(paragraf, seqId) {
        // Будем считать, что мы не поднимаемся в иерархии выше первого уровня 
        //  в стеке, а если поднимимся, то это будет уже конец модуля данных 
        //  и, следовательно, переход к следующему
        // let newT = new tags.text("\n[" + String(this.levelStack) + " | " + String(this.currentElement.name) + "]")
        // this.currentElement.addContent(newT)
        // newT.setParent(this.currentElement)

        if (seqId === null) {
            return true
        }
        // if (this.currentElement.name === "dmodule") {
        //     this.addLeveledPara()
        // }

        if (this.levelStack.length === 0) {
            // if (seqId === this.levelStack[0]) {
                this.addLeveledPara()
            // }
            this.levelStack.push(seqId)
            return true
        }

        if (seqId === this.levelStack.at(-1)) {
            // if (seqId === this.levelStack[0]) {
            //     this.goUp()
            //     this.addLeveledPara()
            // }
            return true
        }

        if (this.levelStack.indexOf(seqId) !== -1 && this.levelStack.at(-1) !== seqId) {
            while (this.levelStack.at(-1) !== seqId) {
                if (this.levelStack.at(-1) === null) {
                } else if (this.levelStack.at(-2) === "a1") {
                // } else if (this.levelStack.at(-1) === "-1") {
                } else if (this.levelStack.at(-2) === "4a") {
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
                this.goDown()
                this.goDown()
                this.goUp()
                this.goUp()
            // } else if (seqId === "3e" && this.currentElement.name === "dmodule") {
            // } else if (this.currentElement.name === "dmodule") {
            //     this.addLeveledPara()
            } else {
                this.goDown()
                this.goDown()
            }
            return true
        }

        return true
    }


    chooseTextParagraf(paragraf, seqId = null, bookmarkIds = null) {

        if (this.currentElement.name === "levelledPara" && this.currentElement.content.length === 1) {
            this.currentElement.content[0] = new tags.title(this.getParaTitle(paragraf))
            // console.log(this.currentElement.content[0])
        }
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


    chooseTag(paragraf, seqId, imageIds, table, bookmarkIds) {
        if (table) {
            this.addTable(table)
        }
        else if (paragraf) {
            this.isCurrentElementInSeq = this.actualizeSeqStack(paragraf, seqId)

            // console.log(paragraf)
            this.chooseTextParagraf(paragraf, seqId, bookmarkIds)
            this.chooseListVariant(paragraf)
        } else if (imageIds) {
            // console.log(imageIds)
            this.addFigure(imageIds)
        }
    }

    getParaTitle (paragraph) {
        // console.log(paragraph)
        if (paragraph.indexOf(" предназначен") !== -1) { 
            paragraph = paragraph.substring(0, paragraph.indexOf(" предназначен")) 
        }
        // if (paragraph.indexOf(')') > paragraph.indexOf('(') && paragraph.indexOf('(')) {
        //     paragraph = paragraph.substring(paragraph.indexOf('(') + 1, paragraph.indexOf(')'))
        // }
        // if (paragraph.indexOf(']') > paragraph.indexOf('[') && paragraph.indexOf('[')) {
        //     paragraph = paragraph.substring(paragraph.indexOf('[') + 1, paragraph.indexOf(']'))
        // }
        // if (paragraph.indexOf('}') > paragraph.indexOf('{') && paragraph.indexOf('{')) {
        //     paragraph = paragraph.substring(paragraph.indexOf('{') + 1, paragraph.indexOf('}'))
        // }

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
        // console.log(paragraph)
        return paragraph
    }

}