/* global axios bootstrap */
// eslint-disable-next-line
// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.prod.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'yusyuanjhou';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({ // 用來做一些設定
generateMessage: localize('zh_TW'), //啟用 locale 
});

const app = Vue.createApp({
components: {
  VForm: Form,
  VField: Field,
  ErrorMessage: ErrorMessage,
},
data() {
  return {
    cartData: {
      carts: []
    },
    products: [],
    productId: '',
    isLoading: '',
    qty : 1,
    form: {
      user: {
        name: '',
        email: '',
        tel: '',
        address: ''
        },
      message: ''
    },
    cart: {
      carts: []
    }
  };
},
methods: {
  getProducts() {
    const apiUrl = `${url}/api/${api_path}/products/all`;
    axios.get(apiUrl)
      .then((res) => {
        // console.log(res);
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
        // console.log(res);
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
        alert('商品加入購物車成功');
        this.getCart();
        this.isLoading = '';
      })
      .catch(err => {
        alert('商品加入購物車失敗');
        console.log(err);
      })
  },
  removeCart(id) {
    const apiUrl = `${url}/api/${api_path}/cart/${id}`;
    this.isLoading = id;
    axios.delete(apiUrl)
      .then((res) => {
        alert('商品刪除購物車成功');
        this.getCart();
        this.isLoading = '';
      })
      .catch(err => {
        alert('商品刪除購物車失敗');
        console.log(err);
      })
  },
  updateCartItem(item) {
    const data = {
      product_id : item.id,
      qty : item.qty,
    };
    const apiUrl = `${url}/api/${api_path}/cart/${item.id}`;
    this.isLoading = item.id;
    axios.put(apiUrl , { data })
      .then((res) => {
        alert('商品數量增加成功');
        this.getCart();
        this.isLoading = '';
      })
      .catch(err => {
        alert('商品數量增加失敗');
        console.dir(err);
      })
  },
  removeAllCart() {
    const apiUrl = `${url}/api/${api_path}/carts`;
    axios.delete(apiUrl)
      .then((res) => {
        alert('購物車商品已清空');
        this.getCart();
      })
      .catch(err => {
        alert('購物車無商品');
        console.log(err);
      })
  },
  createToOrder() {
    console.log('表單送出');

    const apiUrl = `${url}/api/${api_path}/order`;
    const order = this.form;
    axios.post(apiUrl , { data:order })
      .then((res) => {
        alert('送出訂單成功');
        this.$refs.form.resetForm();
        this.getCart();
        this.form.message = '';
      })
      .catch(err => {
        alert('送出訂單失敗');
        console.log(err);
      })
  },
  isPhone(value) {
    const phoneNumber = /^(09)[0-9]{8}$/
    return phoneNumber.test(value) ? true : '需要正確的電話號碼'
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
    product: {},
    qty: 1
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
  closeModal() {
    this.modal.hide();
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
  },
  addToCart() {
    this.$emit('add-cart', this.product.id , this.qty);
    this.closeModal();
  }
},
mounted() {
  this.modal = new bootstrap.Modal(this.$refs.modal);
}
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');