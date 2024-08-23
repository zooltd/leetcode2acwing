import { title2URL } from './redirectUrl';

const button = document.createElement('button');
button.textContent = 'AcWing';

button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const titleSlug = window.location.pathname.split('/')[2];
const url = title2URL.get(titleSlug);

button.addEventListener('click', function () {
  if (url) {
    window.open(url);
  } else {
    alert('Not found in AcWing');
  }
});

document.body.appendChild(button);
