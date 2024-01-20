import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '41902273-a1675a4e2dad43acb6fd87e89';

// https://pixabay.com/api?key=41902273-a1675a4e2dad43acb6fd87e89&q=sky&image_type=photo&orientation=horizontal&safesearch=true&per_page=9

const searchForm = document.querySelector('.form');
const resultContainer = document.querySelector('.gallery');
const loaderContainer = document.querySelector('.loader-container');

searchForm.addEventListener('submit', handleSearch);
hideLoader()

function handleSearch(event) {
  showLoader();
  event.preventDefault();
  resultContainer.innerHTML = "";
  

  const formQuery = event.currentTarget;
  const search = formQuery.elements.query.value;

  searchImageByName(search)
    .then(data => {
      if (!data || data.total === 0) {
        iziToast.error({
          title: '🥺 Ooops...',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'center',
        });
        return;
      }

      const images = data.hits;
      let markup = '';

      for (const image of images) {
        markup += createItemsMarkup(image);
      }

      resultContainer.innerHTML = markup;

      var lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });

      lightbox.refresh();
    })
    .catch(error => {
      console.error('Error fetching images:', error);
      iziToast.error({
        title: '🥺 Ooops...',
        message:
          'An error occurred while fetching images. Please try again later.',
        position: 'center',
      });
    })
    .finally(() => {
      hideLoader();
      formQuery.reset();
    }) 
}

function showLoader() {
  loaderContainer.style.display = 'flex';
}

function hideLoader() {
  loaderContainer.style.display = 'none';
}

function searchImageByName(searchImage) {
  const urlParams = new URLSearchParams({
    key: API_KEY,
    q: searchImage,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 21,
  });

  return fetch(`${BASE_URL}/?${urlParams}`).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

function createItemsMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<li class="gallery-item">
    <a class="gallery-link" href="${largeImageURL}">
      <img
        class="gallery-image"
        src="${webformatURL}"
        alt="${tags}"
      />
    </a>
      <ul class="description">
        <li class="items-descr">
          <h2>Likes</h2>
          <p>${likes}</p>
        </li>
        <li class="items-descr">
          <h2>Views</h2>
          <p>${views}</p>
        </li>
        <li class="items-descr">
          <h2>Comments</h2>
          <p>${comments}</p>
        </li>
        <li class="items-descr">
          <h2>Downloads</h2>
          <p>${downloads}</p>
        </li>
      </ul>
  </li>
  `;
}
