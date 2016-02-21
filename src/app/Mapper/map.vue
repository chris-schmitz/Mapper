<style lang="sass">
    @import "sass/mapper.scss";
    #map{
        height: $content-height;
        width: 100%;
    }
</style>

<template>
    <div id="map" class="">
        {{ placeholderText }}
    </div>
</template>

<script>

    module.exports = {
        props:[
            'locations'
        ],
        data: function (){
            return {
                placeholderText: 'Google Map',
                map: null
            }
        },
        events:{
            // getPositionForAddress: 'onGetPositionForAddress',
            showLocation: 'onShowLocation',
            placeLocationOnMap: 'onPlaceLocationOnMap'
        },
        created: function (){
            var GoogleMapsLoader = require('google-maps');
            GoogleMapsLoader.KEY = 'AIzaSyCNlgjm4ISAra17hpfBebbp2vlWMD3v3uc'

            GoogleMapsLoader.load(
                // note, we're wrapping all of this in parenthesis so that we
                // can manually bind the function to the vue instance instead
                // of the window and thereby call the setLocationMarkers AFTER
                // the map has been loaded
                (function (google){
                    var el = document.getElementById('map');
                    var options = {
                        center: {lat: 38.599979, lng: -90.285616},
                        zoom: 12,
                        mapTypeId: 'hybrid'
                    };
                    this.map = new google.maps.Map(el, options);
                    this.setLocationMarkers();
                    this.centerMap();
                }).bind(this)
            );
        },
        methods:{
            setLocationMarkers: function (){
                this.locations.forEach(function (location){
                    this.addMarker(location.position, 'test');
                },this);
            },
            centerMap: function (){
                var lowestLatitude = this.locations.reduce(function (carry, nextLocation, index){
                        // leaving this in for a good demo on looking at functional programming
                        // console.group('index: ' + index);
                        //     console.group('Carry:');
                        //         console.log(carry);
                        //     console.groupEnd();
                        //         console.group('Next:');
                        //         console.log(nextLocation);
                        //         console.log(nextLocation.position.lat);
                        //     console.groupEnd();
                        // console.groupEnd();
                        return carry < nextLocation.position.lat && carry !== null ? carry : nextLocation.position.lat;
                // initial starting value, note that this should be null and not
                // a number like 0 which is a valid lat or lng value.
                }, null);

                var lowestLongitude = this.locations.reduce(function (carry, nextLocation, index){
                        return carry < nextLocation.position.lng && carry !== null ? carry : nextLocation.position.lng;
                }, null);

                var highestLatitude = this.locations.reduce(function (carry, nextLocation, index){
                        return carry > nextLocation.position.lng && carry !== null ? carry : nextLocation.position.lat;
                }, null);

                var highestLongitude = this.locations.reduce(function (carry, nextLocation, index){
                        return carry > nextLocation.position.lng && carry !== null ? carry : nextLocation.position.lng;
                }, null);

                var southWest = new google.maps.LatLng({ lat: lowestLatitude, lng: lowestLongitude});
                var northEast = new google.maps.LatLng({ lat: highestLatitude, lng: highestLongitude});
                var bounds = new google.maps.LatLngBounds(southWest, northEast);
                this.map.fitBounds(bounds);
            },
            panAndZoomToPin: function (bounds){
                this.map.fitBounds(bounds)
            },
            onShowLocation: function (location){
                debugger;
                console.log(location);
                // triggered when
                //      a user clicks on a location button in the nav
                //      ?
                // show the location details popover
                // pan to that location on the map
            },
            addMarker: function (position, label){
                var marker = new google.maps.Marker({
                    position: position,
                    map: this.map
                });
            },
            onPlaceLocationOnMap: function (location, bounds){
                debugger;
                this.addMarker(location.position);
                this.panAndZoomToPin(bounds);
            }
            // onGetPositionForAddress: function (location){
            //     debugger;
            //     // broadcast down to the map to get the position information
            //     // make a call out to google's geolocation api
            //     // on success
            //         // create the latlang object
            //         // add it as the `position` of the location
            //         // place it on the map
            //     // show a notification to the user that there was an error locating the specific address
            // },
        }
    }
</script>
