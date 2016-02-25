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
            background-color: grey;
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
                        position: {lat: 38.628744, lng: -90.183859}
                    },
                    {
                        id: 2,
                        address: '2414 Menard St St. Louis MO 63104',
                        name: "BWorks",
                        position: {lat: 38.602778, lng: -90.209273}
                    },
                    {
                        id: 3,
                        address: '3260 Hampton Ave St.Louis MO 63139',
                        name: "Skeleton Key",
                        position: {lat: 38.602808, lng: -90.291371}
                    }
                ]
            }
        },
        events:{
            addNewLocation: 'onAddNewLocation',
            // this is just a way for the locations component to talk to the
            // map component so we're just handling it with a quick closure vs
            // abstracting it out to it's own method.
            sendLookupLocationRequest: function (address){
                this.$broadcast('sendLookupLocationRequest', address);
            },
            triggerLocationDisplay: function (location){
                this.$broadcast('showLocation', location);
            },
            failedLocationLookup: function (){
                this.$broadcast('failedLocationLookup');
            },
            successfulLocationLookup: function (result){
                this.$broadcast('successfulLocationLookup', result);
            }
        },
        methods: {
            getPositionForAddress: function (location){
                return this.$broadcast('getPositionForAddress', location);
            },
            onAddNewLocation: function (address, name, position, bounds){
                var newLocation = {
                    address: address,
                    name: name,
                    position: position
                };
                this.locations.push(newLocation);
                this.placeLocationOnMap(newLocation, bounds);
            },
            placeLocationOnMap: function (location, bounds){
                // Note that we're specifically sending this information as a
                // broadcast instead of just binding the locations to the map
                // component because whenever a new location is added we want to
                // pan and zoom to show it. We can't do that if it's just a bind.

                this.$broadcast('pressLocationButton', location);
                this.$broadcast('placeLocationOnMap', location, bounds);
            }
        }
    }
</script>
