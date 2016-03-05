<style lang="sass">
    #newLocationWindow{
        .btn{
            width: 80px;
        }
    }
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
                    <div v-show='modalBodyDisplay === "getUserInput"'>
                        <form>
                            <div class="form-group" :class="{ 'has-error': location.hasError }">
                                <label class="control-label" for="address">Address</label>
                                <input type="text" v-model="location.address" class="form-control" name="address" placeholder="e.g. 123 Main St">
                            </div>
                            <div class="form-group">
                                <label class="control-label" for="name">Label for Location Button</label>
                                <input type="text" v-model="location.name" class="form-control" name="name" placeholder="e.g. Town Hall">
                            </div>
                        </form>
                    </div>
                    <div v-show='modalBodyDisplay === "confirmGeocodedValue"'>
                        <div class="confirmation-label">
                            Place this address on the map?
                        </div>
                         <b>{{ addressToConfirm }}</b>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" @click="resetWindow" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <!-- notice that here they're NOT using the `data-...` attribute to do anything, here's where we can hook in to
                    do whatever save stuff we want -->
                    <button type="button" @click="submitClick" class="btn btn-success">{{ submitButtonText }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    function initialState() {
        return {
            modalBodyDisplay: 'getUserInput', // possible values: 'getUserInput', 'confirmGeocodedValue'
            submitButtonText: 'Lookup', // possible values 'Lookup', 'Yes'
            addressToConfirm: null,
            bestViewedByTheseBounds: null,
            location:{
                name: null,
                address: null,
                position: null
            }
        }
    }

    module.exports = {


        data: function (){
            return initialState();
        },
        events:{
            successfulGeocode: 'onSuccessfulGeocode',
            failedGeocode: 'onFailedGeocode',
        },
        methods:{
            submitClick: function (){
                if(this.modalBodyDisplay === 'getUserInput'){
                    this.lookupLocationData();
                } else {
                    this.saveNewLocation();
                }
            },

            lookupLocationData: function (){
                this.maskWindow();
                this.$dispatch('geocodeThisAddress', this.location.address);
            },

            saveNewLocation: function (){
                // is there a way we can do this with vue instead of jquery?
                $('#newLocationWindow').modal('hide');
                this.$dispatch(
                    'addNewLocation',
                    this.location.address,
                    this.location.name,
                    this.location.position,
                    this.location.placeId,
                    this.bestViewedByTheseBounds
                );
                this.resetWindow();
            },

            onSuccessfulGeocode: function (result){
                this.modalBodyDisplay = 'confirmGeocodedValue';
                this.submitButtonText = 'Yes';
                this.unmaskWindow();
                this.addressToConfirm = result[0].geocodeResults.formatted_address;
                this.location.address = result[0].geocodeResults.formatted_address;
                this.location.position = result[0].geocodeResults.geometry.location;
                this.location.placeId = result[0].geocodeResults.place_id;
                this.bestViewedByTheseBounds = result[0].geocodeResults.geometry.viewport;
            },
            onFailedGeocode: function (error){
                this.unmaskWindow();
                alert(error)
            },
            maskWindow:function (){
            },
            unmaskWindow: function (){
            },
            resetWindow: function (){
                this.$data = initialState();
            }
        }
    }
</script>
