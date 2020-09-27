#include "players.hh"
#include <algorithm>

const int FailureAvoidPercentage = 70;
const int TakeRestPercentage = 20;

int planSamurai(GameInfo &info) {
  if (info.step == 0) initFieldMap(info);
  int id = info.id;
  int avoidPlan =
    info.plans[id] != info.actions[id] && // Plan failed
    rand()%100 <= FailureAvoidPercentage ? // should be avoided
    info.plans[id] : -2;		  // with certain probability
  Cell pos = info.positions[id];
  CellInfo &myCell = cells[pos.x][pos.y];
  // Dig adjacent known treasure
  Cell digCand;
  int maxTreasure = -1;
  vector <CellInfo*> &neighbors =
		 info.plans[id] < 0 ?
				  myCell.eightNeighbors :
    myCell.fourNeighbors;
  for (auto &n: neighbors) {
    if (noAgentsIn(n->position, info)) {
      auto treasure = info.revealedTreasure.find(n->position);
      if (treasure != info.revealedTreasure.end() &&
	  treasure->second > maxTreasure) {
	digCand = n->position;
	maxTreasure = treasure->second;
      }
    }
  }
  if (maxTreasure > 0) return directionOf(pos, digCand) + 8;
  // Move towards the nearest known treasure
  {
    vector <pair<Cell, int>> candidates;
    int closest = numeric_limits<int>::max();
    for (auto n: neighbors) {
      for (auto g: info.revealedTreasure) {
	if (noAgentsIn(n->position, info)) {
	  int dist =
	    samuraiDistance(n, &cells[g.first.x][g.first.y], info.holes);
	  if (dist <= closest) {
	    if (dist != closest) {
	      candidates.clear();
	      closest = dist;
	    }
	    candidates.push_back(pair<Cell, int>(n->position, g.second));
	  }
	}
      }
    }
    if (!candidates.empty()) {
      sort(candidates.begin(), candidates.end(),
	   [](auto c1, auto c2) { return c1.second > c2.second; });
      for (auto c: candidates) {
	int plan = directionOf(pos, c.first) +
	  (info.holes.count(c.first) == 0 ? 0 : 16);
	if (plan != avoidPlan) return plan;
      }
    }
  }
  // No revealed gold
  // Maybe take a rest
  if (rand()%100 <= TakeRestPercentage) return -1;
  // Try to approach the dog, hoping it to find some gold
  int closest = numeric_limits<int>::max();
  Cell dogPos = info.positions[id+2];
  CellInfo &dogPosInfo = cells[dogPos.x][dogPos.y];
  int bestPlan = -1;
  for (auto n: neighbors) {
    if (noAgentsIn(n->position, info)) {
      int dist = samuraiDistance(n, &dogPosInfo, info.holes);
      if (dist < closest) {
	int plan  = directionOf(pos, n->position) +
	  (info.holes.count(n->position) == 0 ? 0 : 16);;
	if (plan != avoidPlan) {
	  bestPlan = plan;
	  closest = dist;
	}
      }
    }
  }
  return bestPlan;
}
