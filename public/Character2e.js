let armorList = undefined

window.onload = function(){
    populateArmorList()
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

function fillingEquipmentList(armorListJSON) {
    armorList = armorListJSON
    for (let i = 0; i < armorList.length; i++) {
        document.getElementById("armor").insertAdjacentHTML("afterbegin", '<option value="' + armorList[i].Name + '"></option>')
    }
}

function setAC(){
    let armor = document.getElementById("armorList").value
    let currentArmor = armorList.find(wearing => wearing.Name === armor);

    console.log(currentArmor)	

    document.getElementById("armorClassVal").innerHTML = currentArmor.AC 
}

function populateArmorList(){
    axios.get('/papa').then((res) => fillingEquipmentList(res.data.data))
}