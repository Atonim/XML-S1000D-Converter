// Possible problems:
//  - In *dmodule* class: media can be not only jpeg
//  - In *internalRef* class: how to show 1 tag in *stringify*                          (soluted)
//  - 58
//  - In *dmodule* class: in stringifing media, loop .forEach() will not work
// All classes override this methods:
//  :constructor (params?)          -> create object
//  :addContent (newElement)        -> add content *newElement* inside current tag
//  :addAttribute (attributeString) -> add attribute *attributeString* into open tag
//  :stringify ()                   -> stringify current tag and it's content
//  :setParent (element)            -> set link on parent tag *element*

class Tag {

    name = ""
    openTag = ""
    closeTag = ""
    attribute = ""
    content = []
    parent = null
    tags = 2
    id = null

    addContent(newElement) {

        this.content.push(newElement)
    }

    addAttribute(attributeString) {
        this.attribute += ` ${attributeString}`
    }

    stringify(level = 3) {
        let contentInside = ""
        for (let element of this.content) {
            contentInside += String(element.stringify(level + 1))
        }
        // console.log("stringify: ", this.name, this.content.length, contentInside)

        if (this.tags === 2) {
            return (
                `
${paddng(level)}<${this.openTag} ${this.attribute}>
${contentInside}
${paddng(level)}<${this.closeTag}>`)
        } else {
            return `<${this.openTag}${this.attribute} />\n`
        }
    }

    setParent(element) {
        this.parent = element
    }
}

export class dmodule extends Tag {
    constructor(infoCode = "018", techName = "default name") {
        super()
        let currentTime = new Date()
        let creationDay = currentTime.getDate()
        let creationMonth = currentTime.getMonth() + 1
        let creationYear = currentTime.getFullYear()
        let infoName = infoTable.find(element => element.infoCode === infoCode).infoName
        this.media = []
        this.name = "dmodule"
        this.openTag =
            `!--Arbortext, Inc., 1988-2017, v.4002-->
<?Pub Inc?>
<dmodule xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:ns2="http://www.purl.org/dc/elements/1.1/"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="http://www.s1000d.org/S1000D_4-1/xml_schema_flat/descript.xsd">
    <identAndStatusSection>
        <dmAddress>
            <dmIdent>
                <dmCode assyCode="01" disassyCode="00" disassyCodeVariant="A"
                    infoCode="${infoCode}" infoCodeVariant="A" itemLocationCode="A"
                    modelIdentCode="VBMA" subSubSystemCode="0" subSystemCode="2"
                    systemCode="46" systemDiffCode="A"/>
                <language countryIsoCode="RU" languageIsoCode="ru"/>
                <issueInfo inWork="01" issueNumber="000"/>
            </dmIdent>
            <dmAddressItems>
                <issueDate day="${creationDay}" month="${creationMonth}" year="${creationYear}"/>
                <dmTitle>
                    <techName>${techName}</techName>
                    <infoName>${infoName}</infoName>
                </dmTitle>
            </dmAddressItems>
        </dmAddress>
        <dmStatus>
            <security/>
            <responsiblePartnerCompany enterpriseCode="00000">
            </responsiblePartnerCompany>
            <originator enterpriseCode="00000"></originator>
        </dmStatus>
    </identAndStatusSection>
    <content>
        <description`
        this.closeTag =
            `/description>
    </content>
</dmodule`
    }

    addMedia(fileName) {
        this.media.push(fileName)
    }

    stringify() {
        let contentInside = ""
        for (let i = 0; i < this.content.length; i++) {
            contentInside += String(this.content[i].stringify())
        }

        let stringifiedMedia = ""
        if (this.media.length) {
            let mediaInside = ""
            for (let mediaEl of this.media) {
                mediaInside +=
                    `\n<!ENTITY ${mediaEl} SYSTEM "../Images/${mediaEl}.jpg" NDATA jpg>`
            }
            //         this.media.forEach(element => mediaInside + `
            // <!ENTITY ${element.filename} SYSTEM "../Images/${element.filename}.${element.fileformat}" NDATA ${element.fileformat}>`
            //         )
            stringifiedMedia = `
<!DOCTYPE dmodule [
<!NOTATION jpg PUBLIC "jpg" "jpg">${mediaInside}
]>`
        }

        return `<?xml version="1.0" encoding="UTF-8"?>${stringifiedMedia}
<${this.openTag}>
    ${contentInside}
        <${this.closeTag}>`
    }
}

export class para extends Tag {
    constructor() {
        super()
        this.name = "para"
        this.openTag = `para`
        this.closeTag = `/para`
    }
}

