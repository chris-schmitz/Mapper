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
                    <button type="button" @click="lookupLocationData" class="btn btn-success">Lookup</button>
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
        events:{
            failedLocationLookup: 'onFailedLocationLookup',
            successfulLocationLookup: 'onSuccessfulLocationLookup'
        },
        methods:{
            // it seems silly that we have this extra layer here, if we don't
            // end up doing anything now other than calling another method
            // we should eliminate this method and call the locationLookupData
            // directly
            saveNewLocation: function (){
                // is there a way we can do this with vue instead of jquery?
                $('#newLocationWindow').modal('hide');

            },
            lookupLocationData: function (){
                this.maskWindow();
                debugger;
                this.$dispatch('sendLookupLocationRequest', this.location.address);
            },
            onSuccessfulLocationLookup: function (result){
                debugger;
                this.unmaskWindow();
                var address = result[0].formatted_address;
                var latLng = result[0].geometry.location;
                var bounds = result[0].geometry.viewport;

                // confirm that the address is correct
                // if yes, add to the map
                // don't save, we'll do that from the pin
                // description
            },
            onFailedLocationLookup: function (){
                debugger;
                this.unmaskWindow();
            },
            maskWindow:function (){
            },
            unmaskWindow: function (){
            }
        }
    }
</script>
