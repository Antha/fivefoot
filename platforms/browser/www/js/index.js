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
     $("#loading").html("");
     var lat = position.coords.latitude;         
     var lang = position.coords.longitude; 
     googleMapPos(lat,lang,"red.png",$("#PEOPLE_NAME").val());
     app.doInsert(lat,lang,$("#PEOPLE_NAME").val());
     alert("Setting Position Success !!!"); 
   };

   function onError(error) {
      //alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
      $("#loading").html("");
      var lat = -9.573826 ;
      var lang = 115.222807 ;
      googleMapPos(lat,lang,"red.png",$("#PEOPLE_NAME").val());  
      app.doInsert(lat,lang,$("#PEOPLE_NAME").val());
      alert("Setting Position Error !!!"); 
   }

}

/*
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
       googleMapPos(lat,lang,"red.png"); 
       alert("Setting Position Success !!!"); 
   };

   function onError(error) {
      //alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
      var lat = -8.773826 ;
      var lang = 115.222807 ;
      googleMapPos(lat,lang,"red.png");  
      app.doInsert(lat,lang); 
      alert("Setting Position Error !!!"); 
   }
}*/

function googleMap(lat,lang){
        myLatlng = new google.maps.LatLng(lat,lang);
        mapOptions = {zoom: 8,center: myLatlng}
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function googleMapPos(lat,lang,iconurl,people){
        var icon = {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            labelOrigin: new google.maps.Point(0, 0),
            size: new google.maps.Size(32,32),
            anchor: new google.maps.Point(0,0)
        };

        //Google Maps
        myLatlng = new google.maps.LatLng(lat,lang);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: icon,
            labelAnchor: new google.maps.Point(20, 0),
            label:  {
              text: people,
              color: "black",
              fontSize: "10px",
              fontWeight: "bold",
            }
        });
        map.setCenter(marker.getPosition());
}

function goto(lat,long){
  map.setZoom(17);      // This will trigger a zoom_changed on the map
  map.setCenter(new google.maps.LatLng(lat, long));
}

function insertMap(lat,lang,people){
        //fetch data
        $.ajax({
             type: "POST",
             url:"https://zennagames.000webhostapp.com/android_data/fivefoot/insert.php",
             data: {LAT:lat,LONG:lang,PEOPLE:people},
             crossDomain: true,
             cache: false,
             success: function(data){
                 dataParsed = JSON.parse(data);
                 //alert(dataParsed["PEOPLE"]);

                 /*for (var i = 0; i < LONG.length; i++) {
                    googleMapPos(LAT[i],LONG[i],"red.png");
                 }*/
             }
        });
}

var myLatlng ;
var mapOptions ;
var map ;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        googleMap(-8.673826,115.222807);
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
        //document.getElementById("getPosition").addEventListener("click", getPosition);
        //document.getElementById("watchPosition").addEventListener("click", watchPosition);
        
        //fetch data
        $.ajax({
             type: "GET",
             url:"https://zennagames.000webhostapp.com/android_data/fivefoot/select.php",
             data: {},
             crossDomain: true,
             cache: false,
             beforeSend: function () {
                
             },
             success: function(data){
                 dataParsed = JSON.parse(data);
                 LONG = dataParsed.LONG;
                 LAT = dataParsed.LAT;
                 PEOPLE = dataParsed.PEOPLE;
                 THETIME = dataParsed.THETIME;
                 //alert(dataParsed["PEOPLE"]);

                 for (var i = 0; i < LONG.length; i++) {
                    googleMapPos(LAT[i],LONG[i],"red.png",PEOPLE[i]+" "+THETIME[i]);

                    //insert into table
                    $("#data-table table tbody").append(
                      '<tr>'+
                      '<td>'+PEOPLE[i]+'</td>'+
                      '<td><button onclick="goto(\''+LAT[i]+'\',\''+LONG[i]+'\')">GO</button></td>'+
                      '</tr>'); 
                 }
             }
        });
    },
    doInsert: function(lat,lang,people){
      //alert("Test");
      document.addEventListener('deviceready', insertMap(lat,lang,people), false);
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


$("#getPosition").click(function(){
  if($("#PEOPLE_NAME").val() == ""){
    alert("PLEASE INSERT YOUR NAME");
    return false;
  }
  getPosition();
  app.doInsert();
});