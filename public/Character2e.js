let armorList = undefined
let weaponList = undefined

window.onload = function(){
    populateEquipmentList()
}

function roll() {
    let stat = 0
    for (let i = 0; i < 3; i++) {
        stat += Math.ceil(Math.random() * 6)
    }
    return stat
}

function getStats() {
    const statValues = document.getElementsByClassName("statVal")

    for (let i = 0; i < statValues.length; i++) {
        statValues[i].innerHTML = roll()
    }

    powerCheck(statValues)
}

function powerCheck(statValues) {
    let statTotal = 0

    for (let i = 0; i < statValues.length; i++) {
        statTotal += Math.abs(statValues[i].innerHTML)
    }

    if (Math.abs(document.getElementById("minStats").value) > statTotal || Math.abs(document.getElementById("maxStats").value) < statTotal) {
        getStats()
    } else {
        document.getElementById("totalStats").innerHTML = statTotal
    }
}

function populateEquipmentList(){
    axios.get('/armorlist').then((res) => fillingArmorList(res.data.data))
    axios.get('/weaponlist').then((res) => fillingWeaponList(res.data.data))
}

function fillingArmorList(armorListJSON) {
    armorList = armorListJSON
    //armorList = armorList.sort(compare)
    console.log(armorList)

    for (let i = 0; i < armorList.length; i++) {
        document.getElementById("armor").insertAdjacentHTML("beforeend", '<option value="' + armorList[i].Name + '"></option>')
    }
}

function fillingWeaponList(weaponListJSON) {
    weaponList = weaponListJSON
    //weaponList = weaponList.sort(compare)
    for (let i = 0; i < weaponList.length; i++) {
        document.getElementById("weapon").insertAdjacentHTML("beforeend", '<option value="' + weaponList[i].Name + '"></option>')
    }
}

function setAC(){
    let armor = document.getElementById("armorList").value
    let currentArmor = armorList.find(wearing => wearing.Name == armor);

    console.log(currentArmor)	

    document.getElementById("armorClassVal").innerHTML = currentArmor.AC 
}

function compare(a, b){
    const itemA = a.Name
    const itemB = b.Name

    let comparison = 0
    if(itemA > itemB){
        comparison = 1
    } else if(itemA < itemB){
        comparison = -1
    }
    return comparison
}