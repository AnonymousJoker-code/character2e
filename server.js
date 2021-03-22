const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const Papa = require('papaparse')
const axios = require('axios')

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

app.use('/', indexRouter)

app.get('/test', async (req, res) => {
    res.send('test')
})

let armorParse = undefined
let weaponParse = undefined
let raceParse = undefined
let classParse = undefined
let raceClassReqParse = undefined

const papaConfig = {
	header: true,
}

const armorListUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQGecvX3EBMdZq1sgFnUxKxeYzMnVAiaL9prMak-kcoH3UxTaftWAtyI8kMrcqruF4lioRyCzJmIWj2/pub?gid=0&single=true&output=csv'
const weaponListUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQGecvX3EBMdZq1sgFnUxKxeYzMnVAiaL9prMak-kcoH3UxTaftWAtyI8kMrcqruF4lioRyCzJmIWj2/pub?gid=1660219728&single=true&output=csv'
const raceListUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQGecvX3EBMdZq1sgFnUxKxeYzMnVAiaL9prMak-kcoH3UxTaftWAtyI8kMrcqruF4lioRyCzJmIWj2/pub?gid=1707483028&single=true&output=csv'
const classListUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQGecvX3EBMdZq1sgFnUxKxeYzMnVAiaL9prMak-kcoH3UxTaftWAtyI8kMrcqruF4lioRyCzJmIWj2/pub?gid=734079155&single=true&output=csv'
const classRaceReqListUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQGecvX3EBMdZq1sgFnUxKxeYzMnVAiaL9prMak-kcoH3UxTaftWAtyI8kMrcqruF4lioRyCzJmIWj2/pub?gid=918250155&single=true&output=csv'



axios.get(armorListUrl).then((res) => {
    armorParse = Papa.parse(res.data, papaConfig)
})

app.get('/armorlist', async (req, res) => {
    res.send(armorParse)
})

axios.get(weaponListUrl).then((res) => {
    weaponParse = Papa.parse(res.data, papaConfig)
})

app.get('/weaponlist', async (req, res) => {
    res.send(weaponParse)
})

axios.get(raceListUrl).then((res) => {
    raceParse = Papa.parse(res.data, papaConfig)
})

app.get('/racelist', async (req, res) => {
    res.send(raceParse)
})

axios.get(classListUrl).then((res) => {
    classParse = Papa.parse(res.data, papaConfig)
})

app.get('/classlist', async (req, res) => {
    res.send(classParse)
})

axios.get(classRaceReqListUrl).then((res) => {
    classRaceReqParse = Papa.parse(res.data, papaConfig)
})

app.get('/classracereqlist', async (req, res) => {
    res.send(classRaceReqParse)
})

app.listen(process.env.PORT || 3000)