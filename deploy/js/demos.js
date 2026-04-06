// Outlier Interactive Demo
const slider = document.getElementById('outlierSlider');
const outlierVal = document.getElementById('outlierVal');
const meanResult = document.getElementById('meanResult');
const meanMarker = document.getElementById('meanMarker');
const meanLabel = document.getElementById('meanLabel');

const baseData = [6, 0, 1, 3, 1, 5, 2, 3, 1, 3];

function updateOutlier() {
  const val = parseInt(slider.value);
  outlierVal.textContent = val;
  const data = [...baseData, val];
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  meanResult.textContent = mean.toFixed(2);

  const pct = mean; // 0~100 range maps well to percentage
  meanMarker.style.left = `${pct}%`;
  meanLabel.style.left = `${pct}%`;
}

slider.addEventListener('input', updateOutlier);
updateOutlier();
