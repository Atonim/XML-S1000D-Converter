export const docxContentsParser = {
    
    getContents() {
        let buffer = ""

        while (buffer.toLowerCase() !== "содержание" && this.currentNode.nextSibling) {
            this.currentNode = this.currentNode.nextSibling
            buffer = this.getPara()
        }

        let previousNode = this.currentNode
        let contents = []
        while (!this.isEnter()) {
            this.currentNode = this.currentNode.nextSibling

            buffer = this.getPara().toLowerCase()
            if (buffer.indexOf("назначение") !== -1) {
                contents.push({ "infoCode": "020", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("технические характеристики") !== -1) {
                contents.push({ "infoCode": "030", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("состав изделия") !== -1) {
                contents.push({ "infoCode": "034", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("устройство и работа") !== -1) {
                contents.push({ "infoCode": "041", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("описание и работа составных частей") !== -1) {
                contents.push({ "infoCode": "044", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("осмотры, тесты и проверки") !== -1) {
                contents.push({ "infoCode": "300", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("визуальные проверки") !== -1) {
                contents.push({ "infoCode": "310", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("указания по включению") !== -1) {
                contents.push({ "infoCode": "122", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("установка и настройка программного обеспечения") !== -1) {
                contents.push({ "infoCode": "123", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("перечень возможных неисправностей") !== -1) {
                contents.push({ "infoCode": "410", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("процедура поиска неисправностей") !== -1) {
                contents.push({ "infoCode": "421", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("демонтаж") !== -1) {
                contents.push({ "infoCode": "520", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("монтаж") !== -1) {
                contents.push({ "infoCode": "720", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("иллюстрированный каталог деталей") !== -1) {
                contents.push({ "infoCode": "941", "startId": this.getLinkId(this.currentNode.firstChild) })
            } else if (buffer.indexOf("регламент то") !== -1) {
                contents.push({ "infoCode": "000", "startId": this.getLinkId(this.currentNode.firstChild) })
            }

            buffer = this.getPara(previousNode).toLowerCase()
            if (buffer.indexOf("назначение") !== -1) {
                contents.find(element => element.infoCode === "020").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("технические характеристики") !== -1) {
                contents.find(element => element.infoCode === "030").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("состав изделия") !== -1) {
                contents.find(element => element.infoCode === "034").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("устройство и работа") !== -1) {
                contents.find(element => element.infoCode === "041").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("описание и работа составных частей изделия") !== -1) {
                contents.find(element => element.infoCode === "044").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("осмотры, тесты и проверки") !== -1) {
                contents.find(element => element.infoCode === "300").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("визуальные проверки") !== -1) {
                contents.find(element => element.infoCode === "310").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("указания по включению") !== -1) {
                contents.find(element => element.infoCode === "122").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("установка и настройка программного обеспечения") !== -1) {
                contents.find(element => element.infoCode === "123").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("перечень возможных неисправностей") !== -1) {
                contents.find(element => element.infoCode === "410").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("процедура поиска неисправностей") !== -1) {
                contents.find(element => element.infoCode === "421").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("демонтаж") !== -1) {
                contents.find(element => element.infoCode === "520").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("монтаж") !== -1) {
                contents.find(element => element.infoCode === "720").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("иллюстрированный каталог деталей") !== -1) {
                contents.find(element => element.infoCode === "941").stopId = this.getLinkId(this.currentNode.firstChild)
            } else if (buffer.indexOf("регламент то") !== -1) {
                contents.find(element => element.infoCode === "000").stopId = this.getLinkId(this.currentNode.firstChild)
            }

            previousNode = this.currentNode
        }

        return contents
    }

}