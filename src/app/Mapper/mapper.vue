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
            <button data-toggle="modal" data-target="#newLocationWindow" type="button" class="btn btn-success">New Location</button>
        </div>
    </div>
    <div class="cs-alert" v-show="showNewLocationWindow">

        <div class="modal fade" id="newLocationWindow" tabindex="-1"> <!-- the lightbox style dark overlay -->
            <div class="modal-dialog"> <!-- the box around the modal that makes it float(?) -->
                <div class="modal-content modal-content-primary"> <!-- the start of the actual modal window. From here on it's structured similar to a panel -->
                    <div class="modal-header">
                        <!-- note that they're handling the js actions via the `data-...` tags, not onclick -->
                        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                        <h4 class="modal-title">New Location</h4>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="address">Address</label>
                                <input type="text" class="form-control" name="address" placeholder="123 Main St">
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-7">
                                    <label for="city">City</label>
                                    <input type="text" class="form-control" name="city" placeholder="Anytown">
                                </div>
                                <div class="form-group col-sm-2">
                                    <label for="state">State</label>
                                    <input type="text" class="form-control" name="state" placeholder="ZZ">
                                </div>
                                <div class="form-group col-sm-3">
                                    <label for="zip">Zip</label>
                                    <input type="text" class="form-control" name="zip" placeholder="12345">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <!-- notice that here they're NOT using the `data-...` attribute to do anything, here's where we can hook in to
                            do whatever save stuff we want -->
                        <button type="button" class="btn btn-success">Save</button>
                    </div>
                </div>
            </div>
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
            addANewLocation: function (address){
                debugger;
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
