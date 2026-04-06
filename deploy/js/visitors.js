fetch('/api/visitors?page=statistics')
  .then(r => r.json())
  .then(d => {
    const el = document.getElementById('visitor-stats');
    if (el && d.pageVisitors != null) {
      el.innerHTML = '\uD83D\uDC64 \uC624\uB298 ' + d.pageVisitors + '\uBA85 \uBC29\uBB38, ' + d.pageViews + '\uD68C \uC870\uD68C'
        + '<br>\uD83D\uDC65 \uB204\uC801 ' + d.pageTotalVisitors + '\uBA85 \uBC29\uBB38, ' + d.pageTotalViews + '\uD68C \uC870\uD68C';
    }
  })
  .catch(() => {});
