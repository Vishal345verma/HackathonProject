document.getElementById('getLocationButton').addEventListener('click', function() {
    if (navigator.geolocation) {
        getLocation();
        setInterval(getLocation, 120000); // 120000 milliseconds = 2 minutes
    } else {
        document.getElementById('output').innerHTML = "Geolocation is not supported by this browser.";
    }
});

function getLocation() {
    navigator.geolocation.getCurrentPosition(sendLocation, showError);
}

function sendLocation(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    document.getElementById('output').innerHTML = `Latitude: ${lat} <br> Longitude: ${lon}`;

    var locationData = {
        latitude: lat,
        longitude: lon,
        timestamp: new Date().toISOString()
    };

    fetch('https://api.jsonbin.io/v3/b/6698f51bacd3cb34a867d428', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': '$2a$10$SgmbORULhJItynMnUIQ.Iuo6L6fNZU/rXLFsGRhOgQh6jkpsyQjo6' // Replace with your actual API key
        },
        body: JSON.stringify({
            locations: [locationData] // Replace with your actual data structure if needed
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('output').innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('output').innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('output').innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('output').innerHTML = "An unknown error occurred.";
            break;
    }
}