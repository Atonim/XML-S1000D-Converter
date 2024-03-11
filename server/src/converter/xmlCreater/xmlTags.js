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
${paddng(level)}<${this.openTag} ${this.attribute}>${contentInside}
${paddng(level)}<${this.closeTag}>`)
        } else {
            return `\n${paddng(level)}<${this.openTag}${this.attribute} />`
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
        let contentInside = ''
        for (let i = 0; i < this.content.length; i++) {
            contentInside += String(this.content[i].stringify())
        }

        let stringifiedMedia = ''
        let dictMediaInside = new Map()

        if (this.media.length) {
            //console.log(`this.media.length ${this.media.length}`)
            let extension = ''
            let data = ''

            for (let mediaEl of this.media) {
                extension = mediaEl.split('.').pop()
                //console.log(extension)
                data = `\n<!ENTITY ${mediaEl} SYSTEM "../Images/${mediaEl}" NDATA ${extension}>`

                if (dictMediaInside.has(extension)) {
                    dictMediaInside.set(extension, dictMediaInside.get(extension) + data)
                } else {
                    dictMediaInside.set(extension, data)
                }
            }
            //console.log(`Количество ключей в объекте Map: ${dictMediaInside.size}`)

            //stringifiedMedia = `<!DOCTYPE dmodule [ <!NOTATION jpg PUBLIC "jpg" "jpg">${mediaInside}]>`
            let strAllMedia = ''
            dictMediaInside.forEach((value, extension) => {
                //console.log(`Ключ: ${extension}, Значение: ${value}`)
                strAllMedia += `\n<!NOTATION ${extension} PUBLIC "${extension}" "${extension}">${value}`
            })

            stringifiedMedia = ` <!DOCTYPE dmodule [${strAllMedia}]>`
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

    stringify(level) {
        let contentInside = ""
        for (let i = 0; i < this.content.length; i++) {
            contentInside += String(this.content[i].stringify(level + 1))
        }

        return `\n${paddng(level)}<${this.openTag}${this.attribute}>${contentInside}<${this.closeTag}>`
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
        return `${this.openTag}`
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

    stringify(level) {
        let contentInside = ""
        for (let i = 0; i < this.content.length; i++) {
            contentInside += String(this.content[i].stringify(level + 1))
        }

        return `\n${paddng(level)}<${this.openTag}${this.attribute}>${contentInside}
