export const docxTableParser = {

    getTable() {
        let result = { id: 2 }

        if (this.currentNode.tagName != 'w:tbl')
            return null

        let currentTableNode = this.currentNode.firstChild

        while (currentTableNode.tagName !== 'w:tblGrid') {
            currentTableNode = currentTableNode.nextSibling
        }

        result.columns = currentTableNode.childNodes.length
        result.globalrows = []

        while (currentTableNode) {

            if (currentTableNode.tagName === 'w:tr') {
                const currentRow = { columns: [], attributes: [] }
                result.globalrows.push(currentRow)

                let currentRowTableNode = currentTableNode.firstChild

                while (currentRowTableNode) {
                    if (currentRowTableNode.tagName === 'w:trPr') {

                        //for (let i = 0; i < currentRowTableNode.childNodes.length; i++) {
                        //    const propertyNode = currentRowTableNode.childNodes[i]
                        //    if (propertyNode.tagName === 'w:jc' && propertyNode.attributes[0] === 'w:val') {
                        //        //console.log(propertyNode.attributes[0].value)
                        //        currentRow.attributes.push({ 'align': propertyNode.attributes[0].value })
                        //    }
                        //}


                    }
                    if (currentRowTableNode.tagName === 'w:tc') {
                        const currentColumn = { paragraphs: [], attributes: {} }
                        currentRow.columns.push(currentColumn)

                        let currentColumnTableNode = currentRowTableNode.firstChild

                        while (currentColumnTableNode) {
                            if (currentColumnTableNode.tagName === 'w:tcPr') {
                                for (let i = 0; i < currentColumnTableNode.childNodes.length; i++) {
                                    const propertyNode = currentColumnTableNode.childNodes[i]
                                    if (propertyNode.tagName === 'w:gridSpan' && propertyNode.attributes[0].name === 'w:val') {
                                        //console.log(propertyNode.attributes[0].value)
                                        currentColumn.attributes.colSpannig = propertyNode.attributes[0].value
                                    }
                                    if (propertyNode.tagName === 'w:vMerge') {
                                        if (propertyNode.attributes.length) {
                                            if (propertyNode.attributes[0].name === 'w:val') {
                                                currentColumn.attributes.colMerging = propertyNode.attributes[0].value
                                            }
                                            else {
                                                console.log('Неизвестный атрибут в w:vMerge - ', propertyNode.attributes[0].name)
                                            }
                                        }
                                        else {
                                            currentColumn.attributes.colMerging = 'continue'
                                        }
                                        //console.log(propertyNode.attributes[0].value)

                                    }
                                }
                            }
                            if (currentColumnTableNode.tagName === 'w:p') {
                                const currentParagraph = { text: this.getPara(currentColumnTableNode) }
                                currentColumn.paragraphs.push(currentParagraph)

                            }
                            currentColumnTableNode = currentColumnTableNode.nextSibling
                        }
                    }
                    currentRowTableNode = currentRowTableNode.nextSibling
                }
            }
            currentTableNode = currentTableNode.nextSibling

        }
        //console.log(this.currentNode.tagName)
        return result
    }


    //код ниже не язаем
    //table(node, tag){
    //    while(node){
    //        if (node.tagName === tag){
    //            const currentRow = { columns: [] }
    //            result.globalrows.push(currentRow)
    //        }
    //    }
    //    return result
    //}

}