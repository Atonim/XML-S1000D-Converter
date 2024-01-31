import * as tags from "./xmlTegs.js"

export class xmlCreator {
    currentElement = null
    resultDocument = null

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

}