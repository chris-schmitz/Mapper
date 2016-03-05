<style lang="sass">
    @import "sass/mapper.scss";
    @import "sass/square-button.scss";

    .cs-locations{
        width: 100%;
        min-height: 80px;
        margin-top: 2px;
        white-space: normal;
        @include square-button();
    }
</style>

<template>
    <button @click="onLocationClick" type="button" class="cs-locations btn btn-success" :class="{'active': active}">
        <b>{{ location.name }}</b>: {{ location.address }}
    </button>
</template>

<script>
    module.exports = {
        props:[
            'location'
        ],
        data: function (){
            return {
                test: 'From Location component',
                active: false,
            }
        },
        events:{
            pressLocationButton: 'onPressLocationButton'
        },
        methods:{
            onPressLocationButton: function (location){
                if(location.placeId == this.location.placeId){
                    this.active = true;
                } else {
                    this.active = false;
                }
            },
            onLocationClick: function (){
                this.$dispatch('triggerLocationDisplay', this.location);
                this.$dispatch('pressLocationButton', this.location);
            }
        }
    }
</script>
