/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 function getPosition() {
   var options = {
      enableHighAccuracy: true,
      maximumAge: 3600000
   }

   $("#loading").html("<img src='img/loading.gif' />");
   var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

   function onSuccess(position) {
     var lat = position.coords.latitude;         
     var lang = position.coords.longitude; 
     app.googleMapPos(lat,lang);
     alert("Setting Position Success !!!"); 
     $("#loading").html("");
   };

   function onError(error) {
      //alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
      var lat = -8.573826 ;
      var lang = 115.222807 ;
      app.googleMapPos(lat,lang);  
      alert("Setting Position Success !!!"); 
      $("#loading").html("");
   }

}

function watchPosition() {
   var options = {
      maximumAge: 3600000,
      timeout: 3000,
      enableHighAccuracy: true,
   }
   var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

   function onSuccess(position) {
       var lat = position.coords.latitude;         
       var lang = position.coords.longitude; 
       app.googleMapPos(lat,lang); 
      /*alert('Latitude: '          + position.coords.latitude          + '\n' +
         'Longitude: '         + position.coords.longitude         + '\n' +
         'Altitude: '          + position.coords.altitude          + '\n' +
         'Accuracy: '          + position.coords.accuracy          + '\n' +
         'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
         'Heading: '           + position.coords.heading           + '\n' +
         'Speed: '             + position.coords.speed             + '\n' +
         'Timestamp: '         + position.timestamp                + '\n');*/
       
   };

   function onError(error) {
      //alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
      var lat = -8.673826 ;
      var lang = 115.222807 ;
      app.googleMapPos(lat,lang);  
   }
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.googleMap(-8.673826,115.222807);

    },

    googleMap(lat,lang){
        var myLatlng = new google.maps.LatLng(lat,lang);
        var mapOptions = {zoom: 7,center: myLatlng}
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
         
        //fetch data
        $.ajax({
             type: "POST",
             url:window.location.href+"proxy/https://zennagames.000webhostapp.com/android_data/fivefoot/select.php",
             data: {},
             crossDomain: true,
             cache: false,
             beforeSend: function(){
               //$("#insert").val('Connecting...');
             },
             success: function(data){
                dataParsed = JSON.parse(data);
                alert(dataParsed["PEOPLE"]);
             }
        });
    },

    googleMapPos(lat,lang){
        //Google Maps
        var myLatlng = new google.maps.LatLng(lat,lang);
        var mapOptions = {zoom: 15,center: myLatlng}
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        var marker = new google.maps.Marker({position: myLatlng,map: map});
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        document.getElementById("getPosition").addEventListener("click", getPosition);
        document.getElementById("watchPosition").addEventListener("click", watchPosition);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    }
};
