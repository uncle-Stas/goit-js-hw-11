import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const KEY = '29155055-535eee12d1c19223bea048262';
const URL = 'https://pixabay.com/api/';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', getImage);

async function getImage(event) {
  event.preventDefault();

  const querySearch = refs.searchInput.value;
  console.log('qurySearch: ', querySearch);

  const params = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
    page: 1,
    q: querySearch,
  };

  try {
    const response = await axios.get(`${URL}?key=${KEY}`, {
      params,
    });
    console.log(response.data);
    refs.gallery.innerHTML = '';
    refs.gallery.insertAdjacentHTML(
      'afterbegin',
      createItems(response.data.hits)
    );
    const lightbox = new SimpleLightbox('.gallery a');
  } catch (error) {
    console.log('error: ', error);
  }
}

function createItems(array) {
  return array.reduce((akum, item) => {
    return (
      akum +
      `<a class="gallery__link" href=${item.largeImageURL}>
        <div class="gallery__item">
          <div class="img-wrapper">
            <img
              class="gallery__image"
              src="${item.webformatURL}"
              alt="${item.tags}"
              loading="lazy"
            />
          </div>
          <div class="info">
            <p class="info__item">
              <b>Likes</b> ${item.likes}
            </p>
            <p class="info__item">
              <b>Views</b> ${item.views}
            </p>
            <p class="info__item">
              <b>Comments</b> ${item.comments}
            </p>
            <p class="info__item">
              <b>Downloads</b> ${item.downloads}
            </p>
          </div>
        </div>
      </a>`
    );
  }, '');
}

// --------------------------------------
