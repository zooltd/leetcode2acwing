import { title2URL } from './redirectUrl';
import 'dotenv/config';

const observer = new MutationObserver(resetTimer);
let timer = setTimeout(action, 500, observer);
observer.observe(document, { childList: true, subtree: true });

// reset timer every time something changes
function resetTimer(changes, observer) {
  clearTimeout(timer);
  timer = setTimeout(action, 500, observer);
}

function action(observer) {
  observer.disconnect();
  const parentBar = document.querySelector<HTMLDivElement>(
    'div[class*="TabHeaderContainer"]'
  );
  const hostname = window.location.hostname;
  const isUsSite = hostname === 'leetcode.com';
  const newTab = parentBar?.lastChild.cloneNode(true);
  const pagination = document.querySelector(
    'div[class^="pagination-screen__"]'
  );
  const code = isUsSite
    ? parseInt(pagination?.firstChild?.firstChild?.textContent)
    : parseInt(pagination?.firstChild?.textContent);
  (<Element>newTab)?.setAttribute('data-key', 'AcWing');
  (<Element>newTab)?.setAttribute('data-cy', 'AcWing');
  const url = title2URL.get(code);
  if (url) {
    (<HTMLAnchorElement>newTab?.firstChild)?.setAttribute('href', url);
    (<HTMLAnchorElement>newTab?.firstChild)?.setAttribute('target', '_blank');
  } else {
    (<HTMLAnchorElement>newTab?.firstChild)?.setAttribute('href', '#');
    (<HTMLAnchorElement>newTab?.firstChild)?.setAttribute(
      'onclick',
      "alert('Not found in AcWing')"
    );
  }
  (<SVGElement>(
    newTab?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild
  ))?.remove();
  // for US site
  if (isUsSite)
    (<HTMLSpanElement>(
      newTab?.firstChild?.firstChild?.firstChild?.firstChild?.lastChild
    ))!.innerText = 'AcWing';
  // for CN site
  else
    (<HTMLDivElement>(
      newTab?.firstChild?.firstChild?.firstChild?.firstChild
    ))!.innerText = 'AcWing';
  parentBar?.appendChild(newTab);
}
