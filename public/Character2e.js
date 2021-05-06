let armorList = undefined
let weaponList = undefined
let raceList = undefined
let classList = undefined
let abilityScoreChart = undefined
let thac0List = undefined

let characterStats = []
let characterStatsBonuses = [0, 0, 0, 0, 0, 0]
let characterStatsDisplayed = []
let characterStartingHP = 0
let characterGold = 0
let characterThac0 = 0

let strAbilityScoreObject = undefined
let dexAbilityScoreObject = undefined
let conAbilityScoreObject = undefined
let intAbilityScoreObject = undefined
let wisAbilityScoreObject = undefined
let chaAbilityScoreObject = undefined
let characterObject = undefined

// Remove Later
//let undefinedBS = setInterval(listUndefinedErrorHandlerBS(), 1000)
window.onload = async function(){
    await getParsedData()
    getStats()
}

async function getParsedData(){
    await axios.get('/armorlist').then((res) => getArmorList(res.data.data))
    await axios.get('/weaponlist').then((res) => getWeaponList(res.data.data))
    await axios.get('/racelist').then((res) => getRaceList(res.data.data))
    await axios.get('/classlist').then((res) => getClassList(res.data.data))
    await axios.get('/abilityscorecharts').then((res) => getAbilityScoreCharts(res.data.data))
    await axios.get('/thac0').then((res) => getThac0(res.data.data))
    return 'Hopefully everything has been parsed. ¯\\_(ツ)_/¯'
}

function clearHTMLElement(elementId){
    document.getElementById(elementId).innerHTML = ''
}

function nukeEverything(){
    let x = document.getElementById('EquipmentShop')
    if(x.style.opacity == 1) {
        x.style.opacity = 0
        document.getElementById('AC').style.opacity = 0
    }
    setAC(10)
    clearHTMLElement('EquipmentList')
    clearHTMLElement('armor')
    clearHTMLElement('weapon')
    document.getElementById('value-starting-gold').innerText = 0
    document.getElementById('value-starting-hp').innerText = 0
}

// Cleaning the die input to get the correct number of dice and sides of the dice being rolled. Also figuring out the correct bonus that needs to be applied to the total.
function roll(die){
    let mathRegex = /[-+*/]/
    let valuesArray = die.split(mathRegex)
    let mathOpArray = []

    for(let i = 0; i < die.length; i++){
      if(die[i].match(mathRegex)){
        mathOpArray.push(die[i])
      }
    }

    for(let i = 0; i < valuesArray.length; i++){
        if(valuesArray[i].match(/d/)) {
            valuesArray[i] = dieRolling(valuesArray[i])
            }
    }

    let counter = 0
    let b1 =  0, b2 = 0
    while(valuesArray.length > 1){
        b1 = parseInt(valuesArray.shift())
        b2 = parseInt(valuesArray[0])
        valuesArray[0] = switchMath(b1, b2, mathOpArray[counter])
        counter++
    }
    return Math.floor(valuesArray[0])
}

function dieRolling(die){
  let numDice = die.split('d')[0]
  let dieSides = die.split('d')[1]

  let rolled = 0
    for (let i = 0; i < numDice; i++) {
        rolled += Math.ceil(Math.random() * dieSides)
    }
  return rolled
}

function switchMath(value1, value2, mathOperater){
    switch(mathOperater){
        case '+':
            return value1 + value2
        case '-':
            return value1 - value2
        case '*':
            return value1 * value2
        case '/':
            return value1 / value2
    }
}

// Generating the stat values for the 6 base stats.  Also checking the power level of those generated stats.
function getStats(){
   for (let i = 0; i < 6; i++) {
        characterStats[i] = roll('3d6')
    }

    updateStats()
    nukeEverything()

    if(document.getElementById('selected-race') != null) document.getElementById('selected-race').value = ''
    if(document.getElementById('selected-class') != null) document.getElementById('selected-class').value = ''

    powerCheck(characterStats.reduce((a,b) => a + b))
}

// Really jank way of making datalist act like html select.  Change later.
function raceChoices(){
    if(document.getElementById('selected-race') != null) document.getElementById('selected-race').value = ''
}