${paddng(level)}<${this.closeTag}>`
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


//scorm

export class scormContentPackage extends Tag {
    constructor() {
        super()
        this.name = "scormContentPackage"
        this.openTag = `
        <scormContentPackage 
            xmlns:lom="http://ltsc.ieee.org/xsd/LOM" 
            xmlns:ns3="http://ltsc.ieee.org/xsd/LOM/extend" 
            xmlns:ns1="http://ltsc.ieee.org/xsd/LOM/unique" 
            xmlns:ns2="http://ltsc.ieee.org/xsd/LOM/vocab" 
            xmlns:dc="http://www.purl.org/dc/elements/1.1/" 
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xsi:noNamespaceSchemaLocation="../../../xml_schema_flat/scormcontentpackage.xsd">
            <script/>
                <identAndStatusSection>
                    ...
                </identAndStatusSection>
                <content>
        `
        this.closeTag = `</content>
        </scormContentPackage>`

    }
}

export class scoEntry extends Tag {
    constructor() {
        super()
        this.name = "scoEntry"
        this.openTag = `scoEntry`
        this.closeTag = `/scoEntry`
    }
}

export class scoEntryAdress extends Tag {
    constructor() {
        super()
        this.name = "scoEntryAdress"
        this.openTag = `scoEntryAdress`
        this.closeTag = `/scoEntryAdress`
    }
}

export class scoEntryCode extends Tag {
    constructor() {
        super()
        this.name = "scoEntryCode"
        this.openTag = `scoEntryCode`
        this.closeTag = `/scoEntryCode`
        this.tags = 1
    }
}

export class scoEntryContent extends Tag {
    constructor() {
        super()
        this.name = "scoEntryContent"
        this.openTag = `scoEntryContent`
        this.closeTag = `/scoEntryContent`
    }
}

export class scoEntryTitle extends Tag {
    constructor() {
        super()
        this.name = "scoEntryTitle"
        this.openTag = `scoEntryTitle`
        this.closeTag = `/scoEntryTitle`
    }
}

export class security extends Tag {
    constructor() {
        super()
        this.name = "security"
        this.openTag = `security`
        this.closeTag = `/security`
        this.tags = 1
    }
}

export class qualityAssurance extends Tag {
    constructor() {
        super()
        this.name = "qualityAssurance"
        this.openTag = `qualityAssurance`
        this.closeTag = `/qualityAssurance`
    }
}

export class unverified extends Tag {
    constructor() {
        super()
        this.name = "unverified"
        this.openTag = `unverified`
        this.closeTag = `/unverified`
        this.tags = 1
    }
}

export class dmRef extends Tag {
    constructor() {
        super()
        this.name = "dmRef"
        this.openTag = `dmRef`
        this.closeTag = `/dmRef`
    }
}

export class dmRefIdent extends Tag {
    constructor() {
        super()
        this.name = "dmRefIdent"
        this.openTag = `dmRefIdent`
        this.closeTag = `/dmRefIdent`
    }
}

export class dmRefAddressItems extends Tag {
    constructor() {
        super()
        this.name = "dmRefAddressItems"
        this.openTag = `dmRefAddressItems`
        this.closeTag = `/dmRefAddressItems`
    }
}

export class dmCode extends Tag {
    constructor() {
        super()
        this.name = "dmCode"
        this.openTag = `dmCode`
        this.closeTag = `/dmCode`
        this.tags = 1
    }
}

export class language extends Tag {
    constructor() {
        super()
        this.name = "language"
        this.openTag = `language`
        this.closeTag = `/language`
        this.tags = 1
    }
}

export class issueDate extends Tag {
    constructor() {
        super()
        this.name = "issueDate"
        this.openTag = `issueDate`
        this.closeTag = `/issueDate`
        this.tags = 1
    }
}

export class lomLom extends Tag {
    constructor() {
        super()
        this.name = "lom:lom"
        this.openTag = `lom:lom`
        this.closeTag = `/lom:lom`

    }
}

export class lomGeneral extends Tag {
    constructor() {
        super()
        this.name = "lom:general"
        this.openTag = `lom:general`
        this.closeTag = `/lom:general`

    }
}

export class lomLifeCycle extends Tag {
    constructor() {
        super()
        this.name = "lom:lifeCycle"
        this.openTag = `lom:lifeCycle`
        this.closeTag = `/lom:lifeCycle`

    }
}

export class lomMetaMetadata extends Tag {
    constructor() {
        super()
        this.name = "lom:metaMetadata"
        this.openTag = `lom:metaMetadata`
        this.closeTag = `/lom:metaMetadata`

    }
}

export class lomTechnical extends Tag {
    constructor() {
        super()
        this.name = "lom:technical"
        this.openTag = `lom:technical`
        this.closeTag = `/lom:technical`

    }
}

export class lomRights extends Tag {
    constructor() {
        super()
        this.name = "lom:rights"
        this.openTag = `lom:rights`
        this.closeTag = `/lom:rights`

    }
}

export class lomTitle extends Tag {
    constructor() {
        super()
        this.name = "lom:title"
        this.openTag = `lom:title`
        this.closeTag = `/lom:title`

    }
}

export class lomString extends Tag {
    constructor() {
        super()
        this.name = "lom:string"
        this.openTag = `lom:string`
        this.closeTag = `/lom:string`

    }
}

export class lomIdentifier extends Tag {
    constructor() {
        super()
        this.name = "lom:identifier"
        this.openTag = `lom:identifier`
        this.closeTag = `/lom:identifier`

    }
}

export class lomCatalog extends Tag {
    constructor() {
        super()
        this.name = "lom:catalog"
        this.openTag = `lom:catalog`
        this.closeTag = `/lom:catalog`

    }
}

export class lomEntry extends Tag {
    constructor() {
        super()
        this.name = "lom:entry"
        this.openTag = `lom:entry`
        this.closeTag = `/lom:entry`

    }
}

export class lomDescription extends Tag {
    constructor() {
        super()
        this.name = "lom:description"
        this.openTag = `lom:description`
        this.closeTag = `/lom:description`

    }
}

export class lomKeyword extends Tag {
    constructor() {
        super()
        this.name = "lom:keyword"
        this.openTag = `lom:keyword`
        this.closeTag = `/lom:keyword`

    }
}

export class lomVersion extends Tag {
    constructor() {
        super()
        this.name = "lom:version"
        this.openTag = `lom:version`
        this.closeTag = `/lom:version`

    }
}

export class lomStatus extends Tag {
    constructor() {
        super()
        this.name = "lom:status"
        this.openTag = `lom:status`
        this.closeTag = `/lom:status`

    }
}

export class lomSource extends Tag {
    constructor() {
        super()
        this.name = "lom:source"
        this.openTag = `lom:source`
        this.closeTag = `/lom:source`

    }
}

export class lomContribute extends Tag {
    constructor() {
        super()
        this.name = "lom:contribute"
        this.openTag = `lom:contribute`
        this.closeTag = `/lom:contribute`

    }
}

export class lomValue extends Tag {
    constructor() {
        super()
        this.name = "lom:value"
        this.openTag = `lom:value`
        this.closeTag = `/lom:value`

    }
}

export class lomRole extends Tag {
    constructor() {
        super()
        this.name = "lom:role"
        this.openTag = `lom:role`
        this.closeTag = `/lom:role`

    }
}

export class lomEntity extends Tag {
    constructor() {
        super()
        this.name = "lom:entity"
        this.openTag = `lom:entity`
        this.closeTag = `/lom:entity`

    }
}

export class lomDate extends Tag {
    constructor() {
        super()
        this.name = "lom:date"
        this.openTag = `lom:date`
        this.closeTag = `/lom:date`

    }
}

export class lomMetadataSchema extends Tag {
    constructor() {
        super()
        this.name = "lom:metadataSchema"
        this.openTag = `lom:metadataSchema`
        this.closeTag = `/lom:metadataSchema`

    }
}

export class lomDateTime extends Tag {
    constructor() {
        super()
        this.name = "lom:dateTime"
        this.openTag = `lom:dateTime`
        this.closeTag = `/lom:dateTime`

    }
}

export class lomFormat extends Tag {
    constructor() {
        super()
        this.name = "lom:format"
        this.openTag = `lom:format`
        this.closeTag = `/lom:format`

    }
}

export class lomCost extends Tag {
    constructor() {
        super()
        this.name = "lom:cost"
        this.openTag = `lom:cost`
        this.closeTag = `/lom:cost`

    }
}

export class lomCopyrightAndOtherRestrictions extends Tag {
    constructor() {
        super()
        this.name = "lom:copyrightAndOtherRestrictions"
        this.openTag = `lom:copyrightAndOtherRestrictions`
        this.closeTag = `/lom:copyrightAndOtherRestrictions`

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
