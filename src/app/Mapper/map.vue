<style lang="sass">
    @import "sass/mapper.scss";
    #map{
        height: $content-height;
        width: 100%;
    }
</style>

<template>
    <div id="map">
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
                map: null,
                geocoder: null
            }
        },
        created: function (){
            var GoogleMapsLoader = require('google-maps');
            GoogleMapsLoader.KEY = 'AIzaSyCNlgjm4ISAra17hpfBebbp2vlWMD3v3uc';

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
                    this.geocoder = new google.maps.Geocoder;

                    this.mapReady();
                }).bind(this)
            );
        },
        events:{
            placeLocationOnMap: ['addMarker', 'panAndZoomToPin'],
            centerMap: 'onCenterMap',
            locationsGeocoded: 'onLocationsGeocoded'
        },
        methods:{
            mapReady: function (){
                var markerPromises = this.locations.map(function (location){
                    return this.makeAGeocodePromise(location);
                },this);
                this.retreiveGeocodeResults(markerPromises);
            },
            onCenterMap: function (){
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
                        return carry > nextLocation.position.lat && carry !== null ? carry : nextLocation.position.lat;
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
            addMarker: function (position, label){
                var marker = new google.maps.Marker({
                    position: position,
                    map: this.map
                });
            },
            makeAGeocodePromise: function (location){
                return new Promise(
                    (function (resolve, reject){
                        this.geocoder.geocode({address: location.address}, function (result){
                            if(result !== undefined){
                                var payload = {
                                    locationInstance: location,
                                    geocodeResults: result[0]
                                };
                                resolve(payload);
                            } else {
                                reject( new Error(result) );
                            }
                        });
                    }).bind(this)
                );
            },
            retreiveGeocodeResults: function (locationPromises){
                Promise.all(locationPromises).then(
                    (function (resultPayload){
                        this.$emit('locationsGeocoded', resultPayload);
                    }).bind(this)
                ).catch(function (error){
                    console.log(error);
                });
            },
            onLocationsGeocoded: function (resultPayload){
                resultPayload.forEach(function (result){
                    this.addMarker(result.locationInstance.position, result.locationInstance.name);
                }, this);
                this.$emit('centerMap');
            }
        }
    }
</script>
