<style lang="sass">
    @import "sass/mapper.scss";
    .cs-mapper{

        .body{
            height:$content-height;
        }

        .map-container{
            padding:0px;
        }

        .locations-container{
            height:100%;
            padding: 0px;
        }
    }
</style>

<template>
    <div class="panel panel-success cs-mapper">
        <div class="panel-heading">
            Mapper
        </div>

        <div class="body">
            <div class="col-sm-3 locations-container">
                <cs-location v-for="location in locations" :location="location"></cs-locations>
            </div>
            <div class="col-sm-9 map-container">
                <cs-map :locations="locations"></cs-map>
            </div>
        </div>

        <div class="panel-footer">
            <button type="button" class="btn btn-success">New Location</button>
        </div>
    </div>
</template>

<script>
    var location = require('./location.vue');
    var map = require('./map.vue');

    module.exports = {
        components:{
            'cs-location': location,
            'cs-map': map
        },
        data: function (){
            return {
                locations:[
                    { id: 1, address: '100 Washington Ave, St. Louis, MO 63102', name: "Saint Louis Arch", position: {lat: 38.628744, lng: -90.183859} },
                    { id: 2, address: '2414 Menard St, St. Louis, MO 63104', name: "BWorks", position: {lat: 38.602778, lng: -90.209273} },
                    { id: 3, address: '3260 Hampton Ave, St.Louis, MO 63139', name: "Skeleton Key", position: {lat: 38.602808, lng: -90.291371} }
                ]
            }
        },
        events:{
            addANewLocation: 'onAddANewLocation',

            // this is just a way for the locations component to talk to the
            // map component so we're just handling it with a quick closure vs
            // abstracting it out to it's own method.
            triggerLocationDisplay: function (location){
                this.$broadcast('showLocation', location);
            }
        },
        methods: {
            getPositionForAddress: function (location){
                return this.$broadcast('getPositionForAddress', location);
            },
            onAddANewLocation: function (address){
                // verify address
                // create a location object
                // get the position for the address
                // push to locations array
                // place on the map
            },
            placeLocationOnMap: function (location){
                // broadcast the event 'placeLocationOnMap` to map component
            }
        }
    }
</script>
