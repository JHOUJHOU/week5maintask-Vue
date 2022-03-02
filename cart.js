/* global axios bootstrap */
// eslint-disable-next-line
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.prod.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'yusyuanjhou';

const app = createApp({
  data() {
    return {
      cartData: {},
      products: [],
    };
  },
  methods: {
    getProducts() {
      const apiUrl = `${url}/api/${api_path}/products`;
      axios.get(apiUrl)
        .then((res) => {
          console.log(res);
          this.products = res.data.products;
        })
        .catch(err => {
          console.log(err);
        })
    },
  },
  mounted() {
    this.getProducts();
  },
});

app.mount('#app');