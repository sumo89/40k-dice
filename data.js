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
Damagemods = {
    MINUSONE: 'minus one'
},
PossibleUnits = {
    VANVET: {
        name: 'Vanguard Veteran w/Lightning Claw',
        models: 8,
        attacks: 3,
        ws: 3,
        strength: 4,
        toughness: 4,
        ap: 2,
        damage: 1,
        hitMod: '',
        woundMod: Woundmods.ALL,
        save: 2,
        invulnerable: 4,
        wounds: 2
    },
    VANVETPFIST: {
        name: 'Vanguard Veteran w/Power Fist',
        models: 8,
        attacks: 2,
        ws: 3,
        strength: 4,
        toughness: 4,
        ap: 2,
        damage: 2,
        hitMod: Hitmods.MINUSONE,
        woundMod: '',
        save: 2,
        invulnerable: 4,
        wounds: 2
    },
    VANVETHAMMER: {
        name: 'Vanguard Veteran w/Heavy Hammer',
        models: 1,
        attacks: 2,
        ws: 3,
        strength: 8,
        ap: 3,
        damage: 4,
        hitMod: Hitmods.MINUSONE,
        woundMod: '',
        toughness: 4,
        save: 2,
        invulnerable: 4,
        wounds: 2
    },
    TERMINATORASSAULT: {
        name: 'Terminator Assault Squad w/Thunder Hammers',
        models: 5,
        attacks: 2,
        ws: 3,
        strength: 8,
        ap: 2,
        damage: 3,
        hitMod: Hitmods.MINUSONE,
        woundMod: '',
        toughness: 4,
        save: 2,
        invulnerable: 4,
        wounds: 3
    },
    INTERCESSOR: {
        name: 'Intercessors',
        models: 5,
        attacks: 2,
        ws: 3,
        strength: 4,
        ap: 0,
        damage: 1,
        toughness: 4,
        save: 3,
        wounds: 2,
        invulnerable: 0,
        hitMod: '',
        woundMod: ''
    },
    PLAGUEMARINE: {
        name: 'Plague Marine',
        toughness: 5,
        save: 3,
        wounds: 2,
        invulnerable: 0,
        damageMod: Damagemods.MINUSONE,
        strength: 4,
        attacks: 2,
        ap: 1,
        damage: 1
    },
    CARNIFEX: {
        name: 'Carnifex',
        toughness: 7,
        save: 3,
        wounds: 8,
        invulnerable: 0,
        strength: 6,
        attacks: 4,
        ap: 3,
        damage: 3
    },
    HORAMGAUNTS: {
        name: 'Hormagaunts',
        toughness: 3,
        save: 6,
        wounds: 1,
        invulnerable: 0,
        strength: 3,
        attacks: 2,
        ap: 0,
        damage: 1
    },
    PBC: {
        name: 'Plagueburst Crawler',
        toughness: 8,
        save: 3,
        wounds: 12,
        invulnerable: 5,
        damageMod: Damagemods.MINUSONE,
        strength: 7,
        attacks: 4,
        ap: 0,
        damage: 1
    },
    DEATHSHROUD: {
        name: 'Deathshroud Terminators',
        toughness: 5,
        save: 2,
        wounds: 3,
        invulnerable: 4,
        damageMod: Damagemods.MINUSONE,
        strength: 7,
        attacks: 4,
        ap: 3,
        damage: 2
    }
}