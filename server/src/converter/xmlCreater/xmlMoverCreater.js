export const xmlMoverCreater = {
    goUp() {

        if (this.currentElement && this.currentElement.parent) {
            this.currentElement = this.currentElement.parent
        }
    },

    // goDown() {
    //     if (this.currentElement && this.currentElement.content.lengh) {

    //         this.currentElement = this.currentElement.content.at(-1)
    //     }
    // },

    goToLastInsertedPara() {
        if (this.currentElement.content.at(-1) && this.currentElement.content.at(-1).name !== "listItem") {
            this.currentElement = this.currentElement.content.at(-1)
        } else if (this.currentElement.content.at(-1) && this.currentElement.content.at(-1).content.at(-1)) {
            this.currentElement = this.currentElement.content.at(-1).content.at(-1)
        }
    },

    goToLastParent() {
        if (this.currentElement.name === "dmodule") {

        } else {
            this.currentElement = this.currentElement.parent
        }
    }

}
