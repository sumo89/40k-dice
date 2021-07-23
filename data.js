var Percents = {
    ONESIXTH: 0.1666666666666,
    ONETHIRD: 0.33333333333333,
    HALF: 0.5,
    TWHOTHIRDS: 0.666666666666,
    FIVESIXTHS: 0.83333333333
}, 
Hitmods = {
    ALL: 'all',
    ONES: 'ones',
    MINUSONE: 'minus one'
},
Woundmods = {
    ALL: 'all',
    ONES: 'ones',
    MINUSONE: 'minus one'
}, 
PossibleUnits = {
    VANVET: {
        name: 'Vanguard Veteran w/Lightning Claw',
        models: 8,
        attacks: 4,
        ws: 3,
        strength: 4,
        ap: 2,
        damage: 1,
        hitMod: '',
        woundMod: Woundmods.ALL
    },
    VANVETPFIST: {
        name: 'Vanguard Veteran w/Power Fist',
        models: 8,
        attacks: 3,
        ws: 3,
        strength: 4,
        ap: 2,
        damage: 2,
        hitMod: Hitmods.MINUSONE,
        woundMod: ''
    },
    TERMINATORASSAULT: {
        name: 'Terminator Assault Squad w/Thunder Hammers',
        models: 5,
        attacks: 3,
        ws: 3,
        strength: 8,
        ap: 2,
        damage: 3,
        hitMod: Hitmods.MINUSONE,
        woundMod: ''
    },
    PLAGUEMARINE: {
        name: 'Plage Marine',
        toughness: 5,
        save: 3,
        wounds: 2,
        invulnerable: 0
    },
    CARNIFEX: {
        name: 'Carnifex',
        toughness: 7,
        save: 3,
        wounds: 8,
        invulnerable: 0
    }
}