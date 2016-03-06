<style lang="sass">
    @import "sass/mapper.scss";
    #map{
        height: $content-height;
        width: 100%;
        background-color:$app-gray-darker;
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
            GoogleMapsLoader.KEY = 'YOURGOOGLEAPIKEYHERE';

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
            // ============================================================= //
            // External Use

            // $broadcast this event to geocode an address. When you broadcast
            // this event you should include the following event listeners
            // to receive the results:
            // "successfulGeocode"
            // "failedGeocode"
            geocodeAnAddress: 'onGeocodeAnAddress',

            // When $broadcast-ing this event, you should pass in an object
            // containing the following properties:
            // {
            //     position: ... , // The geocoded LatLng object for the location
            //     label: ..., // The label to use on the marker (under construction)
            //     bounds: ... // The LatLngBounds class to apply to the map
            // }
            placeLocationOnMap: ['addMarker', 'onPanAndZoomToBounds'],
            // ============================================================= //

            // ============================================================= //
            // Manipulate Map (intended for external and internal use)
            centerMap: 'onCenterMap',
            panAndZoomToBounds: 'onPanAndZoomToBounds',
            // ============================================================= //

            // ============================================================= //
            // Internal use
            // Used by the Map component after map is ready. It's used to
            // place the markers on the map.
            successfulLocalGeocode: 'initialPlacementOfMarkers',
            failedLocalGeocode: 'onFailedGeocode',
            // ============================================================= //

        },
        methods:{

            // ============================================================= //
            // External access
            onGeocodeAnAddress: function (address){
                var location = {
                    address: address
                };
                var promise = this.makeAGeocodePromise(location);

                // note, the promise needs to be in array for Promise.all
                // consider cleaning this up
                this.retreiveGeocodeResults([promise], 'dispatch');
            },
            // ============================================================= //

            // ============================================================= //
            // Interacting with the map
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
                        return carry < nextLocation.position.lat() && carry !== null ? carry : nextLocation.position.lat();
                // initial starting value, note that this should be null and not
                // a number like 0 which is a valid lat or lng value.
                }, null);

                var lowestLongitude = this.locations.reduce(function (carry, nextLocation, index){
                        return carry < nextLocation.position.lng() && carry !== null ? carry : nextLocation.position.lng();
                }, null);

                var highestLatitude = this.locations.reduce(function (carry, nextLocation, index){
                        return carry > nextLocation.position.lat() && carry !== null ? carry : nextLocation.position.lat();
                }, null);

                var highestLongitude = this.locations.reduce(function (carry, nextLocation, index){
                        return carry > nextLocation.position.lng() && carry !== null ? carry : nextLocation.position.lng();
                }, null);

                var southWest = new google.maps.LatLng({ lat: lowestLatitude, lng: lowestLongitude});
                var northEast = new google.maps.LatLng({ lat: highestLatitude, lng: highestLongitude});
                var bounds = new google.maps.LatLngBounds(southWest, northEast);
                this.map.fitBounds(bounds);
            },
            onPanAndZoomToBounds: function (markerPayload){
                this.map.fitBounds(markerPayload.bounds);
            },
            addMarker: function (markerPayload){
                var marker = new google.maps.Marker({
                    position: markerPayload.position,
                    animation: google.maps.Animation.DROP,
                    map: this.map
                });

                var content = ["<b>" , markerPayload.label , "</b><br />" , markerPayload.address].join('');
                var infoWindow = new google.maps.InfoWindow({
                    content: content
                });

                marker.addListener('click', function (){
                    infoWindow.open(marker.get('map'), marker);
                });
            },
            // ============================================================= //

            // ============================================================= //
            // Internal tools

            mapReady: function (){
                var markerPromises = this.locations.map(function (location){
                    return this.makeAGeocodePromise(location);
                },this);
                this.retreiveGeocodeResults(markerPromises, 'emit');
            },
            initialPlacementOfMarkers: function (resultPayload){
                resultPayload.forEach(function (result){
                    var markerPayload = {
                        address: result.locationInstance.address,
                        position: result.locationInstance.position,
                        label: result.locationInstance.name,
                        location: result.locationInstance
                    }
                    this.addMarker(markerPayload);
                }, this);
                this.$emit('centerMap');
            },
            onFailedGeocode: function (error){
                console.log(error);
            },

            makeAGeocodePromise: function (location){
                return new Promise(
                    (function (resolve, reject){
                        this.geocoder.geocode({address: location.address}, function (result){
                            if(result !== undefined){
                                location.position = result[0].geometry.location;
                                location.bounds = result[0].geometry.viewport;
                                location.placeId = result[0].place_id;
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
            retreiveGeocodeResults: function (locationPromises, transmissionMethod){
                Promise.all(locationPromises).then(
                    (function (resultPayload){
                        if(transmissionMethod === 'emit'){
                            this.$emit('successfulLocalGeocode', resultPayload);
                        } else if (transmissionMethod === 'dispatch') {
                            this.$dispatch('successfulGeocode', resultPayload);
                        }
                    }).bind(this)
                ).catch(
                    (function (error){
                        if(transmissionMethod === 'emit'){
                            this.$emit('failedLocalGeocode', error);
                        } else if (transmissionMethod === 'dispatch') {
                            this.$dispatch('failedGeocode', error);
                        }
                    }).bind(this)
                );
            }
            // ============================================================= //
        }
    }
</script>
