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
            showLocation: 'onShowLocation'
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
                        zoom: 18,
                        mapTypeId: 'hybrid'
                    };
                    this.map = new google.maps.Map(el, options);
                    this.setLocationMarkers();
                }).bind(this)
            );
        },
        methods:{
            setLocationMarkers: function (){
                debugger;
                console.log('Markers loading');
                var positions = this.locations.map(function (location){
                    this.addMarker(location.position, 'test');
                },this);
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
