// 배너 폴링 (30초마다)
let lastBannerTime = null;
function checkBanner() {
  fetch('/api/banner')
    .then(r => r.json())
    .then(d => {
      const bar = document.getElementById('updateBanner');
      if (d.banner && d.banner.timestamp !== lastBannerTime) {
        lastBannerTime = d.banner.timestamp;
        document.getElementById('bannerText').textContent = d.banner.message;
        document.getElementById('bannerRefreshBtn').style.display = d.banner.showRefresh === '1' ? 'inline-block' : 'none';
        bar.style.display = 'flex';
      } else if (!d.banner) {
        bar.style.display = 'none';
        lastBannerTime = null;
      }
    })
    .catch(() => {});
}
checkBanner();
setInterval(checkBanner, 30000);
