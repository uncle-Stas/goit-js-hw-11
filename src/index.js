import { Notify } from 'notiflix';
import { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { throttle } from 'lodash';
import FetchURL from './js/fetch-class';

Notify.init({
  width: '400px',
  timeout: 4000,
  showOnlyTheLastOne: true,
});

const fetchSearchImage = new FetchURL();
const lightbox = new SimpleLightbox('.gallery a');

const refs = {
  searchForm: document.querySelector('.search__form'),
  searchInput: document.querySelector('.search__input'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearchForm);

async function onSearchForm(event) {
  event.preventDefault();

  fetchSearchImage.searchQuery = refs.searchInput.value;
  console.log('searchQuery: ', fetchSearchImage.searchQuery);
  fetchSearchImage.resetPage();

  renderGallery();
}

function createItems(array) {
  return array.reduce((akum, item) => {
    return (
      akum +
      `<a class="gallery__link" href=${item.largeImageURL}>
        <div class="gallery__item">
          <img
            class="gallery__image"
            src="${item.webformatURL}"
            alt="${item.tags}"
            loading="lazy"
          />          
          <div class="info">
            <p class="info__item">
              <b>Likes</b></br>${item.likes}
            </p>
            <p class="info__item">
              <b>Views</b></br>${item.views}
            </p>
            <p class="info__item">
              <b>Comments</b></br>${item.comments}
            </p>
            <p class="info__item">
              <b>Downloads</b></br>${item.downloads}
            </p>
          </div>
        </div>
      </a>`
    );
  }, '');
}

async function renderGallery() {
  Loading.standard();
  const dataArray = await fetchSearchImage.fetchImages();
  // console.log('dataArray: ', dataArray);

  if (dataArray.total === 0) {
    refs.gallery.innerHTML = '';
    showFailMessage();
    Loading.remove();
    return;
  }

  refs.gallery.innerHTML = '';
  refs.gallery.insertAdjacentHTML('beforeend', createItems(dataArray.hits));
  lightbox.refresh();
  Loading.remove();
  showTotalImage(dataArray.totalHits);
  window.scroll(top);
}

async function addNewPage() {
  if (fetchSearchImage.page > fetchSearchImage.totalPage) {
    showEndGalleryMessage();
    return;
  }

  Loading.standard();
  const dataArray = await fetchSearchImage.fetchImages();

  fetchSearchImage.page += 1;
  console.log('page number:', fetchSearchImage.page);
  refs.gallery.insertAdjacentHTML('beforeend', createItems(dataArray.hits));
  lightbox.refresh();
  Loading.remove();
  smoothScroll();
}

function showEndGalleryMessage() {
  if (fetchSearchImage.page !== 1) {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
  }
}

function showTotalImage(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

function showFailMessage() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

// --------------SCROLL------------------------

(() => {
  window.addEventListener('scroll', throttle(checkPosition, 250));
  window.addEventListener('resize', throttle(checkPosition, 250));
})();

async function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;

  const scrolled = window.scrollY;
  const pointLoadingContent = height - screenHeight / 4;

  const position = scrolled + screenHeight;

  if (position >= pointLoadingContent) {
    addNewPage();
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
