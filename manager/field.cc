#include "field.hh"

Cell::Cell(int x, int y): x(x), y(y) {}
Cell::Cell(object &o):
  x(o["x"].get<double>()),
  y(o["y"].get<double>()) {}
Cell::Cell(const Cell &original):
  x(original.x), y(original.y) {}
Cell&Cell::operator=(const Cell &another) {
  x = another.x; y = another.y;
  return *this;
}
bool Cell::operator==(const Cell &another) {
  return another.x == x && another.y == y;
}

Agent::Agent(int x, int y, int d):
  Cell(x, y), direction(d) {}
Agent::Agent(object &o):
  Cell(o), direction(o["direction"].get<double>()) {}
Agent::Agent(const Agent &original):
  Cell(original), direction(original.direction) {}

Gold::Gold(int x, int y, int a):
  Cell(x, y), amount(a) {}
Gold::Gold(object &o):
  Cell(o), amount(o["amount"].get<double>()) {}
Gold::Gold(const Gold &original):
  Cell(original), amount(original.amount) {}

Field::Field(object &json) {
  auto &agts = json["agents"].get<value::array>();
  int i = 0;
  for (auto &a: agts) agents[i++] = Agent(a.get<object>());
  auto &hls = json["holes"].get<value::array>();
  for (auto &h: hls) holes.push_back(Cell(h.get<object>()));
  auto &kg = json["known"].get<value::array>();
  for (auto &g: kg) known.push_back(Gold(g.get<object>()));
  auto &hg = json["hidden"].get<value::array>();
  for (auto &g: hg) hidden.push_back(Gold(g.get<object>()));
  thinkTime = (int)json["thinkTime"].get<double>();
}

Field::Field(const Field &fld) {
  size = fld.size;
  int i = 0;
  for (auto a: fld.agents) agents[i++] = Agent(a);
  for (auto h: fld.holes) holes.push_back(Cell(h));
  for (auto kg: fld.known) known.push_back(Gold(kg));
  for (auto hg: fld.hidden) hidden.push_back(Gold(hg));
  thinkTime = fld.thinkTime;
}

