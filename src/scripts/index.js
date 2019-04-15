import jQuery from 'jquery'; // 引入jQuery
// import Vue from 'vue/dist/vue';    // 引入Vue
import Axios from 'axios'; // 引入axios
// 引入flexibility模块，使得在ie10以下浏览器也可以使用flexbox布局
import flexibility from 'flexibility';


// 轻量级的灯箱插件，它能够同时为图像和视频，提供流畅的动画叠加弹出窗口
// https://github.com/henrygd/bigpicture
import BigPicture from 'bigpicture';

// 引入slick轮播模块
// import 'slick-carousel';  

// lodash 一致性、模块化、高性能的 JavaScript 实用工具库
// https://www.lodashjs.com/
// import lodash from 'lodash';

// 映入jquery国际化插件
// https://github.com/jquery-i18n-properties/jquery-i18n-properties
// import 'jquery-i18n-properties';

(function ($, window, flexibility, axios) {
  "use strict"
  $(document).ready(function () {
    // const instance = axios.create({
    //   baseURL: 'http://localhost:8090',
    //   timeout: 60000
    // });
    // instance.get('/menu', {})
    //   .then((res)=>{
    //     console.log(res)
    //   })
    //   .catch((err)=>{
    //     console.log(err)
    //   })

    // var app = new Vue({
    //   el: '#app',
    //   data: {
    //     message: 'Hello Vue!'
    //   }
    // });    
    // console.log(_.VERSION);
    // $('#image_container img').click((e)=>{
    //   console.log(e.target);
    //   BigPicture({
    //     el: e.target,
    //     gallery: '#image_container',
    //     onError: function() {
    //       console.log('there was an error')
    //     }
    //   })
    // })
    // $('#video_container div').click((e)=>{
    //   console.log(e.target);
    //   BigPicture({
    //     el: e.target,
    //     vidSrc: e.target.getAttribute('vidSrc'),
    //     onError: function() {
    //       console.log('there was an error')
    //     }
    //   })
    // })

    // flexibility 垫片，在IE9会自动执行
    function supportsFlexBox() {
      var test = document.createElement('test');
      test.style.display = 'flex';
      return test.style.display === 'flex';
    }
    if (!supportsFlexBox()) {
      flexibility(document.documentElement);
    }
  })
}(jQuery, window, flexibility, Axios));