function updateStats(){
    const statValues = document.getElementsByClassName("statVal")

    for(let i = 0; i < characterStatsBonuses.length; i++){
        characterStatsDisplayed[i] = parseInt(characterStats[i]) + parseInt(characterStatsBonuses[i])
        statValues[i].innerHTML = characterStatsDisplayed[i]
    }
}

// Checking the power level of the generated character based on the given values.
function powerCheck(statTotal){
    if (Math.abs(document.getElementById("minStats").value) > statTotal || Math.abs(document.getElementById("maxStats").value) < statTotal) {
        getStats()
        return
    }

    document.getElementById("totalStats").innerHTML = statTotal
    raceOptions()
}

function getArmorList(armorListJSON){
    if(armorList == undefined) armorList = armorListJSON
    if(armorList == undefined) axios.get('/armorlist').then((res) => fillingArmorList(res.data.data))
}

function getRaceList(raceListJSON){
    if(raceList == undefined) raceList = raceListJSON
    if(raceList == undefined) axios.get('/racelist').then((res) => getRaceList(res.data.data))
}

function getClassList(classListJSON){
    if(classList == undefined) classList = classListJSON
    if(classList == undefined) axios.get('/classlist').then((res) => getClassList(res.data.data))
}

function getWeaponList(weaponListJSON){
    if(weaponList == undefined) weaponList = weaponListJSON
    if(weaponList == undefined) axios.get('/weaponlist').then((res) => getWeaponList(res.data.data))
}

function getAbilityScoreCharts(abilityScoreChartsJSON){
    if(abilityScoreChart == undefined) abilityScoreChart = abilityScoreChartsJSON
    if(abilityScoreChart == undefined) axios.get('/abilityscorecharts').then((res) => getAbilityScoreCharts(res.data.data))
}

function getThac0(thac0JSON){
    if(thac0List == undefined) thac0List = thac0JSON
    if(thac0List == undefined) axios.get('/thac0').then((res) => getThac0(res.data.data))
}

// Functions to build HTML elements
function insertIntoDataList(datalistId, header, sub){
    document.getElementById(datalistId).insertAdjacentHTML("beforeend", `<option value="${header}">${sub}</option>`)
}

function insertIntoEquipmentList(EquipmentListId, header, sub){
    document.getElementById(EquipmentListId).insertAdjacentHTML("beforeend", `<dt class="Equipment" id="${header}">${header}</dt><dd class="Equipment">${sub}</dd>`)
}

function insertIntoAbilityScoreList(abilityScoreChartId, divId,pId, title){
    if(document.getElementById(divId) == null){
      document.getElementById(abilityScoreChartId).insertAdjacentHTML("beforeend", `<div class="charts" id="${divId}"></div>`)
    }
     document.getElementById(divId).insertAdjacentHTML("beforeend", `<p id="${pId}">${title}</p>`)
}

// Building the datalist options for armor and weapons.
function fillingArmorList(){
    if(armorList != undefined){
        clearHTMLElement('armorList')
        for (let i = 0; i < armorList.length; i++) {
            if(parseInt(armorList[i].Cost) < characterGold) insertIntoDataList('armorList', armorList[i].Name, `AC: ${armorList[i].AC} | Cost: ${armorList[i].Cost} | Weight: ${armorList[i].Weight}`)
        }
    }
}

function fillingWeaponList(){
    if(weaponList != undefined){
        clearHTMLElement('weaponList')
        for (let i = 0; i < weaponList.length; i++) {
            if(parseInt(weaponList[i].Cost) < characterGold) insertIntoDataList('weaponList', weaponList[i].Name, `Cost: ${weaponList[i].Cost} | Weight: ${weaponList[i].Weight}
            | Type: ${weaponList[i].Type} | Speed Factor: ${weaponList[i]['Speed Factor']} | S-M: ${weaponList[i].SM} | L: ${weaponList[i].L}`)
        }
    }
}

function setAC(currentArmor){
    if(currentArmor != undefined) document.getElementById("armorClassVal").innerHTML = currentArmor
}

