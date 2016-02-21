<style lang="sass">
    @import "sass/mapper.scss";
    @import "sass/square-button.scss";

    .cs-locations{
        white-space: normal;
        @include square-button();
    }
</style>

<template>
    <button @click="onLocationClick" type="button" class="cs-locations btn btn-success">
        <b>{{ location.name }}</b>: {{ inlineAddress }}
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
        computed: {
            inlineAddress: function (){
                return [
                    this.location.address.address,
                    this.location.address.city,
                    this.location.address.state,
                    this.location.address.zip,
                ].join(' ');
            }
        },
        methods:{
            onLocationClick: function (){
                this.$dispatch('triggerLocationDisplay', this.location);
                // trigger the info popover for the location
                // pan to the location in the map
            }
        }
    }
</script>