export class text extends Tag {
    constructor(someText) {
        super()
        this.name = "text"
        this.openTag = someText
        this.closeTag = ""
    }

    stringify(level) {
        return `${paddng(level)}${this.openTag}`
    }
}

export class caution extends Tag {
    constructor() {
        super()
        this.name = "caution"
        this.openTag = `caution`
        this.closeTag = `/caution`
    }
}

export class warningAndCautionPara extends Tag {
    constructor() {
        super()
        this.name = "warningAndCautionPara"
        this.openTag = `warningAndCautionPara`
        this.closeTag = `/warningAndCautionPara`
    }
}

export class sequentialList extends Tag {
    constructor() {
        super()
        this.name = "sequentialList"
        this.openTag = `sequentialList`
        this.closeTag = `/sequentialList`
    }
}

export class listItem extends Tag {
    constructor() {
        super()
        this.name = "listItem"
        this.openTag = `listItem`
        this.closeTag = `/listItem`
    }
}

export class randomList extends Tag {
    constructor() {
        super()
        this.name = "randomList"
        this.openTag = `randomList`
        this.closeTag = `/randomList`
    }
}

export class levelledPara extends Tag {
    constructor() {
        super()
        this.name = "levelledPara"
        this.openTag = `levelledPara`
        this.closeTag = `/levelledPara`
    }
}

export class title extends Tag {
    constructor(title) {
        super()
        this.name = "title"
        this.openTag = `title`
        this.closeTag = `/title`
        let newT = new text(title)
        newT.parent = this
        this.content.push(newT)
    }

    stringify(level) {
        return `\n${paddng(level)}<${this.openTag}${this.attribute}>${this.content[0].stringify(0)}<${this.closeTag}>`
    }
}

export class internalRef extends Tag {
    constructor() {
        super()
        this.name = "internalRef"
        this.openTag = `internalRef`
        this.tags = 1
    }
}

export class figure extends Tag {
    constructor() {
        super()
        this.name = "figure"
        this.openTag = `figure`
        this.closeTag = `/figure`
    }
}

export class graphic extends Tag {
    constructor() {
        super()
        this.name = "graphic"
        this.openTag = `graphic`
        this.closeTag = `/graphic`
    }

    stringify(level) {
        return `\n${paddng(level)}<${this.openTag}${this.attribute}><${this.closeTag}>`
    }
}

export class table extends Tag {
    constructor() {
        super()
        this.name = "table"
        this.openTag = `table`
        this.closeTag = `/table`
    }
}

export class tgroup extends Tag {
    constructor() {
        super()
        this.name = "tgroup"
        this.openTag = `tgroup`
        this.closeTag = `/tgroup`
    }
}

export class colspec extends Tag {
    constructor() {
        super()
        this.name = "colspec"
        this.openTag = `colspec`
        this.closeTag = `/colspec`
        this.tags = 1
    }
}

export class thead extends Tag {
    constructor() {
        super()
        this.name = "thead"
        this.openTag = `thead`
        this.closeTag = `/thead`
    }
}

export class tbody extends Tag {
    constructor() {
        super()
        this.name = "tbody"
        this.openTag = `tbody`
        this.closeTag = `/tbody`
    }
}

export class entry extends Tag {
    constructor() {
        super()
        this.name = "entry"
        this.openTag = `entry`
        this.closeTag = `/entry`
    }
}

export class row extends Tag {
    constructor() {
        super()
        this.name = "row"
        this.openTag = `row`
        this.closeTag = `/row`
    }
}

export class note extends Tag {
    constructor() {
        super()
        this.name = "note"
        this.openTag = `note`
        this.closeTag = `/note`
    }
}

export class notePara extends Tag {
    constructor() {
        super()
        this.name = "notePara"
        this.openTag = `notePara`
        this.closeTag = `/notePara`
    }
}

const infoTable = [
    { "infoCode": "018", "infoName": "Введение" },
    { "infoCode": "020", "infoName": "Назначение" },
    { "infoCode": "030", "infoName": "Технические характеристики" },
    { "infoCode": "034", "infoName": "Состав изделия" },
    { "infoCode": "041", "infoName": "Устройство и работа" },
    { "infoCode": "044", "infoName": "Описание и работа составных частей изделия" },
    { "infoCode": "122", "infoName": "Указания по включению и опробованию работы изделия" },
    { "infoCode": "123", "infoName": "Установка и настройка программного обеспечения" },
    { "infoCode": "410", "infoName": "Перечень возможных неисправностей в процессе использования изделия и рекомендации по действиям при их возникновении" },
]

function paddng(level = 0) {
    const tab = '    '
    return tab.repeat(level)
}

// function newLine() {}
