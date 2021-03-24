let armorList = undefined
let weaponList = undefined
let raceList = undefined

window.onload = async function(){
    await populateEquipmentList()
    getStats()
}

// Cleaning the die input to get the correct number of dice and sides of the dice being rolled. Also figuring out the correct bonus that needs to be applied to the total.

function rollCleaning(die){
let bonusRegex = /[-+*/]/
    let bonus = 0
    let mathOperater = ''
   

    if(bonusRegex.test(die)){
        mathOperater = die.match(bonusRegex)[0]
        bonus = die.split(bonusRegex)[1]
        die = die.split(bonusRegex)[0]
    }

    let numDice = die.split('d')[0]
    let dieSides = die.split('d')[1]

    return roll(numDice, dieSides, bonus, mathOperater)
}

// Generating the dice rolls and applying the appropriate bonus/modifier.

function roll(numDice, dieSides, bonus, mathOperater) {
    let stat = 0
    for (let i = 0; i < numDice; i++) {
        stat += Math.ceil(Math.random() * dieSides)
    }
    switch(mathOperater){
        case '+':
            return stat + Number(bonus)
            break
        case '-':
            return stat - Number(bonus)
            break
        case '*':
            return stat * Number(bonus)
            break
        case '/':
            return stat / Number(bonus)
            break
    }
    return stat + Number(bonus)
}

// Generating the stat values for the 6 base stats.  Also checking the power level of those generated stats.

function getStats() {
    const statValues = document.getElementsByClassName("statVal")

    for (let i = 0; i < statValues.length; i++) {
        statValues[i].innerHTML = rollCleaning('3d6')
    }
    powerCheck(statValues)
}

// Checking the power level of the generated character based on the given values.

function powerCheck(statValues) {
    let statTotal = 0

    for (let i = 0; i < statValues.length; i++) {
        statTotal += Math.abs(statValues[i].innerHTML)
    }

    if (Math.abs(document.getElementById("minStats").value) > statTotal || Math.abs(document.getElementById("maxStats").value) < statTotal) {
        getStats()
    } else {
        document.getElementById("totalStats").innerHTML = statTotal
        raceAndClassOptions()
    }
}

async function populateEquipmentList(){
    await axios.get('/armorlist').then((res) => fillingArmorList(res.data.data))
    await axios.get('/weaponlist').then((res) => fillingWeaponList(res.data.data))
    await axios.get('/racelist').then((res) => assigningRaceList(res.data.data))
}

// Building the datalist options for armor and weapons.

function fillingArmorList(armorListJSON) {
    if(armorList == undefined) armorList = armorListJSON
    for (let i = 0; i < armorList.length; i++) {
        insertIntoDataList('armor', armorList[i].Name, `AC: ${armorList[i].AC} | Cost: ${armorList[i].Cost} | Weight: ${armorList[i].Weight}`)
    }
}

function insertIntoDataList(datalistId, header, sub){
    document.getElementById(datalistId).insertAdjacentHTML("beforeend", `<option value="${header}">${sub}</option>`)
}

function fillingWeaponList(weaponListJSON) {
    weaponList = weaponListJSON
    if(weaponList == undefined) 
    for (let i = 0; i < weaponList.length; i++) {
        insertIntoDataList('weapon', weaponList[i].Name, `Cost: ${weaponList[i].Cost} | Weight: ${weaponList[i].Weight}
        | Type: ${weaponList[i].Type} | Speed Factor: ${weaponList[i]['Speed Factor']} | S-M: ${weaponList[i].SM} | L: ${weaponList[i].L}`)
    }
}

function setAC(){
    let armor = document.getElementById("armorList").value
    let currentArmor = armorList.find(wearing => wearing.Name == armor);
    document.getElementById("armorClassVal").innerHTML = currentArmor.AC 
}

function assigningRaceList(raceListJSON){
    if(raceList == undefined) raceList = raceListJSON
}

function raceAndClassOptions(){
    const statValues = document.getElementsByClassName("statVal")
    let possibleRaces = []
    const reqRange = 7

    // Testing the generated stats against the stat ranges that are required to be able to choose a certain race.
    for(let i = 0; i < raceList.length; i++){
        let raceRecord = Object.entries(raceList[i])
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
    isActualRace(possibleRaces)
}

function isActualRace(raceRecordsOfActualRaces){
    // For the Races that pass all 6 requirements, they are added to an array of actual races that can be applied to the generated statline.
    clearDatalist('usable-races')
    for(let i = 0; i < raceRecordsOfActualRaces.length; i++){
            let raceBonusArray = getRaceBonus(raceRecordsOfActualRaces[i])
            insertIntoDataList('usable-races', raceRecordsOfActualRaces[i][0][1], `${raceBonusArray[0]} ${raceBonusArray[1]}`)
    }
}

function getRaceBonus(race){
    const statBonusRangeStart = 7
    const statBonusRangeEnd = 13

    let bonus = []
    for(let j = statBonusRangeStart; j < statBonusRangeEnd; j++){
            let statBonus = race[j]
            if(statBonus[1] != 0) bonus.push(statBonus)
    }
    if(bonus.length == 0) return ['No','Race Bonus']
    return bonus
}

function clearDatalist(datalistId){
    document.getElementById(datalistId).innerHTML = ''
}

// function compare(a, b){
//     const itemA = a.Name
//     const itemB = b.Name

//     let comparison = 0
//     if(itemA > itemB){
//         comparison = 1
//     } else if(itemA < itemB){
//         comparison = -1
//     }
//     return comparison
// }