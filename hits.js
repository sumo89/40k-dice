var chanceOfHit = 0, chanceOfWound = 0, totalAttacks = 0, 
totalHits = 0, totalWounds = 0, failedSaves = 0, 
failedInvulns = 0, totalDamage = 0, additionalWounds = 0,
saveChance = 0, totalSavedWounds = 0, totalDamage = 0, killedModels = 0, totalFailedWoundSaves = 0,

/////////// Set the defending and attacking units here, data sheets are in data.js
attacker = PossibleUnits.VANVETPFIST;
defender = PossibleUnits.PLAGUEMARINE;

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
console.log('Attacker: ', attacker.name, ' x ', attacker.models);
console.log('Defender: ', defender.name);

(function getTotalAttacks(){
    // total amount of attacks + 1 for seargeant
    totalAttacks = attacker.models * attacker.attacks +1;
    console.log('totalAttacks ', totalAttacks);
})();

(function setHitChance(){
    chanceOfHit = 1 - ((attacker.ws-1) / 6);
    console.log('chanceOfHit ', chanceOfHit);
})();

(function getTotalHits(){
    initialHits = totalAttacks * chanceOfHit;
    console.log('initialHits ', initialHits);

     // if any hit modifiers
     if (attacker.hitMod.length > 0){
        if (attacker.hitMod === Hitmods.ALL){
             //  amount of failed hits then run through the same percent chance
             var missedHits = totalAttacks - initialHits;
             console.log('missedHits ', missedHits);
             var additionalHits = missedHits * chanceOfHit;
             console.log('additionalHits ', additionalHits);
             totalHits = initialHits + additionalHits;
             console.log('totalHits w/ all reroll', totalHits);
        }
        if (attacker.hitMod === Hitmods.ONES){
            var missedHits = totalAttacks - initialHits;
            // get 1/6 of the missed hits and reroll them with same chance to hit
            var missedOnes = missedHits * Percents.ONESIXTH;
            var additionalHits = missedOnes * chanceOfHit;
            totalHits = initialHits + additionalHits;
            console.log('totalHits w/ ones reroll', totalHits);
        }
        if (attacker.hitMod === Hitmods.MINUSONE){
            // remove 1/6 of the hits as they would be 1s
            totalHits = initialHits * Percents.FIVESIXTHS;
            console.log('totalHits w/ minus one to hit ', totalHits);
        }
    }
    else {
        totalHits = initialHits;
        console.log('totalHits ', totalHits);
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
})();

(function getTotalWounds(){
    // wounds based on hits by strength/toughness
    initialWounds = totalHits * chanceOfWound;
    console.log('chanceOfWound ', chanceOfWound);
    console.log('initialWounds ', initialWounds);

    if (attacker.woundMod.length > 0){
        if (attacker.woundMod === Woundmods.ALL){
            //  amount of failed wounds then run through the same percent chance
            var missedWounds = totalHits - initialWounds;
            console.log('missedWounds ', missedWounds);
            var additionalWounds = missedWounds * chanceOfWound;
            console.log('additionalWounds ', additionalWounds);
            totalWounds = initialWounds + additionalWounds;
            console.log('totalWounds w/ all reroll', totalWounds);
        }
        if (attacker.woundMod === Woundmods.ONES){
            var missedWounds = totalHits - initialWounds;
            // get 1/6 of the missed hits and reroll them with same chance to hit
            var missedOnes = missedWounds * Percents.ONESIXTH;
            var additionalWounds = missedOnes * chanceOfWound;
            totalWounds = initialWounds + additionalWounds;
            console.log('totalWounds w/ ones reroll', totalWounds);

        }
        if (attacker.woundMod === Woundmods.MINUSONE){
             // remove 1/6 of the hits as they would be 1s
             totalWounds = initialWounds * Percents.FIVESIXTHS;
             console.log('totalWounds w/ minus one to wound ', totalWounds);
        }
    }
    else {
        totalWounds = initialWounds;
        console.log('totalWounds ', totalWounds);
    }
})();

(function getSaveChance(){
    saveChance = 1 - ((defender.save-1) / 6);
    console.log('saveChance ', saveChance);

    if (attacker.ap > 0){
        // multiple each point of AP by 1/6
        apPercent = attacker.ap * Percents.ONESIXTH;
        saveChance -= apPercent;
        console.log('saveChance w/ ap', saveChance);

    }
})();

(function getFailedSaves(){
    totalSavedWounds = totalWounds * saveChance;
    totalFailedWoundSaves = totalWounds * (1 - saveChance);
    // console.log('totalSavedWounds ', totalSavedWounds);
    console.log('totalFailedWoundSaves ', totalFailedWoundSaves);
})();
(function getDamage(){
    // total number of damage
    totalDamage = totalFailedWoundSaves * attacker.damage;
    console.log('totalDamage ', totalDamage);
    // number of killed units
    killedModels = '';
    if (defender.wounds === attacker.damage ||
        defender.wounds < attacker.damage){
        // if each attack does the same or more damage as the defender's wounds then each kills one
        killedModels = totalFailedWoundSaves;
        console.log('defender wounds ', defender.wounds);
        console.log('attacker damage ', attacker.damage);
        console.log('!!! killedModels, wounds == damage', killedModels);
        console.log(' ');
    }
    else if (defender.wounds > attacker.damage){
        // if each defender has more wounds than the damage
        // e.g. wounds = 3, damage = 2
        // work out how many attacks to kill each unit
        var attacksPerDefender = Math.ceil(defender.wounds / attacker.damage);
        console.log('defender wounds ', defender.wounds);
        console.log('attacker damage ', attacker.damage);
        console.log('attacksPerDefender ', attacksPerDefender);
        killedModels = totalFailedWoundSaves / attacksPerDefender;
        console.log('!!! killedModels, wounds > damage', killedModels);
        console.log(' ');
    }
})();