function raceOptions(){
    const statValues = document.getElementsByClassName("statVal")
    let possibleRaces = []
    const reqRange = 7

    if(raceList != undefined){ //getting rid of stupid undefined error when constantly reloading for testing
        // Testing the generated stats against the stat ranges that are required to be able to choose a certain race.
        for(let i = 0; i < raceList.length; i++){
            const raceRecord = Object.entries(raceList[i])
            // reason why to use Object.entries(...) vs just the JSON
            // const raceRecord = raceList[i]
            // console.log(
            //     raceList[i].Race,
            //     raceList[i].ReqSTR,
            //     raceList[i].ReqDEX,
            //     raceList[i].ReqCON,
            //     raceList[i].ReqINT,
            //     raceList[i].ReqWIS,
            //     raceList[i].ReqCHA
            //     )
            let statIndex = 0
            let passTest = 0

            for(let j = 1; j < reqRange; j++){
                const split = raceRecord[j][1].split('/')
                const min = split[0]
                const max = split[1]
                if(Number(statValues[statIndex].innerHTML) >= min && Number(statValues[statIndex].innerHTML) <= max) {
                    passTest++
                }
                statIndex++
            }
            if(passTest == 6) possibleRaces.push(raceRecord)
        }
    }
    isActualRace(possibleRaces)
}

// For the Races that pass all 6 requirements, they are added to an array of actual races that can be applied to the generated statline.
function isActualRace(raceRecordsOfActualRaces){
    clearHTMLElement('usable-races')
    clearHTMLElement('usable-classes')
    for(let i = 0; i < raceRecordsOfActualRaces.length; i++){
            let raceBonusArray = getRaceBonus(raceRecordsOfActualRaces[i])
            insertIntoDataList('usable-races', raceRecordsOfActualRaces[i][0][1], `${raceBonusArray[0]} ${raceBonusArray[1]}`)
    }
}

function getRaceBonus(race){
    const statBonusRangeStart = 7
    const statBonusRangeEnd = 13
    
    let bonus = []
    for(let i = statBonusRangeStart; i < statBonusRangeEnd; i++){
            let statBonus = race[i]
            if(statBonus[1] != 0) bonus.push(statBonus)
    }
    if(bonus.length == 0) return ['No','Race Bonus']
    return bonus
}

function applyingRaceBonusesToStats(selectedRace){
    selectedRace = Object.entries(selectedRace)
    let racialStatChangesStart = 7
    let racialStatChangesEnd = 13
 
    let j = 0
    for(let i = racialStatChangesStart; i < racialStatChangesEnd; i++){
        characterStatsBonuses[j] = selectedRace[i][1]
        j++
    }
    updateStats()
}

function classOptions(){
    if(document.getElementById('selected-class') != null) document.getElementById('selected-class').value = ''
    clearHTMLElement('armorList')
    
    let statRangeStart = 1
    let statRangeEnd = 7
    let selectedRace = document.getElementById('selected-race').value
    let availableClasses = []
    let classRecord = []
    let classToChooseFrom = []

    

    // Filtering the available classes for the selected race.
    for(let i = 0; i < raceList.length; i++){
        if(raceList[i].Race == selectedRace) {
            applyingRaceBonusesToStats(raceList[i])
            availableClasses = raceList[i].AvailableClasses.split(',')
            break
        }
    }

    // Getting the objects of the classes that can be selected from.
    for(let i = 0; i < availableClasses.length; i++){
        for(let j = 0; j < classList.length; j++){
            if(availableClasses[i] == classList[j]['Class']){
                classRecord.push(classList[j])
                break
            }
        }
    }

    for(let j = 0; j < classRecord.length; j++){
        let statIndex = 0
        let passTest = 0

        for(let i = statRangeStart; i < statRangeEnd; i++){
            if(Number(characterStatsDisplayed[statIndex]) >= Number(Object.entries(classRecord[j])[i][1])) passTest++
            statIndex++
        }
        if(passTest == 6) classToChooseFrom.push(classRecord[j])
    } 
    classChoices(classToChooseFrom)
}

function classChoices(classes){
    clearHTMLElement('usable-classes')
    for(let i = 0; i < classes.length; i++){
        insertIntoDataList('usable-classes', Object.entries(classes[i])[0][1], '')
    }
}

