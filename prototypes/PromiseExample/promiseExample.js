
var geocoder = new google.maps.Geocoder;

var geocodeAddresses = function (address){

    return new Promise(function (resolve, reject){

        geocoder.geocode({address: address}, function (result){
            // note that resolve and reject should be used _in the callback_ of
            // the async request. It's obvious now but for some reason I missed
            // this when reading through the docs.
            if(result !== undefined){
                resolve(result);
            } else {
                reject(new Error(result));
            }
        });

    });

}

// an example of a single request via the promise
// geocodeAddresses('123 Main Street').then(function (result){
//     console.log('promise result success: ' + result);
// }, function (error){
//     console.log('promise result error: ' + error);
// });

// an example of multiple requests via the Promise.all static(?) method
Promise.all([
    geocodeAddresses('100 Washington Ave, 63102'),
    geocodeAddresses('3260 Hampton Ave 63139')
]).then(function (results){
    console.log('promise result success: ');
    results.forEach(function (result){
        console.group('Lat/Lng for ' + result[0].formatted_address);
            console.log('lat: ' + result[0].geometry.location.lat());
            console.log('lng: ' + result[0].geometry.location.lng());
        console.groupEnd();
    })
}, function (error){
    console.log('promise result error: ' + error);
});
