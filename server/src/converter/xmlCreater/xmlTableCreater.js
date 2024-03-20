import * as tags from "./xmlTags.js"

export const xmlTableCreater = {

    setTableBookmark (bookmarkId, tableId) {
        if (bookmarkId && tableId) {
            this.refsDict[bookmarkId] = { "id": `tab-${tableId}`, "type": "irtt02" }
        }
    },

    isTableNew(element = this.currentElement) {

        if (element.content.at(-1).name === 'para' && element.content.at(-1).content[0].openTag.startsWith('Продолжение таблицы')) {
            element.content.pop()
            //console.log(element.content.at(-1).content[1].content.find(el => el.name === 'tbody'))
            return element.content.at(-1).content[1].content.find(el => el.name === 'tbody')
        }
        return null
    },

    setTable(element = this.currentElement) {
        let id = 0
        let titleText = ''
        if (element.content.at(-1).name === 'para') {

            let paraString = element.content.at(-1).content[0].openTag
            paraString = paraString.replaceAll('\u00A0', '')
            if (paraString.startsWith('Таблица')) {
                const titleArr = paraString.split(' ')
                //console.log(titleArr)

                let idInString = titleArr[0].slice(7)
                //console.log(idInString)
                if (idInString.length && !isNaN(idInString.trim())) {
                    id = idInString
                }

                for (let i = 1; i < titleArr.length; i++) {
                    if (id) {
                        if (titleArr[i] === '–' || titleArr[i] === '-')
                            continue
                        titleText.length ? titleText = titleText + ' ' + titleArr[i] : titleText = titleText + titleArr[i]
                    } else if (!isNaN(titleArr[i]) && titleArr[i].length) {
                        id = titleArr[i]
                    } else {
                        console.log('Не найден номер таблицы')
                    }
                }
                if (!titleText.length) console.log('Не найдено название таблицы', id)
            }
            element.content.pop()
        }
        this.setTableBookmark(element.id, id)
        return { id, titleText }
    },

    addTable(tableInfo) {
        let newTbody = this.isTableNew()
        //console.log(newTbody)
        let newThead = null
        let needHead = false
        if (!newTbody) {
            needHead = true
        }
        if (!newTbody) {

            for (let i = 0; i < tableInfo.columns; i++) {
                this.tableMergeState.push({
                    entryNode: null,
                    cellsMerged: null
                })
            }

            const { id, titleText } = this.setTable()
            let newT = new tags.table()
            // newT.addAttribute(`id="tab-${id}"`)
            this.addId(newT, `tab-${id}`)
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

        //console.log(tableInfo.columns)

        // console.log(this.tableMergeState)
        for (let i = 0; i < tableInfo.globalrows.length; i++) {

            let newRow = new tags.row()
            if (i === 0 && needHead) {
                //console.log('head')
                newRow.parent = newThead
                newThead.addContent(newRow)

            } else {
                newRow.parent = newTbody
                newTbody.addContent(newRow)
            }


            let cellStId = 0
            let cellEndId = 0
            let cellNewEndId = 0;


            for (let j = 0; j < tableInfo.globalrows[i].columns.length; j++) {
                let newEntry = new tags.entry()
                newEntry.parent = newRow

                if (newRow.parent.name === 'thead') {
                    newEntry.addAttribute(`valign="top"`)
                }

                const attributesKeys = Object.keys(tableInfo.globalrows[i].columns[j].attributes);


                let isMerged = false

                for (let key of attributesKeys) {
                    if (key === 'colSpannig') {
                        cellStId = cellEndId + 1;
                        cellNewEndId = cellEndId + Number(tableInfo.globalrows[i].columns[j].attributes[key])
                        newEntry.addAttribute(`namest="${cellStId}"`)
                        newEntry.addAttribute(`nameend="${cellNewEndId}"`)

                    }
                    if (key === 'colMerging') {
                        const mergeType = tableInfo.globalrows[i].columns[j].attributes[key]
                        if (mergeType === 'restart') {
                            // console.log(i, j)
                            // console.log(tableInfo.globalrows[i].columns[j])

                        } else if (mergeType === 'continue') {
                            // console.log(tableInfo.globalrows[i].columns[j])

                            isMerged = true
                        }
                    }
                }

                if (isMerged) {
                    this.tableMergeState[j].cellsMerged++
                    // console.log('merged', this.tableMergeState[j].cellsMerged)
                    continue
                }
                else {
                    if (this.tableMergeState[j].entryNode) {
                        // console.log('merged', this.tableMergeState[j].cellsMerged)
                        this.tableMergeState[j].entryNode.addAttribute(`morerows="${this.tableMergeState[j].cellsMerged}"`)
                    }
                    //console.log(this.tableMergeState)
                    this.tableMergeState[j].entryNode = newEntry
                    this.tableMergeState[j].cellsMerged = 0
                    newRow.addContent(newEntry)
                }


                for (let k = 0; k < tableInfo.globalrows[i].columns[j].paragraphs.length; k++) {
                    let newPara = new tags.para()
                    newPara.parent = newEntry
                    newEntry.addContent(newPara)

                    // let newText = new tags.text(this.cyrillicToTranslit.transform(tableInfo.globalrows[i].columns[j].paragraphs[k].text))
                    let newText = new tags.text(tableInfo.globalrows[i].columns[j].paragraphs[k].text)
                    newText.setParent(newPara)
                    newPara.addContent(newText)
                }

                cellEndId === cellNewEndId ? cellEndId++ : cellEndId = cellNewEndId
            }
        }
    }

}