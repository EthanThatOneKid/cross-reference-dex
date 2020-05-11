function search() {
  let pokes = Dex.find({
    "move": (getOption("move") === "---") ? undefined : getOption("move"),
    "ability": (getOption("ability") === "---") ? undefined : getOption("ability"),
    "type": (getOption("type") === "---") ? undefined : getOption("type")
  });
  let list = createList(pokes);
  document.getElementById("result-container").innerHTML = list;
}

function createList(pokes) {
  let html = "<ul>";
  for (let p of pokes) {
    let loader = "loader"; //"o-pokeball u-swing";
    let name = (p.name[0].toUpperCase() + p.name.slice(1)).replace(/-/g, " ");
    let num = pad(p.id, 3);
    let img = document.createElement("img");
    img.src = "https://serebii.net/pokedex-sm/icon/" + num + ".png";
    img.alt = name, img.id = "img" + num;
    img.onload = new Function("let div=document.getElementById(\""+num+"\");div.classList.remove(\"" + loader + "\");div.appendChild(this);");
    let div = "<div id=\"" + num + "\" class=\"" + loader + "\"></div>";
    html += "<li style=\"display:inline-block;padding:5px;\"><a target=\"_blank\" style=\"cursor:pointer;\" title=\"" + name + "\" href=\"" + p.url + "\">" + div + "</a></li>";
  }
  html += "</ul>";
  html += (pokes.length == 0) ? "<li style=\"display:inline-block;padding:5px;\">Sorry, no pok&#233;mon match your search.</li>" : "";
  return html
}

function init() {
  let moveSelect = "<select id=\"move\" onchange=\"search()\">";
  moveSelect += "<option>---</option>";
  for (let i = 0; i < MOVES.length; i++) {
    moveSelect += "<option>" + MOVES[i] + "</option>";
  }
  moveSelect += "</select>";

  let abilitySelect = "<select id=\"ability\" onchange=\"search()\">";
  abilitySelect += "<option>---</option>";
  for (let i = 0; i < ABILITIES.length; i++) {
    abilitySelect += "<option>" + ABILITIES[i] + "</option>";
  }
  abilitySelect += "</select>";

  let typeSelect = "<select id=\"type\" onchange=\"search()\">";
  typeSelect += "<option>---</option>";
  for (let i = 0; i < TYPES.length; i++) {
    typeSelect += "<option>" + TYPES[i] + "</option>";
  }
  typeSelect += "</select>";

  let html = "<table align=\"center\"><tr><td>";
  html += "<strong>MOVE</strong></td><td><strong>ABILITY</strong></td><td><strong>TYPE</strong>";
  html += "</td></tr><tr>";
  html += "<td>" + moveSelect + "</td><td>" + abilitySelect + "</td><td>" + typeSelect + "</td>";
  html += "</tr></table></td></tr><tr><td>";
  html += "<br><br>";
  html += "<div id=\"result-container\"></div>";

  document.getElementById("ui-container").innerHTML = html;
}

init();
search();

function getOption(id) {
  var elt = document.getElementById(id);
  if (elt.selectedIndex == -1) {
    return undefined;
  }
  return elt.options[elt.selectedIndex].text;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
