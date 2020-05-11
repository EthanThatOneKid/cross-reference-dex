class Dex {
  constructor() {
    this.url = "https://pokeapi.co/api/v2/";
    this.loader = new Loader();
  }
  ability(str) {
    let url = this.url + "ability/" + str;
    return this.loader.loadJSON(url);
  }
  move(str) {
    let url = this.url + "move/" + str;
    return this.loader.loadJSON(url);
  }
  pokemon(str) {
    let url = this.url + "pokemon/" + str;
    return this.loader.loadJSON(url);
  }
  static find(settings = {}) {
    let results = [];
    for (let i = 1; i < POKEDEX.len; i++) {
      let p = POKEDEX[i];
      p["id"] = i;
      let isType = (settings.type) ? p.types.includes(settings.type) : true;
      let isMove = (settings.move) ? p.moves.includes(settings.move) : true;
      let isAbility = (settings.ability) ? p.abilities.includes(settings.ability) : true;
      if (isMove && isType && isAbility) {
        results.push(p);
      }
    }
    return results;
  }
}