Field::Field(const Field &prev, const int plans[],
	     int actions[], int scores[])
  :Field(prev) {
  Cell targets[4];
  Cell moveTo[4];
  static const int dxs[] = {  0, -1, -1, -1,  0, +1, +1, +1 };
  static const int dys[] = { +1, +1,  0, -1, -1, -1,  0, +1 };
  //////////////////////////////
  // Check validities of plans
  for (int a = 0; a != 4; a++) {
    Agent &agt = agents[a];
    Cell target = Cell(agt.x, agt.y);
    moveTo[a] = target;
    int plan = plans[a];
    actions[a] = plan;
    agt.energized = true;
    if (plan != -1) {
      int nx = agt.x + dxs[plan%8];
      int ny = agt.y + dys[plan%8];
      target = Cell(nx, ny);
      targets[a] = target;
      if (plan < -1 || 24 <= plan) {
	agt.reason = "Plan out of range";
	goto INVALID;
      }
      if (a < 2 && plan%2 != 0 && !prev.agents[a].energized) {
	agt.reason = "Diagonal action without energy";
	goto INVALID;
      }
      if (a >= 2 && 8 <= plan) {
	agt.reason = "Dig or plug by a dog";
	goto INVALID;
      }
      if (nx < 0 || size <= nx || ny < 0 || size <= ny) {
	agt.reason = "Targetting outside of the field";
	goto INVALID;
      }
      if (find(agents, agents+4, target) != agents+4) {
	agt.reason = "Another agent in move target";
	goto INVALID;
      }
      if (find(holes.begin(), holes.end(), target) != holes.end()) {
	if (plan < 8) {
	  agt.reason = "Moving to a cell with a hole";
	  goto INVALID;
	}
	if (plan < 16) {
	  agt.reason = "Digging an already existing hole";
	  goto INVALID;
	}
      } else if (24 <= plan) {
	agt.reason = "Plugging a non-existent hole";
	goto INVALID;
      }
    }
    actions[a] = plan;
    if (0 <= plan && plan < 8) { // Move may succeed
      moveTo[a] = target;
    }
    agt.energized = (plan == -1);
    continue;
  INVALID:
    actions[a] = -2;		// Mark as invalid
  }
  //////////////////////////////
  // Check for effectiveness of plans
  // First, check for diagonal play conflicts
  for (int a = 0; a != 4; a++) {
    Agent &agt = agents[a];
    if (actions[a] >= 0) {
      Cell &target = targets[a];
      for (int b = 0; b != 4; b++) {
	if (a != b && actions[b] != -2) {
	  Cell &target_b = targets[b];
	  // Check whether diagonal move lines cross
	  if (((agt.y == agents[b].y &&
		target.y == target_b.y &&
		agt.x + target.x == agents[b].x + target_b.x) ||
	       (agt.x == agents[b].x &&
		target.x == target_b.x &&
		agt.y + target.y == agents[b].y + target_b.y))) {
	    if (a >= 2 || b < 2) {
	      agt.reason = "Crossing move lines";
	      actions[a] = -3;	// Mark as not viable
	      moveTo[a] = Cell(agt.x, agt.y);
	    }
	  }
	}
      }
    }
  }
  // Check for move destination collision
  for (int a = 0; a != 4; a++) {
    Agent &agt = agents[a];
    if (0 <= actions[a] && actions[a] < 8) {
      for (int b = 0; b != 4; b++) {
	if (a != b && moveTo[a] == moveTo[b]) {
	  agt.reason = "Move collision";
	  actions[a] = -3;	// Mark as not viable
	  break;
	}
      }
    }
  }
  // Then check for dig/plug effectiveness
  for (int a = 0; a != 4; a++) {
    Agent &agt = agents[a];
    if (plans[a] >= 8) {
      for (int b = 0; b != 4; b++) {
	if (targets[a] == moveTo[b]) {
	  agt.reason = "Dig target will be occupied";
	  actions[a] = -3;	// Mark as not viable
	}
      }
    }
  }
  for (int a = 0; a != 4; a++) {
    Agent &agt = agents[a];
    // Treat invalid and non-viable actions the same as taking a rest
    int action = actions[a];
    if (action < 0) {
      actions[a] = -1;
    } else if (0 <= action && action < 8) {
      Cell &destination = moveTo[a];
      agt.x = destination.x;
      agt.y = destination.y;
    }
  }
  for (int a = 0; a != 4; a++) {
    Agent &agt = agents[a];
    int action = actions[a];
    Cell target = targets[a];
    if (action < 0) {
      // Do nothing
    } else {
      agt.direction = action%8;
      if (action < 8) {
	// Move to the target
	if (a >= 2) {		// Dog barks on a treasure
	  auto found =
	    find_if(hidden.begin(), hidden.end(),
		    [target](auto &g) {
		      return g.x == target.x && g.y == target.y; });
	  if (found != hidden.end()) {
	    known.push_back(*found);
	    hidden.erase(found);
	  }
	}
      } else if (action < 16) {
	// Dig a hole
	vector <Gold> *foundIn = nullptr;
	auto g = find(known.begin(), known.end(), target);
	if (g != known.end()) {
	  foundIn = &known;
	} else {
	  g = find(hidden.begin(), hidden.end(), target);
	  if (g != hidden.end()) {
	    foundIn = &hidden;
	  }
	}
	if (foundIn != nullptr) {
	  // Some gold is dug out
	  int opp = (a+1)%2;
	  if (8 <= actions[opp] && targets[a] == targets[opp]) {
	    // If opponent samurai is also digging the same cell
	    scores[a] += g->amount/2;
	    scores[opp] += g->amount/2;
	  } else {
	    scores[a] += g->amount;
	  }
	  if (foundIn->size() != 1) {
	    *g = *(foundIn->rbegin());
	  }
	  foundIn->pop_back();
	}
	auto h = find(holes.begin(), holes.end(), target);
	if (h == holes.end()) holes.push_back(target);
      } else {
	// Plug a hole
	auto h = find(holes.begin(), holes.end(), target);
	if (h != holes.end()) {
	  if (holes.size() != 1) *h = *holes.rbegin();
	  holes.pop_back();
	}
      }
    }
  }
}

ostream &operator<<(ostream &out, const Field &f) {
  out << "Agents:";
  for (auto a: f.agents)
    out << " @(" << a.x << ',' << a.y << ")"
	<< "↑" << a.direction;
  out << endl;
  out << "Holes:";
  for (auto h: f.holes) out << " @(" << h.x << ',' << h.y << ")";
  out << endl;
  out << "Known Golds:";
  for (auto g: f.known)
    out << " @(" << g.x << ',' << g.y << ")"
	<< "=" << g.amount;
  out << endl;
  out << "Hidden Golds:";
  for (auto g: f.hidden)
    out << " @(" << g.x << ',' << g.y << ")"
	<< "=" << g.amount;
  out << endl;
  return out;
}

object Cell::json() {
  object obj;
  obj.emplace(make_pair("x", value((double)x)));
  obj.emplace(make_pair("y", value((double)y)));
  return obj;
}

object Gold::json() {
  object obj = Cell::json();
  obj.emplace(make_pair("amount", value((double)amount)));
  return obj;
}

object Agent::json() {
  object obj = Cell::json();
  obj.emplace(make_pair("direction", value((double)direction)));
  return obj;
}

object Field::json() {
  object obj;
  obj.emplace(make_pair("size", value((double)size)));
  value::array agentsArray;
  for (Agent a: agents) agentsArray.push_back(value(a.json()));
  obj.emplace(make_pair("agents", agentsArray));
  value::array holesArray;
  for (Cell c: holes) holesArray.push_back(value(c.json()));
  obj.emplace(make_pair("holes", holesArray));
  value::array knownArray;
  for (Gold g: known) knownArray.push_back(value(g.json()));
  obj.emplace(make_pair("known", knownArray));
  value::array hiddenArray;
  for (Gold h: hidden) hiddenArray.push_back(value(h.json()));
  obj.emplace(make_pair("hidden", hiddenArray));
  return obj;
}
