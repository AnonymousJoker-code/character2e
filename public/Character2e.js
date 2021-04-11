let armorList = undefined
let weaponList = undefined
let raceList = undefined
let classList = undefined

let characterStats = []
let characterStatsBonuses = [0, 0, 0, 0, 0, 0]
let characterStatsDisplayed = []
let characterStartingHP = 0
let characterStartingGold = 0

// Remove Later
let undefinedBS = setInterval(listUndefinedErrorHandlerBS(), 1000)

window.onload = async function(){
    await getParsedData()
    getStats()
}

async function getParsedData(){
    await axios.get('/armorlist').then((res) => getArmorList(res.data.data))
    await axios.get('/weaponlist').then((res) => getWeaponList(res.data.data))
    await axios.get('/racelist').then((res) => getRaceList(res.data.data))
    await axios.get('/classlist').then((res) => getClassList(res.data.data))
}

function clearDatalist(datalistId){
    document.getElementById(datalistId).innerHTML = ''
    document.getElementById('value-starting-gold').innerText = 0
    document.getElementById('value-starting-hp').innerText = 0
}

// Cleaning the die input to get the correct number of dice and sides of the dice being rolled. Also figuring out the correct bonus that needs to be applied to the total.
// Need to fix mage gold input i.e. 1d4+1*10... more than one bonus isnt handle correctly. Work around is if characterStartingGold is < 6... so a mage it does the * 10 afterwards.
function roll(die){
    let bonusRegex = /[-+*/]/
    let bonus = 0
    let mathOperater = ''
    let mathOperaterIndex = 0
   

    if(bonusRegex.test(die)){
        mathOperater = die.match(bonusRegex)[0]
        mathOperaterIndex = die.match(bonusRegex).index
        bonus = die.split(bonusRegex)[1]
        die = die.split(bonusRegex)[0]
    }

    let numDice = die.split('d')[0]
    let dieSides = die.split('d')[1]
    
    return generateRoll(numDice, dieSides, bonus, mathOperater)
}

// Generating the dice rolls and applying the appropriate bonus/modifier.
function generateRoll(numDice, dieSides, bonus, mathOperater){
    let stat = 0
    for (let i = 0; i < numDice; i++) {
        stat += Math.ceil(Math.random() * dieSides)
    }
    switch(mathOperater){
        case '+':
            return stat + Number(bonus)
        case '-':
            return stat - Number(bonus)
        case '*':
            return stat * Number(bonus)
        case '/':
            return stat / Number(bonus)
    }
    return stat + Number(bonus)
}

// Generating the stat values for the 6 base stats.  Also checking the power level of those generated stats.
function getStats(){
   for (let i = 0; i < 6; i++) {
        characterStats[i] = roll('3d6')
    }

    updateStats()

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
    if (Math.abs(document.getElementById("minStats").value) > statTotal || Math.abs(document.getElementById("maxStats").value) < statTotal) getStats()

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

function insertIntoDataList(datalistId, header, sub){
    document.getElementById(datalistId).insertAdjacentHTML("beforeend", `<option value="${header}">${sub}</option>`)
}

function insertIntoEquipmentList(EquipmentListId, header, sub){
    document.getElementById(EquipmentListId).insertAdjacentHTML("beforeend", `<dt class="Equipment">${header}</dt><dd class="Equipment">${sub}</dd>`)
}

// Building the datalist options for armor and weapons.
function fillingArmorList(){
    if(armorList != undefined){
        for (let i = 0; i < armorList.length; i++) {
            if(parseInt(armorList[i].Cost) < characterStartingGold) insertIntoDataList('armorList', armorList[i].Name, `AC: ${armorList[i].AC} | Cost: ${armorList[i].Cost} | Weight: ${armorList[i].Weight}`)
        }
    }
}

function fillingWeaponList(){
    if(weaponList != undefined){
        for (let i = 0; i < weaponList.length; i++) {
            if(parseInt(weaponList[i].Cost) < characterStartingGold) insertIntoDataList('weaponList', weaponList[i].Name, `Cost: ${weaponList[i].Cost} | Weight: ${weaponList[i].Weight}
            | Type: ${weaponList[i].Type} | Speed Factor: ${weaponList[i]['Speed Factor']} | S-M: ${weaponList[i].SM} | L: ${weaponList[i].L}`)
        }
    }
}

function setAC(currentArmor){
    // let armor = document.getElementById("armor").value
    // let currentArmor = armorList.find(wearing => wearing.Name == armor);
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
    clearDatalist('usable-races')
    clearDatalist('usable-classes')
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
    clearDatalist('armorList')
    
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
    clearDatalist('usable-classes')
    for(let i = 0; i < classes.length; i++){
        insertIntoDataList('usable-classes', Object.entries(classes[i])[0][1], '')
    }
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
    characterStartingGold = roll(classJSON['Starting Gold'])
    if(characterStartingGold < 6) characterStartingGold *= 10
    setStartingValues()
    unhidingEquipList()
    fillingArmorList()
    fillingWeaponList()
}

function setStartingValues(){
    document.getElementById('value-starting-gold').innerText = characterStartingGold
    document.getElementById('value-starting-hp').innerText = characterStartingHP
}

function buyingEquipmentPreview(){
    let cost = 0
    let armor = document.getElementById('armor').value
    let weapon = document.getElementById('weapon').value

    if(armor != ''){
        for(let i = 0; i < armorList.length; i++) {
            if(armorList[i].Name == armor){
                cost += parseFloat(armorList[i].Cost)
                setAC(armorList[i].AC)
                break
            } 
        }
    }
    if(weapon != ''){
        for(let i = 0; i < weaponList.length; i++) {
            if(weaponList[i].Name == weapon){
                cost += parseFloat(weaponList[i].Cost)
                break
            } 
        }
    }
    document.getElementById('cost').innerText = cost
}

function buyingEquipment(){
    let cost = parseFloat(document.getElementById('cost').innerText)

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


    document.getElementById('cost').innerText = 0
    document.getElementById('armor').value = ''
    document.getElementById('weapon').value = ''
}






// fun little stat line to test the system.  Remove before pushing.
function noClassOptionsStatLine(){
    characterStats = [8, 6, 18, 7, 8, 8]
    characterStatsBonuses = [0, 0, 0, 0, 0, 0]
    updateStats()
    if(document.getElementById('selected-race') != null) document.getElementById('selected-race').value = ''
    if(document.getElementById('selected-class') != null) document.getElementById('selected-class').value = ''

    powerCheck(characterStats.reduce((a,b) => a + b))
}

// Remove later
function listUndefinedErrorHandlerBS(){
    if(raceList) {
        clearInterval(undefinedBS)
        console.error('Undefined BS happened again.')
    }
    if(raceList == undefined) axios.get('/racelist').then((res) => getRaceList(res.data.data))
    raceOptions()
}

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