function aggregatingAbilityScoreChart(){
    let abilityScoreLineAggregate = []

    for(let j = 0; j < 6; j++){    
        for(let i = 0; i < abilityScoreChart.length; i++){
            if(abilityScoreChart[i].AbilityScore == characterStatsDisplayed[j]) abilityScoreLineAggregate.push(abilityScoreChart[i])
        }
    }
    filterAggragatedAbilityScoreChart(abilityScoreLineAggregate)
}

function filterAggragatedAbilityScoreChart(chart){
    let str = chart[0]
    let dex = chart[1]
    let con = chart[2]
    let int = chart[3]
    let wis = chart[4]
    let cha = chart[5]

    let strReg = ['Str:HitProbability', 'Str:DamageAdjustment', 'Str:WeightAllowance', 'Str:MaximumPress', 'Str:OpenDoors', 'Str:BendBarsLiftGates']
    let dexReg = ['Dex:ReactionAdjustment', 'Dex:MissileAttackAdjustment', 'Dex:DefensiveAdjustment']
    let conReg = ['Con:HitPointAdjustment', 'Con:SystemShock', 'Con:ResurrectionSurvival', 'Con:PoisonSave', 'Con:Regeneration', 'Con:SavingThrowBonus']
    let intReg = ['Int:NumberOfLanguages', 'Int:SpellLevel', 'Int:ChangeToLearnSpell', 'Int:MaximumNumberOfSpellsPerLevel', 'Int:IllusionImmunity']
    let wisReg = ['Wis:MagicalDefenseAdjustment', 'Wis:BonusSpells', 'Wis:ChanceOfSpellFailure', 'Wis:SpellImmunity']
    let chaReg = ['Cha:MaximumNumberOfHenchmen', 'Cha:LoyaltyBase', 'Cha:ReactionAdjustment']
  
    strAbilityScoreObject = getObjectOfAbilityScoreChart(str, strReg)
    dexAbilityScoreObject = getObjectOfAbilityScoreChart(dex, dexReg)
    conAbilityScoreObject = getObjectOfAbilityScoreChart(con, conReg)
    intAbilityScoreObject = getObjectOfAbilityScoreChart(int, intReg)
    wisAbilityScoreObject = getObjectOfAbilityScoreChart(wis, wisReg)
    chaAbilityScoreObject = getObjectOfAbilityScoreChart(cha, chaReg)

    characterObject = {
        strAbilityScoreObject,
        dexAbilityScoreObject,
        conAbilityScoreObject,
        intAbilityScoreObject,
        wisAbilityScoreObject,
        chaAbilityScoreObject
    }
}

function getObjectOfAbilityScoreChart(abilityScoreChart, abilityScoreChartKeys){
    let resultObject = []
    let breakPoint = 0
    for(let i = 0; i < Object.entries(abilityScoreChart).length; i++){
        if(abilityScoreChart[abilityScoreChartKeys[i]] != undefined){
            resultObject[i] = [abilityScoreChartKeys[i], abilityScoreChart[abilityScoreChartKeys[i]]]
            breakPoint++
            if(breakPoint == abilityScoreChartKeys.length) break
        }
    }
    buildAbilityScoreList(resultObject)
    breakPoint //?
    return Object.fromEntries(resultObject)
}

// insertIntoAbilityScoreList(abilityScoreChartId, pId, title)  ... "beforeend", `<p id="${pId}">${title}</p>`
function buildAbilityScoreList(incObject){
    let targetId = incObject[0][0].slice(0, 3) + 'Chart'
    let scoreTitles = []

    for(let i = 0; i < incObject.length; i++){
        let id = incObject[i][0]
        scoreTitles.push(abilityScoreChartNames(id))
    }

    for(let i = 0; i < scoreTitles.length; i++){
        insertIntoAbilityScoreList("ability-score-chart-id", targetId, incObject[i][0], `${scoreTitles[i]}: `)
    }
}

