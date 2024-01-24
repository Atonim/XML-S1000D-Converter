// Possible problems:
//  - In *dmodule* class: media can be not only jpeg
//  - In *internalRef* class: how to show 1 teg in *stringify*                          (soluted)
//  - 57
// All classes override this methods:
//  :constructor (params?)          -> create object
//  :addContent (newElement)        -> add content *newElement* inside current teg
//  :addAttribute (attributeString) -> add attribute *attributeString* into open teg
//  :stringify ()                   -> stringify current teg and it's content
//  :setParent (element)            -> set link on parent teg *element*

class Teg {
    name        = ""
    openTeg     = ""
    closeTeg    = ""
    attribute   = ""
    content     = []
    parent      = null
    tegs        = 2

    addContent (newElement) {
        this.content.push(newElement)
    }

    addAttribute (attributeString) {
        this.attribute += ` ${attributeString}`
    }

    stringify () {
        let contentInside = ""
        this.content.forEach((element) => contentInside + element.stringify())

        if (this.tegs === 2){
            return `
<${this.openTeg}${this.attribute}>
    ${contentInside}
<${this.closeTeg}>
`
        } else {
            return `
    <${this.openTeg}${this.attribute} />
`
        }
    }

    setParent (element) {
        this.parent = element
    }
}

export class dmodule extends Teg {
    constructor (infoCode, techName) {
        super()
        let currentTime     = new Date()
        let creationDay     = currentTime.getDay()
        let creationMonth   = currentTime.getMonth()
        let creationYear    = currentTime.getFullYear()
        let infoName        = 
        this.media      = []
        this.name       = "dmodule"
        this.openTeg    = 
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
        this.closeTeg   = 
`/description>
    </content>
</dmodule`
    }

    addMedia (fileName) {
        this.media.push(fileName)
    }

    stringify () {
        // console.log("this.media", this.media)
        let contentInside = ""
        this.content.forEach((element) => contentInside + element.stringify())

        let stringifiedMedia = ""
        if (this.media.length) {
            let mediaInside = ""
            this.media.forEach(element => mediaInside + `
    <!ENTITY ${element.filename} SYSTEM "../Images/${element.filename}.${element.fileformat}" NDATA ${element.fileformat}>`
            )
            stringifiedMedia = `
<!DOCTYPE dmodule [
<!NOTATION jpg PUBLIC "jpg" "jpg">
${mediaInside}
]>`
        }

        return `<?xml version="1.0" encoding="UTF-8"?>${stringifiedMedia}
<${this.openTeg}>
    ${contentInside}
<${this.closeTeg}>`
    }
}

export class para extends Teg {
    constructor () {
        super()
        this.name       = "para"
        this.openTeg    = `para`
        this.closeTeg   = `/para`
    }
}

export class text extends Teg {
    constructor (someText) {
        this.name       = "text"
        this.openTeg    = someText
        this.closeTeg   = ""
    }
}

export class caution extends Teg {
    constructor () {
        this.name       = "caution"
        this.openTeg    = `caution`
        this.closeTeg   = `/caution`
    }
}

export class warningAndCautionPara extends Teg {
    constructor () {
        this.name       = "warningAndCautionPara"
        this.openTeg    = `warningAndCautionPara`
        this.closeTeg   = `/warningAndCautionPara`
    }
}

export class sequentialList extends Teg {
    constructor () {
        this.name       = "sequentialList"
        this.openTeg    = `sequentialList`
        this.closeTeg   = `/sequentialList`
    }
}

export class listItem extends Teg {
    constructor () {
        this.name       = "listItem"
        this.openTeg    = `listItem`
        this.closeTeg   = `/listItem`
    }
}

export class randomList extends Teg {
    constructor () {
        this.name       = "randomList"
        this.openTeg    = `randomList`
        this.closeTeg   = `/randomList`
    }
}

export class levelledPara extends Teg {
    constructor () {
        this.name       = "levelledPara"
        this.openTeg    = `levelledPara`
        this.closeTeg   = `/levelledPara`
    }
}

export class title extends Teg {
    constructor () {
        this.name       = "title"
        this.openTeg    = `title`
        this.closeTeg   = `/title`
    }
}

export class internalRef extends Teg {
    constructor () {
        this.name       = "internalRef"
        this.openTeg    = `internalRef`
        this.tegs       = 1
    }
}

export class figure extends Teg {
    constructor () {
        this.name       = "figure"
        this.openTeg    = `figure`
        this.closeTeg   = `/figure`
    }
}

export class graphic extends Teg {
    constructor () {
        this.name       = "graphic"
        this.openTeg    = `graphic`
        this.closeTeg   = `/graphic`
    }
}

export class table extends Teg {
    constructor () {
        this.name       = "table"
        this.openTeg    = `table`
        this.closeTeg   = `/table`
    }
}

export class tgroup extends Teg {
    constructor () {
        this.name       = "tgroup"
        this.openTeg    = `tgroup`
        this.closeTeg   = `/tgroup`
    }
}

export class colspec extends Teg {
    constructor () {
        this.name       = "colspec"
        this.openTeg    = `colspec`
        this.closeTeg   = `/colspec`
    }
}

export class thead extends Teg {
    constructor () {
        this.name       = "thead"
        this.openTeg    = `thead`
        this.closeTeg   = `/thead`
    }
}

export class entry extends Teg {
    constructor () {
        this.name       = "entry"
        this.openTeg    = `entry`
        this.closeTeg   = `/entry`
    }
}

export class row extends Teg {
    constructor () {
        this.name       = "row"
        this.openTeg    = `row`
        this.closeTeg   = `/row`
    }
}

const infoTable = [
    {"infoCode": "018", "infoName": ""},
    {"infoCode": "020", "infoName": ""},
    {"infoCode": "030", "infoName": ""},
    {"infoCode": "034", "infoName": ""},
    {"infoCode": "041", "infoName": ""},
    {"infoCode": "044", "infoName": ""},
    {"infoCode": "122", "infoName": ""},
    {"infoCode": "123", "infoName": ""},
    {"infoCode": "410", "infoName": ""},
]