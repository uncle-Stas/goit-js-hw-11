import axios from 'axios';

export default class FetchURL {
  KEY = '29155055-535eee12d1c19223bea048262';
  URL = `https://pixabay.com/api/?key=${this.KEY}`;
  page = 1;
  totalPage = 1;

  constructor() {
    this.searchQuery = '';
  }

  async fetchImages() {
    const params = {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
    };

    try {
      const response = await axios.get(
        `${this.URL}&q=${this.searchQuery}&page=${this.page}`,
        {
          params,
        }
      );
      // console.log('response.data: ', response.data);
      this.totalPage = Math.ceil(response.data.totalHits / params.per_page);

      return response.data;
    } catch (error) {
      console.log('error', error.name);
    }
  }

  resetPage() {
    this.page = 1;
  }
}
