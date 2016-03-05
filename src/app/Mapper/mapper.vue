<style lang="sass">
    @import "sass/mapper.scss";
    .cs-mapper{

        .body{
            height:$content-height;
            overflow:hidden;
        }

        .map-container{
            padding:0px;
        }

        .locations-container{
            height:100%;
            padding: 0px;
            background-color: $app-gray-darker;
            overflow-y: auto;


            .header{
                text-align: center;
                color:white;
                margin: 0px;
                padding: 10px;
                background-color: $success-color-darker;
            }
        }
    }
</style>

<template>
    <div class="panel panel-success cs-mapper">
        <div class="panel-heading">
            <h1>Mapper</h1>
        </div>

        <div class="body">
            <div class="col-sm-3 locations-container">
                <h3 class="header">Saved Locations</h3>
                <cs-location v-for="location in locations" :location="location"></cs-locations>
            </div>
            <div class="col-sm-9 map-container">
                <cs-map :locations="locations"></cs-map>
            </div>
        </div>

        <div class="panel-footer">
            <cs-new-location-contributor></cs-new-location-contributor>
            <button type="button" class="btn btn-primary pull-right" @click="showAllPins">Show All Locations</button>
        </div>
    </div>
</template>

<script>
    var location = require('./location.vue');
    var map = require('./map.vue');
    var newLocationContributor = require('./newLocationContributor.vue');

    module.exports = {
        components:{
            'cs-location': location,
            'cs-map': map,
            'cs-new-location-contributor': newLocationContributor
        },
        data: function (){
            return {
                locations:[
                    {
                        id: 1,
                        address: '100 Washington Ave St. Louis MO 63102',
                        name: "Saint Louis Arch",
                        position: null,
                        placeId: null
                    },
                    {
                        id: 2,
                        address: '2414 Menard St St. Louis MO 63104',
                        name: "BWorks",
                        position: null,
                        placeId: null
                    },
                    {
                        id: 3,
                        address: '3260 Hampton Ave St.Louis MO 63139',
                        name: "Skeleton Key",
                        position: null,
                        placeId: null
                    }
                ]
            }
        },
        events:{
            addNewLocation: 'onAddNewLocation',

            // these are just a way for the locations component to talk to the
            // map component so we're just handling it with a quick closure vs
            // abstracting it out to it's own method.
            geocodeThisAddress: function (address){
                this.$broadcast('geocodeAnAddress', address);
            },
            successfulGeocode: function (resultPayload){
                this.$broadcast('successfulGeocode', resultPayload);
            },
            failedGeocode: function (error){
                this.$broadcast('failedGeocode', error);
            },
            triggerLocationDisplay: function (location){
                this.$broadcast('panAndZoomToBounds', location);
            },
            pressLocationButton: function (location){
                this.$broadcast('pressLocationButton', location);
            }
        },
        methods: {
            showAllPins: function (){
                this.$broadcast('centerMap');
                this.$broadcast('pressLocationButton', {placeId: 'fake place id'});
            },
            onAddNewLocation: function (address, name, position, placeId, bounds){
                var newLocation = {
                    address: address,
                    name: name,
                    position: position,
                    placeId: placeId,
                    bounds: bounds,
                };
                var markerPayload = {
                    address: address,
                    position: position,
                    label: name,
                    placeId: placeId,
                    bounds: bounds
                };
                this.locations.push(newLocation);
                this.placeLocationOnMap(markerPayload);
            },
            placeLocationOnMap: function (location, bounds){
                // Note that we're specifically sending this information as a
                // broadcast instead of just binding the locations to the map
                // component because whenever a new location is added we want to
                // pan and zoom to show it. We can't do that if it's just a bind.

                var placeLocationPromise = new Promise((function (resolve, reject){
                    var result = this.$broadcast('placeLocationOnMap', location, bounds);
                    resolve(location);
                }).bind(this));

                placeLocationPromise.then((function (location){
                    this.$broadcast('pressLocationButton', location);
                }).bind(this));

                placeLocationPromise.catch(function (error){
                    console.log('error' + error);
                });
            }
        }
    }
</script>
