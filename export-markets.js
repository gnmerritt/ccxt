"use strict";

const fs        = require ('fs')
const ccxt      = require ('./ccxt')
const countries = require ('./countries')
const asTable   = require ('as-table')
const util      = require ('util')

let markets
let verbose = false

try {

    markets = require ('./config')

} catch (e) {

    markets = { // defaults

        _1broker:    { 'verbose': verbose, apiKey: '', token: '', },
        _1btcxe:     { 'verbose': verbose, apiKey: '', secret: '', },
        anxpro:      { 'verbose': verbose, apiKey: '', secret: '', },
        bit2c:       { 'verbose': verbose, apiKey: '', secret: '', },
        bitbay:      { 'verbose': verbose, apiKey: '', secret: '', },
        bitcoincoid: { 'verbose': verbose, apiKey: '', secret: '', },
        bitfinex:    { 'verbose': verbose, apiKey: '', secret: '', },
        bitlish:     { 'verbose': verbose, apiKey: '', login: '', password: '', },
        bitmarket:   { 'verbose': verbose, apiKey: '', secret: '', },    
        bitmex:      { 'verbose': verbose, apiKey: '', secret: '', },
        bitso:       { 'verbose': verbose, apiKey: '', secret: '', },
        bitstamp:    { 'verbose': verbose, apiKey: '', secret: '', uid: '', },
        bittrex:     { 'verbose': verbose, apiKey: '', secret: '', },
        btcchina:    { 'verbose': verbose, apiKey: '', secret: '', },
        btcx:        { 'verbose': verbose, apiKey: '', secret: '', },
        bxinth:      { 'verbose': verbose, apiKey: '', secret: '', },
        ccex:        { 'verbose': verbose, apiKey: '', secret: '', },
        cex:         { 'verbose': verbose, apiKey: '', secret: '', uid: '', }, 
        coincheck:   { 'verbose': verbose, apiKey: '', secret: '', },
        coinsecure:  { 'verbose': verbose, apiKey: '', },
        exmo:        { 'verbose': verbose, apiKey: '', secret: '', },
        fybse:       { 'verbose': verbose, apiKey: '', secret: '', },
        fybsg:       { 'verbose': verbose, apiKey: '', secret: '', },
        gdax:        { 'verbose': verbose, apiKey: '', secret: '', password: '' }, 
        hitbtc:      { 'verbose': verbose, apiKey: '', secret: '', },
        huobi:       { 'verbose': verbose, apiKey: '', secret: '', },    
        jubi:        { 'verbose': verbose, apiKey: '', secret: '', },    
        kraken:      { 'verbose': verbose, apiKey: '', secret: '', },    
        luno:        { 'verbose': verbose, apiKey: '', secret: '', },
        okcoinusd:   { 'verbose': verbose, apiKey: '', secret: '', },
        okcoincny:   { 'verbose': verbose, apiKey: '', secret: '', },
        poloniex:    { 'verbose': verbose, apiKey: '', secret: '', },
        quadrigacx:  { 'verbose': verbose, apiKey: '', secret: '', uid: 123, },    
        quoine:      { 'verbose': verbose, apiKey: '', secret: '', },    
        therock:     { 'verbose': verbose, apiKey: '', secret: '', },    
        vaultoro:    { 'verbose': verbose, apiKey: '', secret: '', },
        virwox:      { 'verbose': verbose, apiKey: '', login: '', password: '', },
        yobit:       { 'verbose': verbose, apiKey: '', secret: '', },
        zaif:        { 'verbose': verbose, apiKey: '', secret: '', },
    }
}

for (let id in markets) {
    markets[id] = new (ccxt)[id] (markets[id])
    markets[id].verbose = verbose
}

// console.log (Object.values (ccxt).length)

var countryName = function (code) {
    return ((typeof countries[code] !== 'undefined') ? countries[code] : code)
}

let sleep = async ms => await new Promise (resolve => setTimeout (resolve, ms))

//-------------------------------------------------------------------------
// list all supported exchanges

let values = Object.values (markets).map (market => {
    let logo = market.urls['logo']
    let website = Array.isArray (market.urls.www) ? market.urls.www[0] : market.urls.www
    let countries = Array.isArray (market.countries) ? market.countries.map (countryName).join (', ') : countryName (market.countries)
    let doc = Array.isArray (market.urls.doc) ? market.urls.doc[0] : market.urls.doc
    let version = market.version ? market.version : '\*'
    if (version[0] == 'v')
        version = version.slice (1)
    return {
        '': '![' + market.id + '](' + logo + ')',
        'id': market.id,
        'name': '[' + market.name + '](' + website + ')',
        'ver': version,
        'doc': '[API](' + doc + ')',
        'countries': countries, 
    }        
})

let exchanges = asTable.configure ({ delimiter: ' | ' }) (values)
let lines = exchanges.split ("\n")
lines[1] = lines[0].replace (/[^\|]/g, '-')
let headerLine = lines[1].split ('|')
headerLine[3] = ':' + headerLine[3].slice (1, headerLine[3].length - 1) + ':'
headerLine[4] = ':' + headerLine[4].slice (1, headerLine[4].length - 1) + ':'
lines[1] = headerLine.join ('|')

lines = lines.map (line => '|' + line + '|').join ("\n")

let changeInFile = (file) => {
    console.log (file)
    let oldContent = fs.readFileSync (file, 'utf8')
    let newContent = oldContent.replace (/[\n][\n]\|[^#]+\|([\n][\n]|[\n]$|$)/m, "\n\n" + lines + "$1")
    fs.writeFileSync (file, newContent)
}

changeInFile ('README.md')
changeInFile ('../ccxt.wiki/Exchange-Markets.md')
changeInFile ('../ccxt.wiki/Manual.md')

console.log ('Markets exported successfully.')
