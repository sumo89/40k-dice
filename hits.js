var chanceOfHit = 0, chanceOfWound = 0, totalAttacks = 0, 
totalHits = 0, totalWounds = 0, failedSaves = 0, 
failedInvulns = 0, totalDamage = 0, additionalWounds = 0,
saveChance = 0, totalSavedWounds = 0, totalDamage = 0, killedModels = 0, totalFailedWoundSaves = 0,
attackerDamage, attackerAP,

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

/////////// Set the defending and attacking units here, data sheets are in data.js
attacker = PossibleUnits.TERMINATORASSAULT,
defender = PossibleUnits.PLAGUEMARINE,
inAssaultPhase = false,
inWhiteScarsAssault = false;


attackerAttacks = inAssaultPhase ? attacker.attacks + 1 : attacker.attacks;
attackerDamage = inWhiteScarsAssault ? attacker.damage + 1 : attacker.damage;
attackerAP = inWhiteScarsAssault ? attacker.ap + 1 : attacker.ap;

console.log('Attacker: ', attacker.name, ' x ', attacker.models);
console.log('Defender: ', defender.name);
console.log('inWhiteScarsAssault ? ', inWhiteScarsAssault);

(function getTotalAttacks(){
    // total amount of attacks + 1 for seargeant
    totalAttacks = (attacker.models * attackerAttacks) +1;
    console.log('totalAttacks ', Math.round(totalAttacks * 100)/ 100);
})();

(function setHitChance(){
    chanceOfHit = 1 - ((attacker.ws-1) / 6);
    console.log('chanceOfHit ', Math.round(chanceOfHit * 100)/ 100);
})();

(function getTotalHits(){
    initialHits = totalAttacks * chanceOfHit;
    console.log('initialHits ', Math.round(initialHits * 100)/ 100);

     // if any hit modifiers
     if (attacker.hitMod.length > 0){
        if (attacker.hitMod === Hitmods.ALL){
             //  amount of failed hits then run through the same percent chance
             var missedHits = totalAttacks - initialHits;
             console.log('missedHits ', Math.round(missedHits * 100)/ 100);
             var additionalHits = missedHits * chanceOfHit;
             console.log('additionalHits ', Math.round(additionalHits * 100)/ 100);
             totalHits = initialHits + additionalHits;
             console.log('totalHits w/ all reroll', Math.round(totalHits * 100)/ 100);
        }
        if (attacker.hitMod === Hitmods.ONES){
            var missedHits = totalAttacks - initialHits;
            // get 1/6 of the missed hits and reroll them with same chance to hit
            var missedOnes = missedHits * Percents.ONESIXTH;
            var additionalHits = missedOnes * chanceOfHit;
            totalHits = initialHits + additionalHits;
            console.log('totalHits w/ ones reroll', Math.round(totalHits * 100)/ 100);
        }
        if (attacker.hitMod === Hitmods.MINUSONE){
            // remove 1/6 of the hits as they would be 1s
            totalHits = initialHits * Percents.FIVESIXTHS;
            console.log('totalHits w/ minus one to hit ', Math.round(totalHits * 100)/ 100);
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
})();

(function getTotalWounds(){
    // wounds based on hits by strength/toughness
    initialWounds = totalHits * chanceOfWound;
    console.log('chanceOfWound ', Math.round(chanceOfWound * 100)/ 100);
    console.log('initialWounds ', Math.round(initialWounds * 100)/ 100);

    if (attacker.woundMod.length > 0){
        if (attacker.woundMod === Woundmods.ALL){
            //  amount of failed wounds then run through the same percent chance
            var missedWounds = totalHits - initialWounds;
            console.log('missedWounds ', Math.round(missedWounds * 100)/ 100);
            var additionalWounds = missedWounds * chanceOfWound;
            console.log('additionalWounds ', Math.round(additionalWounds * 100)/ 100);
            totalWounds = initialWounds + additionalWounds;
            console.log('totalWounds w/ all reroll', Math.round(totalWounds * 100)/ 100);
        }
        if (attacker.woundMod === Woundmods.ONES){
            var missedWounds = totalHits - initialWounds;
            // get 1/6 of the missed hits and reroll them with same chance to hit
            var missedOnes = missedWounds * Percents.ONESIXTH;
            var additionalWounds = missedOnes * chanceOfWound;
            totalWounds = initialWounds + additionalWounds;
            console.log('totalWounds w/ ones reroll', Math.round(totalWounds * 100)/ 100);

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
        console.log('saveChance w/ ap', Math.round(saveChance * 100)/ 100);

    }
})();

(function getFailedSaves(){
    totalSavedWounds = totalWounds * saveChance;
    totalFailedWoundSaves = totalWounds * (1 - saveChance);
    // console.log('totalSavedWounds ', totalSavedWounds);
    console.log('totalFailedWoundSaves ', Math.round(totalFailedWoundSaves * 100)/ 100);
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

    // number of killed units
    killedModels = '';
    
    if (defender.wounds === attackerDamage ||
        defender.wounds < attackerDamage){
        // if each attack does the same or more damage as the defender's wounds then each kills one
        killedModels = totalFailedWoundSaves;
        console.log('defender wounds ', defender.wounds);
        console.log('attacker damage ', attackerDamage);
        console.log('!!! killedModels, wounds == damage', Math.round(killedModels * 100)/ 100);
        console.log(' ');
    }
    else if (defender.wounds > attackerDamage){
        // if each defender has more wounds than the damage
        // e.g. wounds = 3, damage = 2
        // work out how many attacks to kill each unit
        var attacksPerDefender = Math.ceil(defender.wounds / attackerDamage);
        console.log('defender wounds ', defender.wounds);
        console.log('attacker damage ', attackerDamage);
        console.log('attacksPerDefender ', attacksPerDefender);
        killedModels = totalFailedWoundSaves / attacksPerDefender;
        console.log('!!! killedModels, wounds > damage', Math.round(killedModels * 100)/ 100);
        console.log(' ');
    }
})();
