// ── Quiz Logic ──
const quiz1Submitted = {};

function showHint(qNum) {
  const hint = document.getElementById('q' + qNum + '-hint');
  if (hint) hint.classList.toggle('show');
}

function selectOption(li) {
  const ul = li.parentElement;
  if (ul.dataset.submitted) return;
  ul.querySelectorAll('li').forEach(l => l.classList.remove('selected'));
  li.classList.add('selected');
}

function submitMC(qNum) {
  if (quiz1Submitted[qNum]) return;
  const card = document.getElementById('q' + qNum);
  const ul = card.querySelector('.quiz-options');
  const selected = ul.querySelector('li.selected');
  if (!selected) return;
  const answer = parseInt(ul.dataset.answer);
  const items = ul.querySelectorAll('li');
  const selectedIdx = Array.from(items).indexOf(selected) + 1;
  const resultEl = document.getElementById('q' + qNum + '-result');
  const explainEl = document.getElementById('q' + qNum + '-explain');
  const btn = card.querySelector('.quiz-submit');
  ul.dataset.submitted = 'true';
  btn.disabled = true;
  const labels = ['A', 'B', 'C', 'D'];
  if (selectedIdx === answer) {
    selected.classList.remove('selected');
    selected.classList.add('correct');
    resultEl.innerHTML = '&#10003; 정답입니다!';
    resultEl.className = 'quiz-result correct';

  } else {
    selected.classList.remove('selected');
    selected.classList.add('wrong');
    items[answer - 1].classList.add('correct');
    resultEl.innerHTML = '&#10007; 오답입니다. 정답은 <strong>' + labels[answer - 1] + '</strong>번입니다.';
    resultEl.className = 'quiz-result wrong';
  }
  explainEl.classList.add('show');
  quiz1Submitted[qNum] = true;

}

function submitSA(qNum) {
  if (quiz1Submitted[qNum]) return;
  const card = document.getElementById('q' + qNum);
  const input = document.getElementById('q' + qNum + '-input');
  const val = input.value.trim();
  if (!val) return;
  const resultEl = document.getElementById('q' + qNum + '-result');
  const explainEl = document.getElementById('q' + qNum + '-explain');
  const btn = card.querySelector('.quiz-submit');
  input.readOnly = true;
  btn.disabled = true;
  if (qNum === 3) {
    const normalized = val.replace(/\s/g, '').replace(/,/g, ',');
    const keywords = ['단위', '변수', '관찰값'];
    const allMatch = keywords.every(k => normalized.includes(k));
    if (allMatch) {
      resultEl.innerHTML = '&#10003; 정답입니다!';
      resultEl.className = 'quiz-result correct';

    } else {
      resultEl.innerHTML = '&#10007; 아래 해설에서 정답을 확인하세요.';
      resultEl.className = 'quiz-result wrong';
    }
  } else {
    resultEl.innerHTML = '&#10003; 답이 제출되었습니다. 아래 해설에서 모범답안을 확인하세요.';
    resultEl.className = 'quiz-result correct';
  }
  explainEl.classList.add('show');
  quiz1Submitted[qNum] = true;

}
