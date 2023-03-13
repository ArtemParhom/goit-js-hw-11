import { Notify } from "notiflix";
import axios from "axios";
import SimpleLightbox from "simplelightbox";


let PAGE = 1;
const PERPAGE = 40;
const KEY = `34339532-e640da46c9754c0f99dc11386`;
let inputValue = ``;
let loading = false;
let dataTotalHits = 0;


const searchFormEl = document.querySelector('#search-form'); 
const searchInputEl = searchFormEl.querySelector('input'); 
const searchButtonEl = searchFormEl.querySelector('button'); 
const galleryEl = document.querySelector(`.gallery`);


function noFoundImages() {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function howMachFoundImages(totalHits) {
    Notify.info(`Hooray! We found ${totalHits} images.`)
}

function noNameNoImages() {
    Notify.warning(`No name, no images!`);
}

function isBottomOfPage() {
  return window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 200;  
}


async function fetchImages(name) {
  if (loading) {
    return;
  }
  loading = true;
  const response = await axios.get(`https://pixabay.com/api/?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PERPAGE}&page=${PAGE}`);
  dataTotalHits = response.data.totalHits;
    if (response.data.total === 0) {
      noFoundImages();
      return;
    }
    if (response.data.total >= 1 && PAGE === 1)
      howMachFoundImages(response.data.totalHits);
     for (let i = 0; i < response.data.hits.length; i++) {
      const e = response.data.hits[i];
      addPhotoCards(e.webformatURL,e.largeImageURL,e.tags,e.likes,e.views,e.comments,e.downloads);
  }
//----------------
  
  let gallery = new SimpleLightbox('.gallery a');
  gallery.on('show.simplelightbox');

//--------------
  loading = false;
    return response.data.value; 
};


function addPhotoCards(webformatURL,largeImageURL,tags,likes,views,comments,downloads) {
  const cardEl = document.createElement(`div`);
  cardEl.classList.add(`photo-card`);
 cardEl.innerHTML = `<a href="${largeImageURL}" class="gallery-item" ;><img src="${webformatURL}" alt="${tags} class="gallery-image"" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes<br> ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views<br> ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments<br> ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads<br> ${downloads}</b>
    </p>
  </div>
</div>`;
  galleryEl.appendChild(cardEl);
}


searchFormEl.addEventListener('submit', (event) => {
  event.preventDefault();
  
});

searchButtonEl.addEventListener('click', (event) => {
  event.preventDefault(); 
  PAGE = 1;
  galleryEl.innerHTML = '';
  const searchQuery = searchInputEl.value.trim();
  inputValue = searchQuery;
  if (searchQuery === ``) {
    searchInputEl.value = ``;
    noNameNoImages();
    return;
  }
  fetchImages(searchQuery);
});

window.addEventListener(`scroll`, endScroll);

function endScroll() {
  if (isBottomOfPage() && !loading) {
    PAGE++;
  fetchImages(inputValue).then(() => {
    if (dataTotalHits === 0) {
        noFoundImages();
      } else if (isBottomOfPage() && PAGE * PERPAGE >= dataTotalHits) {
        Notify.warning(`We're sorry, but you've reached the end of search results.`);
         window.removeEventListener('scroll', endScroll);
      }
    });
  }
};



  



        



