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
    <button @click="onLocationClick" type="button" class="cs-locations btn btn-success">
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
                test: 'From Location component'
            }
        },
        events:{
            pressLocationButton: 'onPressLocationButton'
        },
        methods:{
            onPressLocationButton: function (){
                // if this is the location, press the button
            },
            onLocationClick: function (){
                this.$dispatch('triggerLocationDisplay', this.location);
                // trigger the info popover for the location
                // pan to the location in the map
            }
        }
    }
</script>
