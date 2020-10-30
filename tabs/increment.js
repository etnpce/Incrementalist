//Data
const increment = {
  "P": {
    highestNum: -1,
    result: nd(0),
    baseCost: 1,
    dec: 0
  },
  "M": {
    highestNum: -1,
    result: nd(0),
    baseCost: 1e7,
    dec: 0
  },
  "E": {
    highestNum: -1,
    result: nd(0),
    baseCost: 1e30,
    dec: 2
  }
}
for (let name in increment) {
  for (let i=0; i<5; i++) {
    di("increment"+name+i+"b").addEventListener("click", () => {buyIncrement(name, i)});
  }
}
di("equationIPb").addEventListener("click", () => {clickEquation()});

//Buttons
function clickEquation() {
  giveMoney("IP", getEquationIPResult().times(getClickMulti()));
  user.ip.equationClicks++;
}
function buyIncrement(name, num) {
  let cost = getIncrementCost(name, num);
  if (user.ip.current.gte(cost) && cost.lt(user.ip.infinite)) {
    user.ip.current = user.ip.current.minus(cost);
    if (name == "E" && num == 4) {
      let condition = false;
      for (name in increment) {
        for (let i=0; i<5; i++) {
          if (user.ip.increment[name].bought[i] > 0) {condition = true}
        }
      }
      if (!condition) {giveEgg("egg1-2", true)}
    }
    user.ip.increment[name].bought[num]++;
    if (user.pp.challenge[2].in) {
      for (let i=0; i<num; i++) {
        user.ip.increment[name].bought[i] = 0;
      }
    }
  }
}

//Set Data
function setIncrementData() {
  for (let name in increment) {
    setIncrementResult(name);
  }
}
function setIncrementHighestNum(name) {
  for (let i=0; i<5; i++) {
    if (di("increment"+name+i).style.display != "none") {
      increment[name].highestNum = i;
    }
    else if (i == 0) {increment[name].highestNum = -1}
  }
}
function setIncrementResult(name) {
  setIncrementHighestNum(name);
  if (name == "P") {
    let result = getIncrementx(name, increment[name].highestNum);
    for (let i=(increment[name].highestNum-1); i>-1; i--) {result = result.times(getSacrificeBoost("IP", name)).plus(getIncrementx(name, i))}
    if (isNaN(result)) {result = nd(1)}
    increment[name].result = result;
  }
  if (name == "M") {
    let result = getIncrementx(name, increment[name].highestNum);
    for (let i=(increment[name].highestNum-1); i>-1; i--) {result = result.times(getSacrificeBoost("IP", name)).times(getIncrementx(name, i))}
    if (isNaN(result)) {result = nd(1)}
    increment[name].result = result;
  }
  if (name == "E") {
    let result = getIncrementx(name, increment[name].highestNum);
    for (let i=(increment[name].highestNum-1); i>-1; i--) {result = result.times(getSacrificeBoost("IP", name)).plus(getIncrementx(name, i))}
    result = result.plus(1);
    if (isNaN(result)) {result = nd(1)}
    increment[name].result = result;
  }
}

//Get Data
function getIPMulti() {
  let multi = nd(1);
  if (user.pp.pt.cells.includes("pt2-3")) {multi = multi.times(getPTReward("pt2-3"))}
  return getAchievementBoost().times(getPPBoost()).times(multi);
}
function getClickMulti() {
  let multi = nd(1);
  if (user.achievements.includes("ach1-6")) {multi = multi.times(getAchievementReward("ach1-6"))}
  return multi;
}
function getEquationIPResult() {
  return getIPMulti().times(increment.P.result.times(increment.M.result).pow(increment.E.result));
}
function getIncrementx(name, num) {
  if (name == "P") {return nd(num+1).pow(nd(num)).times(user.ip.increment[name].bought[num])}
  if (name == "M") {return nd(Math.pow(3, num)).times(user.ip.increment[name].bought[num]).plus(1)}
  if (name == "E") {return nd(user.ip.increment[name].bought[num]+1).log10().divide(3.5/(Math.sqrt(num+1)))}
}
function getIncrementCost(name, num) {
  return nd(increment[name].baseCost).times(getIncrementRatio(name, num).pow(user.ip.increment[name].bought[num])).floor();
}
function getIncrementRatio(name, num) {
  if (name == "P") {
    let multi = nd(1);
    if (user.achievements.includes("ach2-1")) {multi = multi.times(getAchievementReward("ach2-1"))}
    if (user.pp.pt.cells.includes("pt2-5")) {
      let thisMulti = getPTReward("pt2-5").minus(num).pow(2);
      if (user.pp.pt.cells.includes("pt3-3")) {thisMulti = thisMulti.times(1.25)}
      multi = multi.times(thisMulti);
    }
    let scale = nd(0.125);
    if (user.pp.challenge[3].in) {scale = nd(25)}
    return nd(1).plus(scale.times(Math.pow(2, num)).divide(getScalingEffect("P").times(multi)))
  }
  if (name == "M") {
    let scale = nd(1.3579);
    if (user.pp.challenge[3].in) {scale = nd(100)}
    return nd(1).plus(scale.pow(num+1).minus(1).divide(getScalingEffect("M")));
  }
  if (name == "E") {
    let scale = nd(1e30);
    if (user.pp.challenge[3].in) {scale = nd(1e100)}
    return nd(1).plus(scale.pow(nd(num+1).divide(getScalingEffect("E"))).minus(1));
  }
}

//Update Data
function updateIncrements() {
  for (let name in increment) {
    for (let i=0; i<5; i++) {
      updateIncrement(name, i);
      updateCoefficient(name, i);
    }
  }
}
function updateEquationIP() {
  di("equationCx").textContent = e("d", getIPMulti(), 2, 2);
  for (let name in increment) {
    di("equation"+name+"x").textContent = e("d", increment[name].result, 2, increment[name].dec);
  }
  let result = getEquationIPResult();
  di("equationIPResult").textContent = e("d", result, 2, 0);
  di("equationClickResult").textContent = e("d", result.times(getClickMulti()), 2, 0);
}
function updateCoefficient(name, num) {
  if (num == 4) {return}
  di("coefficient"+name+num).textContent = e("d", getSacrificeBoost("IP", name), 2, increment[name].dec);
}
function updateIncrement(name, num) {
  if (di("increment"+name+num).style.display != "none") {
    let cost = getIncrementCost(name, num);
    if (user.ip.current.lt(cost) || cost.gte(user.ip.infinite)) {replaceClass("canBuy", "cantBuy", "increment"+name+num+"b")}
    else {replaceClass("cantBuy", "canBuy", "increment"+name+num+"b")}
    if (cost.gte(user.ip.infinite) && showInfinite) {cost = "Infinite"}
    let dec = 0;
    if (name == "E") {dec = 2}
    di("increment"+name+num+"x").textContent = e("d", getIncrementx(name, num), 2, dec);
    di("increment"+name+num+"Cost").textContent = e("d", cost, 2, 0);
  }
}
