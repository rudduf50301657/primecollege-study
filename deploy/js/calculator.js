// ── Calculator Logic ──
let calcExpr = '';
const calcDisplay = document.getElementById('calcResult');
const calcExprDisplay = document.getElementById('calcExpr');

function calcUpdate() {
  calcExprDisplay.textContent = calcExpr || '';
}

function calcInput(ch) {
  calcExpr += ch;
  calcDisplay.textContent = calcExpr;
  calcUpdate();
}

function calcClear() {
  calcExpr = '';
  calcDisplay.textContent = '0';
  calcExprDisplay.textContent = '';
}

function calcDel() {
  calcExpr = calcExpr.slice(0, -1);
  calcDisplay.textContent = calcExpr || '0';
  calcUpdate();
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// Wrap trailing number or parenthesized group in function notation
function wrapLastNum(fnName) {
  // Case 1: ends with ) → wrap the whole parenthesized group
  if (calcExpr.endsWith(')')) {
    let depth = 0;
    let i = calcExpr.length - 1;
    for (; i >= 0; i--) {
      if (calcExpr[i] === ')') depth++;
      if (calcExpr[i] === '(') depth--;
      if (depth === 0) break;
    }
    const prefix = calcExpr.substring(0, i);
    const group = calcExpr.substring(i);
    calcExpr = prefix + fnName + group;
  }
  // Case 2: ends with a number
  else {
    const m = calcExpr.match(/(.*?)(\d+\.?\d*)$/);
    if (!m) return;
    calcExpr = m[1] + fnName + '(' + m[2] + ')';
  }
  calcDisplay.textContent = calcExpr;
  calcUpdate();
}

function calcFn(fn) {
  if (fn === 'pow') {
    calcExpr += '^';
    calcDisplay.textContent = calcExpr;
    calcUpdate();
    return;
  }
  const names = { sqrt: '√', sq: 'sqr', fact: 'fact', inv: '1/',
    abs: 'abs', sin: 'sin', cos: 'cos', ln: 'ln', log: 'log',
    exp: 'exp', '10pow': '10^' };
  if (names[fn]) wrapLastNum(names[fn]);
}

function resolveExpr(expr) {
  // Resolve innermost function calls first (handles nesting)
  let prev = '';
  while (prev !== expr) {
    prev = expr;
    expr = expr.replace(/fact\(([^()]+)\)/g, (_, v) => factorial(Math.round(Function('"use strict"; return (' + v + ')')())));
    expr = expr.replace(/sqr\(([^()]+)\)/g, (_, v) => { const n = Function('"use strict"; return (' + v + ')')(); return n*n; });
    expr = expr.replace(/√\(([^()]+)\)/g, (_, v) => Math.sqrt(Function('"use strict"; return (' + v + ')')()));
    expr = expr.replace(/abs\(([^()]+)\)/g, (_, v) => Math.abs(Function('"use strict"; return (' + v + ')')()));
    expr = expr.replace(/sin\(([^()]+)\)/g, (_, v) => Math.sin(Function('"use strict"; return (' + v + ')')()));
    expr = expr.replace(/cos\(([^()]+)\)/g, (_, v) => Math.cos(Function('"use strict"; return (' + v + ')')()));
    expr = expr.replace(/ln\(([^()]+)\)/g, (_, v) => Math.log(Function('"use strict"; return (' + v + ')')()));
    expr = expr.replace(/log\(([^()]+)\)/g, (_, v) => Math.log10(Function('"use strict"; return (' + v + ')')()));
    expr = expr.replace(/exp\(([^()]+)\)/g, (_, v) => Math.exp(Function('"use strict"; return (' + v + ')')()));
    expr = expr.replace(/10\^\(([^()]+)\)/g, (_, v) => Math.pow(10, Function('"use strict"; return (' + v + ')')()));
    expr = expr.replace(/1\/\(([^()]+)\)/g, (_, v) => 1 / Function('"use strict"; return (' + v + ')')());
  }
  return expr;
}

function calcEval() {
  let expr = calcExpr;
  try {
    // Replace display chars
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    // Resolve function calls
    expr = resolveExpr(expr);
    // Handle ^
    expr = expr.replace(/([\d.]+)\^([\d.]+)/g, (_, b, e) => Math.pow(+b, +e));
    const result = Function('"use strict"; return (' + expr + ')')();
    const display = Number.isInteger(result) ? '' + result : '' + +result.toFixed(10);
    calcExprDisplay.textContent = calcExpr + ' =';
    calcExpr = display;
    calcDisplay.textContent = display;
  } catch(e) {
    calcDisplay.textContent = 'Error';
    calcExpr = '';
  }
}

// Demo runner - animates button presses
function runDemo(steps) {
  calcClear();
  let i = 0;
  function next() {
    if (i >= steps.length) return;
    const step = steps[i];
    // Find and highlight the button
    const btns = document.querySelectorAll('.calc-btn');
    btns.forEach(b => {
      const txt = b.textContent.trim();
      const match = (
        (step === txt) ||
        (step === 'sqrt' && txt === '²√x') ||
        (step === 'sq' && txt === 'x²') ||
        (step === 'fact' && txt === 'n!') ||
        (step === 'pow' && txt === 'xy') ||
        (step === '10pow' && txt === '10x') ||
        (step === 'inv' && txt === '⅟x') ||
        (step === 'log' && txt === 'log') ||
        (step === 'ln' && txt === 'ln') ||
        (step === '=' && txt === '=') ||
        (step === '-' && txt === '−')
      );
      if (match) b.classList.add('highlight');
    });
    // Execute the step
    if (['sqrt','sq','fact','inv','sin','cos','ln','nCr','nPr','pow'].includes(step)) {
      calcFn(step);
    } else if (step === '=') {
      calcEval();
    } else if (step === '-') {
      calcInput('-');
    } else {
      calcInput(step);
    }
    i++;
    setTimeout(() => {
      btns.forEach(b => b.classList.remove('highlight'));
      setTimeout(next, 300);
    }, 500);
  }
  next();
}
