function preload(name) {
  document.createElement("img").src = "../icons/" + name + ".png"
}

[
  "blue-hand",
  "clearLog",
  "clock",
  "coins-icon",
  "east",
  "edit",
  "exitEdit",
  "export",
  "fastForward",
  "help",
  "hole",
  "import",
  "load",
  "manual",
  "ne",
  "north",
  "nw",
  "pencil",
  "pencil-writing",
  "play",
  "randomize",
  "red-hand",
  "reinit",
  "remove",
  "resize",
  "rewind",
  "save",
  "se",
  "sw",
  "south",
  "speedometer",
  "stepBackward",
  "stepForward",
  "stop",
  "west"
].forEach(name => preload(name));

["samuraiRed", "samuraiBlue"].forEach(name => {
  for (let k = 0; k != 48; k++) {
    preload(name + ("0"+k).slice(-2));
  }
});

["dogRed", "dogBlue"].forEach(name => {
  for (let k = 0; k != 16; k++) {
    preload(name + ("0"+k).slice(-2));
  }
});

for (let k = 0; k != 10; k++) {
  preload("gold" + ("0"+k).slice(-2));
}
