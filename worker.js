importScripts("others-code/break-eternity.js", "useful.js", "encode.js")
let blackHole = new Proxy(() => blackHole, {get: (_, n) => n !== 'display' ? blackHole : ''})
var di = dc = del = wel = showId = showIdTab = showClass = hideId = hideClass = addClass = removeClass = replaceClass = copyToClipboard = copyToClipboard2 = () => blackHole
var document = {addEventListener: () => {}, hasFocus: () => false}

importScripts("tabs/achievements.js","tabs/statistics.js", "tabs/automation.js", "tabs/sacrifice.js", "tabs/scaling.js", "tabs/increment.js",
"tabs/prestige/ppmain.js", "tabs/prestige/ppmilestones.js", "tabs/prestige/tree.js", "tabs/prestige/ppchallenge.js",
"load.js")

loadGame = () => {}

let oSetInterval = setInterval
setInterval = resizeCanvases = updateIncrements = save = () => {}

setIncrementResult = function(name) {
  let result = nd(name != 'M'? 0 : 1)
  let boost = getSacrificeBoost("IP", name)
  if(name != 'M'){
    for(let i = 4; i>=0; i--) result = result.times(boost).plus(getIncrementx(name, i));
  }else{
    let i = 4;
    for( ; i>=0 && result.eq(Decimal.dOne); i--) result = getIncrementx('M', i);
    for( ; i>=0; i--) result = result.times(boost).times(getIncrementx('M', i));
  }
  increment[name].result = name == "E" || name == "T" ? result.plus(1) : result;
}

importScripts("devTools.js", "main.js");

setInterval = oSetInterval

self.onmessage = function(e){
  let {userS, ticks, mspt} = e.data
  user = JSON.parse(userS)
  fixnd(user)
  for (ticksDone=0; ticksDone<ticks; ticksDone++) {runGameTime(false, mspt)}
  self.postMessage(JSON.stringify(user))
}