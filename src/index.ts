import { title2URL } from './redirectUrl';

let redirectUrl: undefined | null | string = undefined;

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

const getURL = async (
  isUs: boolean,
  cnt: number
): Promise<typeof redirectUrl> => {
  try {
    if (cnt >= 10) throw 'Timeout';
    const [title] = isUs
      ? await waitForRender('div[data-cy="question-title"]')
      : await waitForRender('h4[data-cypress="QuestionTitle"]');
    const code = isUs
      ? ~~title?.firstChild?.textContent
      : ~~title?.firstChild?.firstChild?.textContent;
    if (code === 0) return await getURL(isUs, cnt + 1);
    else return title2URL.get(code) ? title2URL.get(code) : '';
  } catch (error) {
    console.log(error, 'cannot get problem id.');
    return null;
  }
};

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
    (<HTMLAnchorElement>newTab?.firstChild).replaceWith(
      <HTMLDivElement>newTab?.firstChild?.firstChild
    );
    newTab.addEventListener('click', async () => {
      if (redirectUrl === undefined) redirectUrl = await getURL(isUsSite, 0);
      if (redirectUrl === '') window.alert('Not found in AcWing.');
      else if (redirectUrl === null) window.alert('Script loading failed.');
      else window.open(redirectUrl, '_blank');
    });
    parentBar?.appendChild(newTab);
  } catch (error) {
    console.error(error, 'script leetcode2acwing did not load.');
  }
})();