// Lots of BS here to add the space to the names.  Don't touch.
function abilityScoreChartNames(id){
    let targetTitle = id.slice(4)
    let targetArrayBeginnings = []
    let targetArrayEndings = []
    let targetArray = []

    targetArrayBeginnings = targetTitle.match(/[A-Z]/g)
    targetArrayEndings = targetTitle.split(/[A-Z]/g)
    targetArrayEndings.shift()
    for(let i = 0; i < targetArrayBeginnings.length; i++){
        targetArray[i] = targetArrayBeginnings[i] + targetArrayEndings[i]
    }
    return targetArray.join(' ')
}

function fillingAbilityScoreList(){
    let characterArray = Object.entries(characterObject)
   
    for(let i = 0; i < characterArray.length; i++){
        const x = Object.entries(characterArray[i][1])
        for(let j = 0; j < x.length; j++){
            const id = x[j][0]
            const value = x[j][1]
            actualFillingOfAbilityScoreList(id, value)
        }
    }
}
 
function actualFillingOfAbilityScoreList(id, value){
    let doc = document.getElementById(id)
    doc.innerText += ` ${value}`
}

function startingValues(){
    let classJSON = []
    let selectedClass = document.getElementById('selected-class').value
    
    for(let i = 0; i < classList.length; i++){
        if(classList[i].Class == selectedClass){
            classJSON = classList[i]
            break
        }
    }
    
    characterStartingHP = roll(classJSON['Hit Points'])
    characterGold = roll(classJSON['Starting Gold'])
    setStartingValues()
    unhidingEquipList()
    fillingArmorList()
    fillingWeaponList()
    aggregatingAbilityScoreChart()
    fillingAbilityScoreList()
}

function setStartingValues(){
    document.getElementById('value-starting-gold').innerText = characterGold
    document.getElementById('value-starting-hp').innerText = characterStartingHP
}

function buyingEquipmentPreview(){
    let cost = 0
    let armor = document.getElementById('armor').value
    let weapon = document.getElementById('weapon').value

    if(armor != ''){
        for(let i = 0; i < armorList.length; i++) {
            if(armorList[i].Name == armor){
                cost += Number(armorList[i].Cost)
                setAC(armorList[i].AC)
                break
            } 
        }
    }
    if(weapon != ''){
        for(let i = 0; i < weaponList.length; i++) {
            if(weaponList[i].Name == weapon){
                cost += Number(weaponList[i].Cost)
                break
            } 
        }
    }
    document.getElementById('cost').innerText = cost
}

function buyingEquipment(){
    let cost = Number(document.getElementById('cost').innerText)

    if(characterGold >= cost){    
        for (let i = 0; i < weaponList.length; i++) {
            if(weaponList[i].Name == document.getElementById('weapon').value) {
                insertIntoEquipmentList('EquipmentList', weaponList[i].Name, `Cost: ${weaponList[i].Cost} | Weight: ${weaponList[i].Weight}
            | Type: ${weaponList[i].Type} | Speed Factor: ${weaponList[i]['Speed Factor']} | S-M: ${weaponList[i].SM} | L: ${weaponList[i].L}`)
            break
            }
        }

        for (let i = 0; i < armorList.length; i++) {
            if(armorList[i].Name == document.getElementById('armor').value){
                insertIntoEquipmentList('EquipmentList', armorList[i].Name, `AC: ${armorList[i].AC} | Cost: ${armorList[i].Cost} | Weight: ${armorList[i].Weight}`)
                break
            }
        }

        characterGold = ((characterGold * 100) - (cost * 100)) / 100
        setStartingValues()
        fillingArmorList()
        fillingWeaponList()

        document.getElementById('cost').innerText = 0
        document.getElementById('armor').value = ''
        document.getElementById('weapon').value = ''
    } else {
        alert('You do not have enough gold for that.')
    }
}


// Remove later
// function listUndefinedErrorHandlerBS(){
//     if(raceList) {
//         clearInterval(undefinedBS)
//         console.error('Undefined BS happened again.')
//     }
//     if(raceList == undefined) axios.get('/racelist').then((res) => getRaceList(res.data.data))
//     raceOptions()
// }

// Playing around with 'staging' the build
function unhidingEquipList(){
    let x = document.getElementById('EquipmentShop')
    // x = x.style.display
    if(x.style.opacity == 0) {
        x.style.opacity = 1
        document.getElementById('AC').style.opacity = 1
    }// else {
       // x.style.opacity = 0
   //}
}