import { title2URL } from './redirectUrl';

const waitForRender = (...selectors: string[]) =>
  new Promise<Element[]>((resolve, reject) => {
    let totDelay = 0;
    const delay = 500;
    const f = () => {
      totDelay++;
      if (totDelay >= 200) reject('Timeout');
      const elements = selectors.map((selector) =>
        document.querySelector(selector)
      );
      if (elements.every((element) => element != null)) resolve(elements);
      else setTimeout(f, delay);
    };
    f();
  });

(async () => {
  try {
    const [parentBar] = await waitForRender('div[class*="TabHeaderContainer"]');
    if (parentBar === null) throw new Error('cannot find tabs');
    if (parentBar.firstChild == null) throw new Error('cannot find last tab');

    const newTab = <HTMLDivElement>parentBar.firstChild.cloneNode(true);
    const subdomain = window.location.pathname.split('/')[3];

    if (subdomain === '' || subdomain === undefined) {
      if (parentBar.lastChild !== null)
        newTab.className = (<HTMLDivElement>parentBar.lastChild).className;
    }

    newTab.setAttribute('data-key', 'AcWing');
    newTab.setAttribute('data-cy', 'AcWing');

    newTab.querySelector('svg')?.remove();

    const spanElements = newTab.querySelectorAll('span');
    const titleSpan = spanElements[spanElements.length - 1];
    if (titleSpan === undefined) throw new Error('cannot change tab title');
    titleSpan.innerText = 'AcWing';

    const titleSlug = window.location.pathname.split('/')[2];
    const url = title2URL.get(titleSlug);

    const anchor = newTab.querySelector('a');
    if (anchor === null) throw new Error('cannot find anchor');

    if (url) {
      anchor.setAttribute('href', url);
      anchor.setAttribute('target', '_blank');
    } else {
      anchor.setAttribute('href', '#');
      anchor.setAttribute('onclick', "alert('Not found in AcWing')");
    }

    parentBar?.appendChild(newTab);
  } catch (error) {
    console.error(error, 'script leetcode2acwing did not load.');
  }
})();
