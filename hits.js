var chanceOfHit = 0, chanceOfWound = 0, totalAttacks = 0, 
totalHits = 0, totalWounds = 0, failedSaves = 0, invulnChance = 0, 
failedInvulns = 0, totalDamage = 0, additionalWounds = 0,
saveChance = 0, totalSavedWounds = 0, totalDamage = 0, killedModels = 0, totalFailedWoundSaves = 0,
attackerDamage, attackerAP;

// hit chance
// amount of hits
// wound chance
// amount of wounds
// save chance
// amount of saves
// invuln save chance
// amount of invuln saves
// total damage
// total kills


var attackerSelect = document.getElementById('attacker-select'),
    defenderSelect = document.getElementById('defender-select'),
    assaultSelect = document.getElementById('assault-select'),
    chargedSelect = document.getElementById('charged-select'),
    whiteScarsSelect = document.getElementById('whitescars-select'),
    formSubmit = document.getElementById('submit');
    formSubmit = document.getElementById('form');

(function appendOptionsToHTML(){
    // append the options in to the drop downs for attack and defender
    for (var item in PossibleUnits){
        var optionName = PossibleUnits[item].name,
            newOption = document.createElement('option'),
            newOption2 = document.createElement('option');
        newOption.value = item;
        newOption2.value = item;
        newOption.innerHTML = optionName;
        newOption2.innerHTML = optionName;
        attackerSelect.appendChild(newOption);
        defenderSelect.appendChild(newOption2);
    }
})();

form.onsubmit = function(event){
    event.preventDefault();
    // get the values of attackerSelect, defenderSelect, whiteScarsSelect and assaultSelect
    attacker = attackerSelect.value,
    defender = defenderSelect.value,
    inAssaultPhase = assaultSelect.value,
    isWhiteScars = whiteScarsSelect.value,
    hasCharged = chargedSelect.value,
    runStats(PossibleUnits[attacker], PossibleUnits[defender], inAssaultPhase, isWhiteScars);
};

// if inAssaultPhase - ap+1
// if isWhiteScars && inAssaultPhase - ap+1, damage+1
// if hasCharged - attacks+1


