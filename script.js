const floors = {
  koru: {
    title: 'Koru Katı', label: 'GİRİŞ KATI', stores: [
      'Amasya Et Ürünleri', 'Arby’s', 'Armağan Oyuncak', 'Atasun Optik', 'Bosch', 'Burger King',
      'Colin’s', 'Dürümle', 'Fenerium', 'Flormar', 'Gameport', 'Getmobil', 'Gratis', 'Green Salads',
      'Greyder', 'GS Store', 'Jack & Jones', 'Kayseri Mutfağı', 'Korkmaz', 'LTB', 'MAD Parfümeri',
      'MediaMarkt', 'Michetta', 'Miniso', 'MR.DIY', 'Opmar Optik', 'Panço', 'Pastofino', 'Penelope',
      'Popeyes', 'Puma', 'Rossmann', 'Samsung', 'Sbarro', 'Schafer', 'Shake Shack', 'Siemens',
      'Starbucks', 'Subway', 'Tavuk Dünyası', 'Toyzz Shop', 'Turkcell', 'Türk Telekom', 'Usta Dönerci',
      'Vicco', 'Watsons', 'Xenon Smart', 'Xside', 'Zsa Zsa Zsu'
    ]
  },
  podyum: {
    title: 'Podyum Katı', label: '1. KAT', stores: [
      'AJA', 'Alix Avien', 'Altınbaş', 'Altınyıldız Classics', 'AVVA', 'Bağdat Döviz', 'Bambi',
      'Başak Altın', 'Bershka', 'Blue Diamond', 'Bolero'
    ]
  },
  cadde: {
    title: 'Cadde Katı', label: '2. KAT', stores: [
      'ADL', 'A Asuman', 'Atasay', 'B&G Store', 'Barbour', 'Beymen Club', 'Bisse'
    ]
  }
};

const tabs = [...document.querySelectorAll('.floor-tab')];
const panel = document.querySelector('#store-panel');
const list = document.querySelector('#store-list');
const search = document.querySelector('#store-search');
const title = document.querySelector('#floor-title');
const label = document.querySelector('#floor-label');
const resultCount = document.querySelector('#result-count');
let activeFloor = 'koru';

function renderStores() {
  const floor = floors[activeFloor];
  const query = search.value.trim().toLocaleLowerCase('tr');
  const matches = floor.stores.filter((store) => store.toLocaleLowerCase('tr').includes(query));

  title.textContent = floor.title;
  label.textContent = floor.label;
  resultCount.textContent = `${matches.length} mağaza · örnek seçki`;
  list.replaceChildren();

  if (matches.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Eşleşme bulunamadı. Güncel mağaza listesi için resmî dizini ziyaret edin.';
    list.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  matches.forEach((store) => {
    const item = document.createElement('div');
    item.className = 'store-item';
    item.textContent = store;
    fragment.append(item);
  });
  list.append(fragment);
}

function selectFloor(tab) {
  activeFloor = tab.dataset.floor;
  tabs.forEach((candidate) => {
    const selected = candidate === tab;
    candidate.classList.toggle('active', selected);
    candidate.setAttribute('aria-selected', String(selected));
    candidate.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tab.id);
  search.value = '';
  renderStores();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectFloor(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    tabs[next].focus();
    selectFloor(tabs[next]);
  });
});

search.addEventListener('input', renderStores);

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    navigation.classList.toggle('open', !open);
    menuButton.setAttribute('aria-label', open ? 'Menüyü aç' : 'Menüyü kapat');
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Menüyü aç');
    navigation.classList.remove('open');
  }));
}

renderStores();
