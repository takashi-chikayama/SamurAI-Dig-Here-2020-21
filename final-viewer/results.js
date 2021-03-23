const matches = [
  // First Round
  { level: 0, at:[0, 1], team1:1, team2:16, winner:0, scores:[[268, 180], [0, 0]] },
  { level: 0, at:[0, 5], team1:9, team2:8, winner:0, scores:[[0, 88], [0, 12]] },
  { level: 0, at:[0, 9], team1:5, team2:12, winner:1, scores:[[20, 16], [0, 96]] },
  { level: 0, at:[0, 13], team1:13, team2:4, winner:1, scores:[[40, 54], [108, 124]]},
  { level: 0, at:[6, 1], team1:3, team2:14, winner:0, scores:[[232, 340], [0, 0]] },
  { level: 0, at:[6, 5], team1:11, team2:6, winner:1, scores:[[30, 50], [50, 316]] },
  { level: 0, at:[6, 9], team1:7, team2:10, winner:0, scores:[[164, 972], [62, 130]] },
  { level: 0, at:[6, 13], team1:15, team2:2, winner:1, scores:[[60, 60], [434, 504]] },
  // Quarter Final
  { level: 1, at:[1, 3], team1:1, team2:9, winner:0, scores:[[276, 144], [0, 40]] },
  { level: 1, at:[1, 11], team1:12, team2:4, winner:1, scores:[[2, 20], [176, 220]] },
  { level: 1, at:[5, 3], team1:3, team2:6, winner:0, scores:[[396, 410], [326, 270]] },
  { level: 1, at:[5, 11], team1:7, team2:2, winner:0, scores:[[296, 276], [222, 314]] },
  // Semifinal
  { level: 2, at:[2, 7], team1:1, team2:4, winner:1, scores:[[32, 122], [154, 220]] },
  { level: 2, at:[4, 7], team1:3, team2:7, winner:0, scores:[[356, 282], [162, 206]] },
  // Third Place Play-off
  { level: 3, at:[3, 9], team1:1, team2:7, winner:0, scores:[[540, 444], [488, 372]] },
  // Final
  { level: 4, at:[3, 7], team1:4, team2:3, winner:1, scores:[[86, 166], [258, 152]] },
];

const roundNames = [
  "First Round", "Quarter Final", "Semifinal",
  "Third Place Playoff", "Championship Match",
];

const ranking = [
  { rank:1, team: "johnnyhibiki" },
  { rank:2, team: "ys" },
  { rank:3, team: "ValGrowth" },
  { rank:4, team: "Tambo" },
  { rank:5, team: "Monk1" },
  { rank:6, team: "NEUTRON" },
  { rank:7, team: "K" },
  { rank:8, team: "STN" },
  { rank:"Finalist", team: "tanzaku" },
  { rank:"Finalist", team: "milmilk" },
  { rank:"Finalist", team: "ncandy" },
  { rank:"Finalist", team: "TeamPL" },
  { rank:"Finalist", team: "Team AI style" },
  { rank:"Finalist", team: "CamelliaDragons" },
  { rank:"Finalist", team: "compiler" },
  { rank:"Finalist", team: "Freerider 2.0" },
];
