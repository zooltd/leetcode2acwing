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
    const newTab = <Element>parentBar?.lastChild?.cloneNode(true);
    newTab?.setAttribute('data-key', 'AcWing');
    newTab?.setAttribute('data-cy', 'AcWing');
    (<SVGElement>(
      newTab?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild
    ))?.remove();
    const isUsSite = window.location.hostname === 'leetcode.com';
    isUsSite
      ? ((<HTMLSpanElement>(
          newTab?.firstChild?.firstChild?.firstChild?.firstChild?.lastChild
        ))!.innerText = 'AcWing')
      : ((<HTMLDivElement>(
          newTab?.firstChild?.firstChild?.firstChild?.firstChild
        ))!.innerText = 'AcWing');
    const url = title2URL.get(window.location.pathname);
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
    parentBar?.appendChild(newTab);
  } catch (error) {
    console.error(error, 'script leetcode2acwing did not load.');
  }
})();
