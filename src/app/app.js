var Vue = require('vue');
var Mapper = require('./Mapper/mapper.vue');

new Vue({
    el: 'body',
    components:{
        'cs-mapper': Mapper
    },
    data: {
        test: 'worked'
    }
});
