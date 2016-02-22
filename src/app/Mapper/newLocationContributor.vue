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
                        <div class="form-group" :class="{ 'has-error': location.hasError }">
                            <label class="control-label" for="address">Address</label>
                            <input type="text" v-model="location.address" class="form-control" name="address" placeholder="123 Main St">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="name">Description</label>
                            <input type="text" v-model="location.name" class="form-control" name="name" placeholder="(Optional)">
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
                    address: null,
                    hasError: false
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
                // note that we're creating the geocoder here because the google library isn't loaded
                // until after all of the components are created. We'll leave it like this for now, but if
                // we wanted to be really clean with our modularity we'd move it into the map.vue file and
                // handle the data passing via dispatch and broadcast events.
                var geocoder = new google.maps.Geocoder;
                geocoder.geocode({ address: this.location.address }, (function (result){
                    debugger;
                    // unmask window
                    if (result.length === 0){
                        this.handleFailedLocationLookup();
                    } else {
                        // is there a way we can do this with vue instead of jquery?
                        $('#newLocationWindow').modal('hide');
                        // should we really do it this way or should we pass back the data from from google?
                        // yep, pull from google
                        var address = result[0].formatted_address;
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
