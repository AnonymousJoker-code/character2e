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

const papaConfig = {
	header: true,
}

const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQGecvX3EBMdZq1sgFnUxKxeYzMnVAiaL9prMak-kcoH3UxTaftWAtyI8kMrcqruF4lioRyCzJmIWj2/pub?gid=0&single=true&output=csv'

axios.get(url).then((res) => {
    armorParse = Papa.parse(res.data, papaConfig)
})

app.get('/papa', async (req, res) => {
    res.send(armorParse)
})


app.listen(process.env.PORT || 3000)