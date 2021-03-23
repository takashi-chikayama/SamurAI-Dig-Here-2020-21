function zeroFill(n, m) {
  return ("000000000" + n).slice(-m);
}

function gameName(game, team1, team2) {
  return "g" + game + "_" +
    zeroFill(team1, 2) + "vs" + zeroFill(team2, 2);
}

function createSVG(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function removeChildren(parent) {
  while (parent.firstChild) parent.removeChild(parent.firstChild);
}

var titleArea, svgArea, logoArea;

const platinumLogos = ["hitachi.png"];
const goldLogos = ["e-Seikatsu.png", "jastec.png", "KCT.png"];

function shuffleArray(array) {
  for (var i = 0; i != array.length; i++) {
    const r = Math.floor(Math.random() * (array.length-i));
    const tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
}

class LOGO {
  constructor(filename, mag) {
    const image = document.createElement('img');
    image.src = "logos/" + filename;
    image.style.background = "white";
    image.style.verticalAlign = "middle";
    image.style.display = "inline";
    image.style.margin = "10px";
    this.image = image;
    this.mag = mag;
  }
}

const logos = [];
var highestLogo;
var highestLogoRatio = 0;

function redrawLogos() {
  removeChildren(logoArea);
  const logoAreaHeight = logoArea.clientHeight;
  const singleLogoArea =
	logoAreaHeight * highestLogo.image.naturalWidth *
	logoAreaHeight / highestLogo.image.height;
  let ok = false;
  let magFactor = 1.0;
  do {
    let totalWidth = 0;
    logos.forEach(logo => {
      const mag = magFactor*Math.sqrt(singleLogoArea/logo.naturalArea);
      logo.image.width = logo.mag * mag * logo.naturalWidth;
      totalWidth += logo.image.width;
      logoArea.appendChild(logo.image);
    });
    ok = logoArea.clientWidth > totalWidth+100;
    if (!ok) magFactor *= 0.95;
  } while (!ok);
}

function redrawTitle() {
  titleArea.style.lineHeight = titleArea.style.height;
  titleArea.style.fontSize = 0.7*titleArea.clientHeight + "px";
}

const teamPos = [
  [0, 0],			// 0
  [1, 7],			// 1
  [1, 0],			// 2
  [0, 7],			// 3
  [0, 4],			// 4
  [1, 3],			// 5
  [1, 4],			// 6
  [0, 3],			// 7
  [0, 2],			// 8
  [1, 5],			// 9
  [1, 2],			// 10
  [0, 5],			// 11
  [0, 6],			// 12
  [1, 1],			// 13
  [1, 6],			// 14
  [0, 1]			// 15
];

const matchKind = [
  "First Round", "Quarter Final", "Semifinal", "Final", "Third Place Play-Off"
];

var nextMatch;
const unfinishedLineColor = "rgb(255,224,128)";

function redrawTournament() {
  removeChildren(svg);
  const bb = svgArea.getBoundingClientRect();
  const h = bb.height;
  const w = bb.width;
  const hu = h/16;
  const wu = w/12;
  const tournamentStroke = wu/15;
  const fontSize = 0.2*wu;
  function drawMatchLine(g) {
    if (g == 14 && nextMatch < 14) return;
    const match = matches[g];
    const lines = [createSVG("polyline"), createSVG("polyline")];
    const endx = (match.at[0] + 3) * wu;
    const offsets =
	  match.level == 3 ? [1, 5] :
	  match.level == 4 ? [2, 4] :
	  match.at[0] < 4 ? [2, 2] : [4, 4];
    const px =
	  [(match.at[0]+offsets[0])*wu,
	   (match.at[0]+offsets[1])*wu];
    const endy = (match.at[1] + 1.5) * hu;
    const py = [
      (match.level == 0 ? endy - hu :
       match.level == 1 ? endy - 2*hu :
       match.level == 2 ? endy - 4*hu :
       match.level == 3 ? endy - 6*hu :
       endy),
      (match.level == 0 ? endy + hu :
       match.level == 1 ? endy + 2*hu :
       match.level == 2 ? endy + 4*hu :
       match.level == 3 ? endy + 2*hu :
       endy)];
    for (let k = 0; k != 2; k++) {
      lines[k].setAttribute(
	"points",
	px[k]+","+py[k] +
	  (match.level < 3 ? " " + endx+","+py[k] : "") +
	  " " + endx+","+endy
      );
      lines[k].setAttribute("stroke-width", tournamentStroke);
      lines[k].setAttribute("stroke",
			    g >= nextMatch ? unfinishedLineColor :
			    match.winner == k ? "red" : "white");
      lines[k].setAttribute("fill", "none");
      svg.appendChild(lines[k]);
    }
  }
  for (var g = 0; g != 16; g++) drawMatchLine(g);
  function drawMatchCircle(g) {
    if (g == 14 && nextMatch < 14) return;
    const match = matches[g];
    const circ = createSVG("circle");
    const cx = (match.at[0] + 3) * wu;
    const cy = (match.at[1] + 1.5) * hu;
    circ.setAttribute("cx", cx);
    circ.setAttribute("cy", cy);
    circ.setAttribute("r", 0.3*hu);
    circ.setAttribute("stroke", "black");
    circ.setAttribute("fill", "pink");
    svg.appendChild(circ);
  }
  for (var g = 0; g != 16; g++) drawMatchCircle(g);
  function drawTeamName(t) {
    const upper = (t < 4 || (8 <= t && t < 12));
    const xpos = teamPos[t][0] == 0 ? 0.3*wu : 9.7*wu;
    const ypos = (2*teamPos[t][1]+1.2) * hu;
    const rect = createSVG("rect");
    rect.setAttribute("x", xpos);
    rect.setAttribute("y", ypos);
    rect.setAttribute("width", 2*wu);
    rect.setAttribute("height", 0.6*hu);
    rect.setAttribute("fill", "white");
    const name = createSVG("text");
    name.setAttribute("x", xpos+wu);
    name.setAttribute("y", ypos+0.3*hu);
    name.setAttribute("fill", "black");
    name.setAttribute("text-anchor", "middle");
    name.setAttribute("dominant-baseline", "middle");
    name.setAttribute("font-size", fontSize);
    name.innerHTML = (t+1)+": "+teamNames[t];
    const teamTag = createSVG("g");
    teamTag.appendChild(rect);
    teamTag.appendChild(name);
    const intro = selfIntro[t+1];
    if (intro) {
      rect.setAttribute("stroke", "magenta");
      rect.setAttribute("stroke-width", 2);
      teamTag.onclick = () => {
	if (intro.type == "mp4") {
	  showVideo(intro.file);
	} else if (intro.type == "pdf") {
	  showPdfs(intro.files);
	} else {
	  alert("Unknown type: " + intro.type);
	}
      }
    } else {
      rect.setAttribute("stroke", "black");
      rect.setAttribute("stroke-width", 1);
    }
    svg.appendChild(teamTag);
  }
  for (var t = 0; t != 16; t++) {
    drawTeamName(t);
  }
}

function redrawAll() {
  const windowHeight = window.innerHeight;
  titleArea.style.height = 0.04*windowHeight + "px";
  svgArea.style.height = 0.83*windowHeight + "px";
  logoArea.style.height = 0.05*windowHeight + "px";
  redrawTitle();
  redrawTournament();
  redrawLogos();
}

function preload(whenLoaded) {
  const goldLogoFiles = goldLogos.slice(0);
  shuffleArray(goldLogoFiles);
  const platinumLogoFiles = platinumLogos.slice(0);
  shuffleArray(platinumLogoFiles);
  platinumLogoFiles.forEach(f => preloadLogo(f, 1.5));
  goldLogoFiles.forEach(f => preloadLogo(f, 1.0));
  let toLoad = platinumLogoFiles.length + goldLogoFiles.length;
  function preloadLogo(file, mag) {
    const logo = new LOGO(file, mag);
    logos.push(logo);
    logo.image.onload = ev => {
      const img = ev.target;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      logo.naturalWidth = w
      logo.naturalHeight = h;
      logo.naturalArea = w*h;
      logo.aspectRatio = w/h;
      if (mag*logo.aspectRatio > highestLogoRatio) {
	highestLogoRatio = mag*logo.aspectRatio;
	highestLogo = logo;
      }
      if (--toLoad == 0) whenLoaded();
    };
  }
}

function start() {
  nextMatch = 0;
  titleArea = document.getElementById("title area");
  svgArea = document.getElementById("svg area");
  gameFrame = document.getElementById('game frame');
  video = document.getElementById('video');
  introArea = document.getElementById('intro area');
  logoArea = document.getElementById('logo area');
  gameInfo = document.getElementById("game info");
  pdfControl = document.getElementById("pdf control");
  redTeamName = document.getElementById("red team");
  blueTeamName = document.getElementById("blue team");
  backButton = document.getElementById("backButton");
  nextButton = document.getElementById("nextButton");
  doneButton = document.getElementById("doneButton");
  svg = document.getElementById("svg");
  logoArea = document.getElementById("logo area");
  window.onresize = redrawAll;
  preload(redrawAll);
}

function showGameInfo(matchData) {
  const teamNumbers =
	gameNumber == 1 ?
	[matchData.team1, matchData.team2] :
	[matchData.team2, matchData.team1];
  removeChildren(gameInfo);
  gameInfo.innerHTML =
    "<span style='font-style: italic'>" +
    roundNames[matchData.level] + ", Game " + gameNumber +
    ":</span> " +
    "<span style='color:red'>" + teamNames[teamNumbers[0]-1] + "</span> ";
  if (gameNumber == 2) {
    gameInfo.innerHTML += "(" + matchData.scores[1][0] + ") ";
  }
  gameInfo.innerHTML += "<span style='font-style: italic'>vs.</span> ";
  gameInfo.innerHTML +=
    "<span style='color:blue'>" + teamNames[teamNumbers[1]-1] + "</span> ";
  if (gameNumber == 2) {
    gameInfo.innerHTML += "(" + matchData.scores[0][0] + ")";
  }
}

function arrangeScreen(items) {
  items.forEach(item => {
    if (item.text) item.node.innerHTML = item.text;
    item.node.style.display = item.display ? item.display : "none";
  });
}

var gameNumber;
function showNextMatch() {
  if (nextMatch < 16) {
    gameNumber = 1;
    const matchData = matches[nextMatch];
    const matchName = gameName(gameNumber, matchData.team1, matchData.team2);
    showGameInfo(matchData);
    localStorage.setItem(
      'gameLog',
      JSON.stringify(gameLogs[matchName]));
    arrangeScreen([
      { node: doneButton, display: "inline", text: "Next Game" },
      { node: backButton },
      { node: nextButton },
      { node: gameInfo, display: "block" },
      { node: gameFrame, display: "block" },
      { node: svgArea },
      { node: logoArea }
    ]);
    const gameInfoBottom = gameInfo.getBoundingClientRect().bottom;
    gameFrame.style.top = gameInfoBottom + "px";
    gameFrame.style.height = window.innerHeight - gameInfoBottom + "px";
    const aspectRatio = 1.83;
    const bb = gameFrame.getBoundingClientRect();
    if (bb.bottom-bb.top < (bb.right-bb.left)/aspectRatio) {
      const sw = (bb.bottom-bb.top)*aspectRatio;
      gameFrame.style.width = sw + "px";
      gameFrame.style.left = (window.innerWidth-sw)/2 + "px";
    }
    gameFrame.setAttribute('src', "gamePlayer/dighere.html");
    doneButton.onclick= gameDone;
  } else {
    // show the result page
    window.location.href = "resultPage.html";
  }
}

function showVideo(file) {
  arrangeScreen([
    { node: doneButton, display: "inline" },
    { node: backButton },
    { node: nextButton },
    { node: video, display: "block" },
    { node: svgArea },
    { node: logoArea }
  ]);
  doneButton.onclick = () => {
    video.pause();
    hideVideo();
  }
  video.addEventListener('ended', hideVideo);
  video.src = "selfintro/" + file;
  const titleBottom = titleArea.getBoundingClientRect().bottom;
  video.style.top = titleBottom + "px";
  video.style.height = window.innerHeight - titleBottom + "px";
  video.play();
}

function hideVideo() {
  arrangeScreen([
    { node: doneButton },
    { node: backButton, display: "inline" },
    { node: nextButton, display: "inline" },
    { node: video },
    { node: svgArea, display: "block" },
    { node: logoArea, display: "block" }
  ]);
}

var currentPdfPage;

function showPdfs(files) {
  arrangeScreen([
    { node: doneButton, display: "inline" },
    { node: backButton },
    { node: nextButton },
    { node: svgArea },
    { node: logoArea }
  ]);
  doneButton.onclick = () => {
    hidePdfs();
  }
  var controlBottom;
  if (files.length !== 1) {
    removeChildren(pdfControl);
    const buttons = [];
    const pageForward = document.createElement('button');
    pageForward.classList.add('pdfControlButton');
    pageForward.innerHTML = ">";
    pageForward.onclick = () => gotoPdfPage(files, currentPdfPage+1, buttons);
    pdfControl.appendChild(pageForward);
    for (let k = files.length-1; k >= 0; k--) {
      const pageButton = document.createElement('button');
      pageButton.classList.add('pdfControlButton');
      pageButton.innerHTML = (k+1).toString();
      pageButton.onclick = () => gotoPdfPage(files, k, buttons);
      buttons[k] = pageButton;
      pdfControl.appendChild(pageButton);
    }
    const pageBack = document.createElement('button');
    pageBack.classList.add('pdfControlButton');
    pageBack.innerHTML = "<";
    pageBack.onclick = () => gotoPdfPage(files, currentPdfPage-1, buttons);
    pdfControl.appendChild(pageBack);
    currentPdfPage = 0;
    pdfControl.style.height = "30px";
    pdfControl.style.display = "block";
    controlBottom = pdfControl.getBoundingClientRect().bottom;
    gotoPdfPage(files, 0, buttons);
  } else {
    controlBottom = titleArea.getBoundingClientRect().bottom;
    introArea.src = "selfintro/" + files[0];
  }
  introArea.onload = () => {
    const aspectRatio = introArea.naturalHeight/introArea.naturalWidth;
    const w = window.innerWidth;
    const h = window.innerHeight - controlBottom;
    const ih = aspectRatio*w;
    if (h > ih) {
      introArea.height = ih;
    } else {
      introArea.width = h/aspectRatio;
      introArea.style.left =
	(window.innerWidth-introArea.width)/2 + "px";
    }
    introArea.style.top = controlBottom + "px";
    introArea.style.display = "block";
  }
}

function gotoPdfPage(files, n, buttons) {
  if (n < 0) n = 0;
  if (n >= files.length) n = files.length-1;
  introArea.src = "selfintro/" + files[n];
  buttons[currentPdfPage].style.background = "";
  currentPdfPage = n;
  buttons[n].style.background = "pink";
}

function hidePdfs() {
  arrangeScreen([
    { node: doneButton },
    { node: backButton, display: "inline" },
    { node: nextButton, display: "inline" },
    { node: pdfControl },
    { node: introArea },
    { node: svgArea, display: "block" },
    { node: logoArea, display: "block" }
  ]);
}

function stepBack() {
  if (nextMatch != 0) {
    nextMatch -= 1;
    redrawAll();
  }
}

function gameDone() {
  gameFrame.setAttribute('src', '');
  if (gameNumber == 1) {
    gameNumber = 2;
    doneButton.innerHTML = "Done";
    const matchData = matches[nextMatch];
    const matchName = gameName(gameNumber, matchData.team2, matchData.team1);
    showGameInfo(matchData);
    localStorage.setItem(
      'gameLog',
      JSON.stringify(gameLogs[matchName]));
    gameFrame.setAttribute('src', "gamePlayer/dighere.html");
  } else {
    arrangeScreen([
      { node: doneButton },
      { node: backButton, display: "inline" },
      { node: nextButton, display: "inline" },
      { node: gameInfo },
      { node: gameFrame },
      { node: svgArea, display: "block" },
      { node: logoArea, display: "block" }
    ]);
    nextMatch += 1;
    redrawAll();
  }
}
