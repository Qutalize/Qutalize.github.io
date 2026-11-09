// Fixed title artwork: the original font files are never served to visitors.
function applyTypography() {
  const titles = ['About', 'Works', 'Research', 'Books', 'Hobby', 'Links'];
  document.querySelectorAll('#app h1').forEach(heading => {
    const title = heading.textContent.trim();
    if (!titles.includes(title)) return;
    const host = heading.closest('.graphbar,.compact-heading,.about-header,.section-heading') || heading;
    host.classList.add('section-heading');
    if(host!==heading) host.querySelectorAll('small,.status').forEach(el=>el.remove());
    if(host.classList.contains('compact-heading')) [...host.children].filter(el=>el!==heading).forEach(el=>el.remove());
    if(heading.previousElementSibling?.classList.contains('eyebrow')) heading.previousElementSibling.remove();
    heading.textContent=title;
    const description = window.PORTFOLIO_PAGES.pageDescriptions?.[title];
    if (description) {
      const caption = document.createElement('span');
      caption.className = 'page-title-description';
      caption.textContent = description;
      heading.append(caption);
      heading.classList.add('page-title-with-description');
    }
  });
  document.querySelectorAll('#site-nav .nav-topic span').forEach(label => {
    const title = label.textContent.trim();
    if (titles.includes(title)) setTypeArtwork(label, 'nav-' + title.toLowerCase(), title, 'nav-label-art');
  });
  document.querySelectorAll('.external h2').forEach(heading => {
    const title = heading.textContent.trim();
    if (['GitHub','AtCoder','LinkedIn','X'].includes(title))
      setTypeArtwork(heading, 'link-' + title.toLowerCase(), title, 'link-title-art');
  });
  document.querySelectorAll('.graphbar small').forEach(label => {
    if (label.textContent.trim() === 'KNOWLEDGE CONSTELLATION')
      setTypeArtwork(label, 'knowledge', 'KNOWLEDGE CONSTELLATION', 'eyebrow-art');
  });
  applyCardTypography();
}

function setTypeArtwork(element, file, alt, className) {
  const image = document.createElement('img');
  image.src = 'images/typography/' + file + '.png';
  image.alt = alt;
  image.className = className;
  element.replaceChildren(image);
}

function applyCardTypography() {
  document.querySelectorAll('.card-open:not([data-typeset])').forEach(label => {
    setTypeArtwork(label, 'read-more', '詳しく見る', 'card-label-art');
    label.append(' ↗');
    label.dataset.typeset = 'true';
  });
}
