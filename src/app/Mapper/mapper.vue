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
                        address:{
                            address: '100 Washington Ave',
                            city: 'St. Louis',
                            state: 'MO',
                            zip: 63102
                        },
                        name: "Saint Louis Arch",
                        position: {lat: 38.628744, lng: -90.183859}
                    },
                    {
                        id: 2,
                        address:{
                            address: '2414 Menard St',
                            city: 'St. Louis',
                            state: 'MO',
                            zip: 63104
                        },
                        name: "BWorks",
                        position: {lat: 38.602778, lng: -90.209273}
                    },
                    {
                        id: 3,
                        address:{
                            address: '3260 Hampton Ave',
                            city: 'St.Louis',
                            state: 'MO',
                            zip: 63139
                        },
                        name: "Skeleton Key",
                        position: {lat: 38.602808, lng: -90.291371}
                    }
                ]
            }
        },
        events:{
            // this is just a way for the locations component to talk to the
            // map component so we're just handling it with a quick closure vs
            // abstracting it out to it's own method.
            addNewLocation: 'onAddNewLocation',
            triggerLocationDisplay: function (location){
                this.$broadcast('showLocation', location);
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

// start here. We have two instances of how we add locations to the map, the original is by
// binding the locations to the map component and iterating over them wihin the map and then
// what we have planned out here where we broadcast new instances. We should pick one or the
// other. I think we should go with the broadcast so that when we have a new instance added
// we can use the bounds passed back to pan and zoom the map to the new pin.
                debugger;
                this.$broadcast('placeLocationOnMap', location, bounds);
            }
        }
    }
</script>
