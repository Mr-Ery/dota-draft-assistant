export const HERO_BUILD_ARCHETYPES = {
  illusionCarry: {
    appliesTo: ["Phantom Lancer", "Naga Siren", "Terrorblade", "Chaos Knight"],
    coreIdea: "Illusion carries need stat efficiency, dispel, illusion uptime, and anti-AoE adaptation.",
    defaultItems: ["power_treads", "diffusal_blade", "manta", "heart", "eye_of_skadi"],
    enemyAdjustments: {
      aoe: ["black_king_bar", "heart"],
      silence: ["manta", "black_king_bar"],
      evasion: ["bloodthorn"],
      healing: ["eye_of_skadi"]
    }
  },
  blinkInitiator: {
    appliesTo: ["Axe", "Centaur Warrunner", "Mars", "Magnus", "Tidehunter", "Enigma", "Sand King"],
    coreIdea: "Blink initiators need timing, survivability, and enemy-damage-type answers.",
    defaultItems: ["blink", "black_king_bar", "pipe", "shivas_guard", "refresher"],
    enemyAdjustments: {
      magic: ["pipe", "black_king_bar"],
      physical: ["crimson_guard", "shivas_guard"],
      silence: ["lotus_orb", "black_king_bar"]
    }
  },
  rangedGlassCannon: {
    appliesTo: ["Drow Ranger", "Sniper", "Lina", "Muerta"],
    coreIdea: "Ranged damage cores must solve positioning before adding greedier damage.",
    defaultItems: ["dragon_lance", "hurricane_pike", "black_king_bar", "butterfly", "satanic"],
    enemyAdjustments: {
      gapClose: ["hurricane_pike", "linkens_sphere"],
      evasion: ["monkey_king_bar"],
      silence: ["manta", "black_king_bar"]
    }
  },
  tempoMid: {
    appliesTo: ["Puck", "Queen of Pain", "Storm Spirit", "Void Spirit", "Ember Spirit"],
    coreIdea: "Tempo mids need rune control, first kill item, then defensive answers to disables.",
    defaultItems: ["bottle", "power_treads", "black_king_bar", "linkens_sphere", "sheepstick"],
    enemyAdjustments: {
      silence: ["euls", "black_king_bar", "linkens_sphere"],
      manaBurn: ["black_king_bar", "linkens_sphere"],
      catch: ["linkens_sphere", "sheepstick"]
    }
  },
  saveSupport: {
    appliesTo: ["Oracle", "Dazzle", "Io", "Shadow Demon", "Vengeful Spirit", "Treant Protector"],
    coreIdea: "Save supports need cast range, survival, and the correct save against enemy damage type.",
    defaultItems: ["tranquil_boots", "glimmer_cape", "force_staff", "aether_lens", "lotus_orb"],
    enemyAdjustments: {
      magic: ["glimmer_cape", "pipe"],
      physical: ["pavise", "solar_crest"],
      silence: ["lotus_orb", "guardian_greaves"]
    }
  },
  auraOfflaner: {
    appliesTo: ["Underlord", "Dark Seer", "Beastmaster", "Brewmaster", "Doom"],
    coreIdea: "Aura offlaners should adapt to enemy damage profile and objective timing.",
    defaultItems: ["guardian_greaves", "pipe", "crimson_guard", "lotus_orb", "shivas_guard"],
    enemyAdjustments: {
      magic: ["pipe"],
      physical: ["crimson_guard"],
      healing: ["shivas_guard"],
      summons: ["crimson_guard", "shivas_guard"]
    }
  }
};

export function archetypeForHero(heroName) {
  return Object.entries(HERO_BUILD_ARCHETYPES).find(([, archetype]) => archetype.appliesTo.includes(heroName))?.[1] || null;
}
