//==================== MAP RELATED CODE ====================//
// Function to create a map in the DOM
var map = L.map('map').setView([34.03110283996803, -118.2311195958486], 10)

// Function to set a Tile Layer for the map
var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 19,
    attribution:  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map)

    // FUnction to Disable double click
    map.doubleClickZoom.disable()

    let coord = undefined;
    // When map is clicked
    function helperlatlong(e){
    coord = e.latlng.lat+","+e.latlng.lng
    document.getElementById("coordinates").value = coord
   }
    map.on('click', helperlatlong);

    function placemarker(coordinatedata,crimetypedata){
      console.log(coordinatedata + crimetypedata)
      var marker = L.marker(coordinatedata,{
        opacity: 1
    }).bindPopup(crimetypedata)

    marker.addTo(map)
    }

//Create Layer Groups
var markerlayer = L.layerGroup().addTo(map)
var heatlayer = L.layerGroup().addTo(map)
var layerControl = L.control.layers().addTo(map)

//Ajax call to place markers
marker()

var heatmap = {}

function marker(){
  fetch('/marker')
.then(function (response){
  return response.json()
}).then(function (markerdata){
    for (i in markerdata) {
      row = markerdata[i]
      var coord = row[1]
      if (coord in heatmap)
        heatmap[coord]++
      else
        heatmap[coord] = 1
      coord = coord.split(",").map(Number)
      var Latlng = L.latLng(coord)
        var marker = L.marker(Latlng, {
          opacity: 1
        })
        var heat = L.heatLayer([Latlng], {
          radius: 25
        })
        
        marker.addTo(markerlayer)
        heat.addTo(heatlayer)
  }
})
}

layerControl.addOverlay(markerlayer,"Marker")
layerControl.addOverlay(heatlayer,"Heatmap")
//=========================================//

//======================= FUNCTIONS RELATED TO TOPBARS ==================================//
function clearmap(){
  $.ajax({
    type: "GET",
    url: "/cleardb"
  })
  location.reload(true)
}

//=======================================================================================//

//======================= FUNCTIONS RELATED TO SIDEBARS AND POPUPS ======================//
  // Function to create popups
function expand_data(target){
  console.log("This is "+target)
  if(popupelementexist(target) == false){
    var pop_up = document.createElement('div')
    pop_up.classList.add('POPUP_CARD')
    pop_up.setAttribute('id',"pop_up"+"_"+target)
    document.getElementById("POPUP_LAYER").appendChild(pop_up)

    var exit = document.createElement('span')
    exit.classList.add('CLOSE')
    exit.setAttribute('id',target + "popup_exit")
    exit.innerHTML = "+"
    document.getElementById("pop_up"+"_"+target).appendChild(exit)

    var container = document.createElement('div')
    container.classList.add('POPUPCARD_CONTAINER')
    container.setAttribute('id',"pop_up_card"+"_"+target)
    document.getElementById("pop_up"+"_"+target).appendChild(container)

    var id = target
    $.ajax({
      type: "POST",
      url: "/entrydetails",
      data: id,
      success:function(dataset){
        entry = dataset[0]
        var location = document.createElement('div')
        location.textContent = "ADDRESS: "+ entry[2]
        document.getElementById("pop_up_card"+"_"+target).appendChild(location)

        linebreak(target)

        var zone = document.createElement('div')
        zone.textContent = "ZONE: "+ entry[3]
        document.getElementById("pop_up_card"+"_"+target).appendChild(zone)

        linebreak(target)

        var date = document.createElement('div')
        date.textContent = "DATE: "+ entry[4]
        document.getElementById("pop_up_card"+"_"+target).appendChild(date)

        linebreak(target)

        var time = document.createElement('div')
        time.textContent = "TIME: "+ entry[5]
        document.getElementById("pop_up_card"+"_"+target).appendChild(time)

        linebreak(target)

        var crimetype = document.createElement('div')
        crimetype.textContent = "CRIME TYPE: "+ entry[6] 
        document.getElementById("pop_up_card"+"_"+target).appendChild(crimetype)

        linebreak(target)

        var incidentnumber = document.createElement('div')
        incidentnumber.textContent = "INCIDENT NUMBER: "+ entry[7]
        document.getElementById("pop_up_card"+"_"+target).appendChild(incidentnumber)

        linebreak(target)

        var label = document.createElement('label')
        label.textContent = "BRIEF FACTS: "
        document.getElementById("pop_up_card"+"_"+target).appendChild(label)
        
        var brieffacts = document.createElement('div')
        brieffacts.classList.add('BRIEFFACTS')
        brieffacts.textContent = entry[8]
        document.getElementById("pop_up_card"+"_"+target).appendChild(brieffacts)

        linebreak(target)

        var delete_entry = document.createElement('button')
        delete_entry.textContent = "Delete Entry"
        delete_entry.type = "submit"
        document.getElementById("pop_up_card"+"_"+target).appendChild(delete_entry)
        delete_entry.addEventListener('click',function(){
        var id = target
        $.ajax({
          type: "POST",
          url: "/deleteentry",
          data: id,
        })
        window.location.reload()
        })
      }
    })
}
  function linebreak(target){
    var br = document.createElement('br')
    document.getElementById("pop_up_card"+"_"+target).appendChild(br)
  }
  // Check if a popup element exists
  function popupelementexist(elmnt) {
    console.log(elmnt);
    var checkid = document.getElementById("pop_up"+"_"+elmnt)
    console.log(checkid)
    if(checkid)
    {
      console.log("true")
      return true
    }
    else
    { 
      console.log("false")
      return false
    }
  }
       

  }
  
  // Function to create close capabilities in the generated pop ups
  const popuplayer = document.getElementById("POPUP_LAYER");
  popuplayer.addEventListener('click',function(event){
    const target = event.target;

    if(target.classList.contains('CLOSE')){
      target.parentNode.remove();
    }
    if(target.classList.contains('POPUP_CARD')){
      dragElement(document.getElementById(target.id));
    }
  })


//Function for draggable elements
  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)){
      document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    }
    function dragMouseDown(e){
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e){
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3-e.clientX;
      pos2 = pos4-e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop-pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft-pos1) + "px";
    }

    function closeDragElement(){
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  //========================================//