function runStats(attacker, defender, inAssaultPhase, isWhiteScars){
    attackerDamage = attacker.damage,
    attackerAP = attacker.ap,
    attackerAttacks = attacker.attacks;

    console.log('Attacker: ', attacker.name, ' x ', attacker.models);
    console.log('Defender: ', defender.name);
    console.log('in assault phase ? ', inAssaultPhase);
    console.log('is white scars ? ', isWhiteScars);
    console.log('has charged ? ', hasCharged);

    if (inAssaultPhase === 'true'){
        attackerAP = attackerAP +1
        if (isWhiteScars){
            attackerDamage = attackerDamage +1;
        }
    }
    if (hasCharged === 'true'){
        attackerAttacks = attackerAttacks +1;
    }


    document.getElementById('header').innerText = '';
    document.getElementById('attacking-unit').innerText = attacker.name, ' x ', attacker.models;
    document.getElementById('defending-unit').innerText = defender.name;

    (function getTotalAttacks(){
        totalAttacks = (attacker.models * attackerAttacks)
        // total amount of attacks + 1 for seargeant
        if (attacker.models > 1){
            totalAttacks = totalAttacks +1;
        }
        console.log('totalAttacks ', Math.round(totalAttacks * 100)/ 100);
    })();

    (function setHitChance(){
        chanceOfHit = 1 - ((attacker.ws-1) / 6);
        console.log('chanceOfHit ', Math.round(chanceOfHit * 100)/ 100);
    })();

    (function getTotalHits(){
        if (attacker.hitMod && attacker.hitMod.length > 0){
            if (attacker.hitMod === Hitmods.PLUSONE && chanceOfHit < 0.8){
                // if +1 to hit, add 1/6 to the chance of the roll
                chanceOfHit = chanceOfHit + Percents.ONESIXTH;
                console.log('chanceOfHit with +1 to hit ', Math.round(chanceOfHit * 100)/ 10)
            }
            if (attacker.hitMod === Hitmods.MINUSONE && chanceOfHit > 0.16){
                // if -1 to hit, minus 1/6 from the chance of the roll
                chanceOfHit = chanceOfHit - Percents.ONESIXTH;
                console.log('chanceOfHit with -1 to hit ', Math.round(chanceOfHit * 100)/ 100)
            }
        }

        initialHits = totalAttacks * chanceOfHit;
        console.log('initialHits ', Math.round(initialHits * 100)/ 100);

        // if any hit modifiers
        if (attacker.hitMod && attacker.hitMod.length > 0){
            if (attacker.hitMod === Hitmods.ALL){
                // reroll any failed
                //  amount of failed hits then run through the same percent chance
                var missedHits = totalAttacks - initialHits;
                console.log('missedHits ', Math.round(missedHits * 100)/ 100);
                var additionalHits = missedHits * chanceOfHit;
                console.log('additionalHits ', Math.round(additionalHits * 100)/ 100);
                totalHits = initialHits + additionalHits;
                console.log('totalHits w/ all reroll', Math.round(totalHits * 100)/ 100);
            }
            else if (attacker.hitMod === Hitmods.ONES){
                var missedHits = totalAttacks - initialHits;
                // reroll 1s
                // get 1/6 of the missed hits and reroll them with same chance to hit
                var missedOnes = missedHits * Percents.ONESIXTH;
                var additionalHits = missedOnes * chanceOfHit;
                totalHits = initialHits + additionalHits;
                console.log('totalHits w/ ones reroll', Math.round(totalHits * 100)/ 100);
            }
            else {
                totalHits = initialHits;
                console.log('totalHits ', Math.round(totalHits * 100)/ 100);
            }
        }
        else {
            totalHits = initialHits;
            console.log('totalHits ', Math.round(totalHits * 100)/ 100);
        }
    })();

    (function setChanceToWound(){
        stengthToToughness = attacker.strength / defender.toughness;
        console.log('stengthToToughness ', stengthToToughness);
        // if toughness == strength
        // 4s to wound 1/2
        if (stengthToToughness === 1){
            chanceOfWound = Percents.HALF;
        }
        // if strength is half toughness or less
        // 6s to wound 1/6
        else if (stengthToToughness <= 0.5){
            chanceOfWound = Percents.ONESIXTH;
        }
        // if strength is double toughness or less
        // 2s to wound 5/6
        else if (stengthToToughness >= 2){
            chanceOfWound = Percents.FIVESIXTHS;
        }
        // if strength less than toughness but not half 
        // 5s to wound 1/3
        else if (stengthToToughness < 1 && stengthToToughness > 0.5){
            chanceOfWound = Percents.ONETHIRD;
        }
        // if strength greater than toughness but not double 
        // 3s to wound 2/3
        else if (stengthToToughness < 2 && stengthToToughness > 0){
            chanceOfWound = Percents.TWHOTHIRDS;
        }
        console.log('set chanceOfWound ', chanceOfWound);
    })();

    (function getTotalWounds(){
        if (attacker.woundMod && attacker.woundMod.length > 0 ){
            if (attacker.woundMod === Woundmods.PLUSONE && chanceOfWound < 0.8){
                // if the wound roll is +1, increase the chance by 1/6
                // unless the chance is already 5/6 as rolls of 1 always fail
                chanceOfWound = chanceOfWound + Percents.ONESIXTH;
                console.log('chanceOfWound with +1 to wound ', chanceOfWound);
            }
        }

        // wounds based on hits by strength/toughness
        initialWounds = totalHits * chanceOfWound;
        console.log('chanceOfWound ', Math.round(chanceOfWound * 100)/ 100);
        console.log('initialWounds ', Math.round(initialWounds * 100)/ 100);

        if (attacker.woundMod && attacker.woundMod.length > 0){
            if (attacker.woundMod === Woundmods.ALL){
                //  amount of failed wounds then run through the same percent chance
                var missedWounds = totalHits - initialWounds;
                console.log('missedWounds ', Math.round(missedWounds * 100)/ 100);
                var additionalWounds = missedWounds * chanceOfWound;
                console.log('additionalWounds ', Math.round(additionalWounds * 100)/ 100);
                totalWounds = initialWounds + additionalWounds;
                console.log('totalWounds w/ all reroll', Math.round(totalWounds * 100)/ 100);
            }
            else if (attacker.woundMod === Woundmods.ONES){
                var missedWounds = totalHits - initialWounds;
                // get 1/6 of the missed hits and reroll them with same chance to hit
                var missedOnes = missedWounds * Percents.ONESIXTH;
                var additionalWounds = missedOnes * chanceOfWound;
                totalWounds = initialWounds + additionalWounds;
                console.log('totalWounds w/ ones reroll', Math.round(totalWounds * 100)/ 100);
            }
            else {
                totalWounds = initialWounds;
                console.log('totalWounds ', Math.round(totalWounds * 100)/ 100);
            }
            if (attacker.woundMod === Woundmods.MINUSONE){
                // remove 1/6 of the hits as they would be 1s
                totalWounds = initialWounds * Percents.FIVESIXTHS;
                console.log('totalWounds w/ minus one to wound ', Math.round(totalWounds * 100)/ 100);
            }
        }
        else {
            totalWounds = initialWounds;
            console.log('totalWounds ', Math.round(totalWounds * 100)/ 100);
        }
    })();

    (function getSaveChance(){
        saveChance = 1 - ((defender.save-1) / 6);
        console.log('saveChance ', Math.round(saveChance * 100)/ 100);

        if (attackerAP > 0){
            // multiple each point of AP by 1/6
            apPercent = attackerAP * Percents.ONESIXTH;
            saveChance -= apPercent;
            if (saveChance < 0){
                saveChance = 0;
            }
            console.log('saveChance w/ ap', Math.round(saveChance * 100)/ 100);
        }

        // check if invuln save is better than normal save
        if (defender.invulnerable){
            invulnChance = 1 - ((defender.invulnerable-1) / 6);
            console.log('invulnChance ', invulnChance);
        }
        if (invulnChance > saveChance){
            saveChance = invulnChance;
            console.log('using invulnChance ', invulnChance);
        }
    })();

    (function getFailedSaves(){
        totalSavedWounds = totalWounds * saveChance;
        totalFailedWoundSaves = totalWounds * (1 - saveChance);
        // console.log('totalSavedWounds ', totalSavedWounds);
        console.log('totalFailedWoundSaves ', Math.round(totalFailedWoundSaves * 100)/ 100);
        document.getElementById('failed-saves').innerText = Math.round(totalFailedWoundSaves * 100)/ 100;
    })();

    (function getDamage(){
        // total number of damage
        if (defender.damageMod && defender.damageMod.length > 0 && attackerDamage > 1){
            // if the defender has -1 to damage, then minus the amount of unsaved wounds from the total damage
            if (defender.damageMod === Damagemods.MINUSONE){
                attackerDamage --;
                console.log('defender has minus 1 to damage, new attacker damager: ', attackerDamage)
            }
        }
        totalDamage = totalFailedWoundSaves * attackerDamage;
        console.log('totalDamage ', Math.round(totalDamage * 100)/ 100);
        document.getElementById('damage').innerText = Math.round(totalDamage * 100)/ 100;

        // number of killed units
        killedModels = '';

        var attacksPerDefenderElement = document.getElementById('attacksPerDefender');
        
        if (defender.wounds === attackerDamage ||
            defender.wounds < attackerDamage){
            // if each attack does the same or more damage as the defender's wounds then each kills one
            killedModels = totalFailedWoundSaves;
            attacksPerDefenderElement.innerText = 1;
            console.log('defender wounds ', defender.wounds);
            console.log('attacker damage ', attackerDamage);
            console.log('!!! killedModels, wounds == damage', Math.round(killedModels * 100)/ 100);
            console.log(' ');
            document.getElementById('kills').innerText = Math.round(killedModels * 100)/ 100;
        }
        else if (defender.wounds > attackerDamage){
            // if each defender has more wounds than the damage
            // e.g. wounds = 3, damage = 2
            // work out how many attacks to kill each unit
            var attacksPerDefender = Math.ceil(defender.wounds / attackerDamage);
            attacksPerDefenderElement.innerText = Math.round(attacksPerDefender * 100)/ 100;
            console.log('defender wounds ', defender.wounds);
            console.log('attacker damage ', attackerDamage);
            console.log('attacksPerDefender ', attacksPerDefender);
            killedModels = totalFailedWoundSaves / attacksPerDefender;
            console.log('!!! killedModels, wounds > damage', Math.round(killedModels * 100)/ 100);
            console.log(' ');
            document.getElementById('kills').innerText = Math.round(killedModels * 100)/ 100;
        }
    })();


    

}
