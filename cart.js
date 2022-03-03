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
      productId: '',
      isLoading: ''
    };
  },
  methods: {
    getProducts() {
      const apiUrl = `${url}/api/${api_path}/products/all`;
      axios.get(apiUrl)
        .then((res) => {
          console.log(res);
          this.products = res.data.products;
        })
        .catch(err => {
          console.log(err);
        })
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCart() {
      const apiUrl = `${url}/api/${api_path}/cart`;
      axios.get(apiUrl)
        .then((res) => {
          console.log(res);
          this.cartData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        })
    },
    addToCart(id , qty = 1) {
      const data = {
        product_id : id,
        qty,
      };
      const apiUrl = `${url}/api/${api_path}/cart`;
      this.isLoading = id;
      axios.post(apiUrl , { data })
        .then((res) => {
          this.getCart();
          this.isLoading = '';
        })
        .catch(err => {
          console.log(err);
        })
    },
    removeCart(id) {
      const apiUrl = `${url}/api/${api_path}/cart/${id}`;
      this.isLoading = id;
      axios.delete(apiUrl)
        .then((res) => {
          this.getCart();
          this.isLoading = '';
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

app.component('product-modal', {
  props: ['id'],
  template : '#userProductModal',
  data() {
    return {
      modal: '',
      product: {}
    }
  },
  watch: {
    id() {
      this.getProduct();
    }
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    getProduct() {
      const apiUrl = `${url}/api/${api_path}/product/${this.id}`;
      axios.get(apiUrl)
        .then((res) => {
          this.product = res.data.product;
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  }
});

app.mount('#app');
