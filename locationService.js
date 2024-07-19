document.getElementById('getLocationButton').addEventListener('click', function() {
    document.getElementById('loading').style.visibility = 'visible';
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
    document.getElementById('loading').style.visibility = 'hidden';
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

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function haversineDistance(coords1, coords2) {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = coords1.latitude;
    const lon1 = coords1.longitude;
    const lat2 = coords2.latitude;
    const lon2 = coords2.longitude;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance;
}

// Example usage:
const location1 = { latitude: 17.5200, longitude: 78.4050 }; // Berlin
const location2 = { latitude: 17.5201, longitude: 78.4049 };  // Paris

const distance = haversineDistance(location1, location2);
console.log(`Distance: ${distance.toFixed(2)} km`);


document.getElementById('loading').style.visibility = 'hidden';