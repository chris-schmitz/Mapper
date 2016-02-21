<style>

</style>

<template>
    <button data-toggle="modal" data-target="#newLocationWindow" type="button" class="btn btn-success">New Location</button>
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
                        <div class="form-group" :class="{ 'has-error': location.address.error }">
                            <label class="control-label" for="address">Address</label>
                            <input type="text" v-model="location.address.value" class="form-control" name="address" placeholder="123 Main St">
                        </div>
                        <div class="row">
                            <div class="form-group col-sm-7" :class="{ 'has-error': location.city.error }">
                                <label class="control-label" for="city">City</label>
                                <input type="text" v-model="location.city.value" class="form-control" name="city" placeholder="Anytown">
                            </div>
                            <div class="form-group col-sm-2" :class="{ 'has-error': location.state.error }">
                                <label class="control-label" for="state">State</label>
                                <input type="text" v-model="location.state.value" @keydown="limitLength(2, $event)" class="form-control" name="state" placeholder="ZZ">
                            </div>
                            <div class="form-group col-sm-3" :class="{ 'has-error': location.zip.error }">
                                <label class="control-label" for="zip">Zip</label>
                                <input type="text" v-model="location.zip.value" @keydown="limitLength(5, $event)" class="form-control" name="zip" placeholder="12345">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="name">Location Name</label>
                            <input type="text" v-model="location.name" class="form-control" name="name" placeholder="That taco place">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <!-- notice that here they're NOT using the `data-...` attribute to do anything, here's where we can hook in to
                    do whatever save stuff we want -->
                    <button type="button" @click="saveNewLocation" class="btn btn-success">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data: function (){
            return {
                location:{
                    name: null,
                    address: {
                        value: null,
                        error: false
                    },
                    city: {
                        value: null,
                        error: false
                    },
                    state: {
                        value: null,
                        error: false
                    },
                    zip: {
                        value: null,
                        error: false
                    }
                }
            }
        },
        methods:{
            // it seems silly that we have this extra layer here, if we don't
            // end up doing anything now other than calling another method
            // we should eliminate this method and call the locationLookupData
            // directly
            saveNewLocation: function (){
                this.lookupLocationData();
            },
            lookupLocationData: function (){
                // mask window
                var address = [this.location.address.value, this.location.city.value, this.location.state.value, this.location.zip.value].join(' ');
                // note that we're creating the geocoder here because the google library isn't loaded
                // until after all of the components are created. We'll leave it like this for now, but if
                // we wanted to be really clean with our modularity we'd move it into the map.vue file and
                // handle the data passing via dispatch and broadcast events.
                var geocoder = new google.maps.Geocoder;
                geocoder.geocode({ address: address }, (function (result){
                    debugger;
                    // unmask window
                    if (result.length === 0){
                        this.handleFailedLocationLookup();
                    } else {
                        // is there a way we can do this with vue instead of jquery?
                        $('#newLocationWindow').modal('hide');
                        // should we really do it this way or should we pass back the data from from google?
                        var address = {
                            address: this.location.address.value,
                            city: this.location.city.value,
                            state: this.location.state.value,
                            zip: this.location.zip.value
                        };
                        var name = this.location.name;
                        var latLng = result[0].geometry.location;
                        var bounds = result[0].geometry.viewport;
                        this.$dispatch('addNewLocation', address, name, latLng, bounds);
                    }

                }).bind(this));
            },
            handleFailedLocationLookup: function (){
                debugger;
            },
            limitLength: function (limit, event){
                var deleteKey = 46;
                var backspaceKey = 8;
                if(event.currentTarget.value.length >= limit && event.keyCode !== backspaceKey && event.keyCode !== deleteKey){
                    event.preventDefault();
                }
            }
        }
    }
</script>
