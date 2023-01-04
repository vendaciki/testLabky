var center = SMap.Coords.fromWGS84(15.86583, 49.50390);
var mapa = new SMap(JAK.gel("mapa"), center, 12);
mapa.addControl(new SMap.Control.Sync()); // Aby mapa reagovala na změnu velikosti průhledu

// mapa.addDefaultControls() // základní ovládací prvky
/* když aktivujeme ovládací prvky, je třeba zapoznámkovat ručně (vlastní) vložené prvky */


	/* MAPY */
mapa.addDefaultLayer(SMap.DEF_OPHOTO); // letecká
mapa.addDefaultLayer(SMap.DEF_TURIST); // turistická
mapa.addDefaultLayer(SMap.DEF_BASE).enable(); // základní

	/* OVLÁDÁNÍ ZOOMU MYŠÍ */
mapa.addControl(new SMap.Control.Mouse(SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM));

	/* OVLÁDÁNÍ TLAČÍTEK ZOOMU */
mapa.addControl(new SMap.Control.Zoom({}, {titles: ["Přiblížit", "Oddálit"],
showZoomMenu: false}));

	/* MĚŘÍTKO */
mapa.addControl(new SMap.Control.Scale(), {bottom:"21px",left:"6px"});

	/* VYSKAKUJÍCÍ POLE S MAPAMA */
var layerSwitch = new SMap.Control.Layer({
	width: 65,
	items: 3, // počet map v okně
	page: 4,
}); 

	layerSwitch.addDefaultLayer(SMap.DEF_BASE); // základní
	layerSwitch.addDefaultLayer(SMap.DEF_OPHOTO); // letecká
	layerSwitch.addDefaultLayer(SMap.DEF_TURIST); // turistická
	mapa.addControl(layerSwitch, {left:"8px", top:"9px"}); // jako margin


/****************************************/
/*                KARTA                 */
/****************************************/

var znacky = [];
var souradnice = [];

for (var name in data) { // Vyrobit značky
    var coor = SMap.Coords.fromWGS84(data[name][0].trim()); // Souřadnice značky, z textového formátu souřadnic
    
    var options = {
        url: "bodka.png",
        title: name,
        anchor: {left:10, bottom: 1}  // Ukotvení značky za bod uprostřed dole
    }
    
    var znacka = new SMap.Marker(coor, null, options);

    var c = new SMap.Card();
    c.setSize(400); // Šířka, výška

    c.getHeader().innerHTML = name;
	c.getBody().innerHTML = data[name][1]
    c.getBody().style.margin = "5px 0px 0px";
    c.getBody().style.backgroundColor = "#c8e9f0";
	c.getBody().style.overflow = "hidden";
    c.getFooter().innerHTML = data[name][2];

	znacka.decorate(SMap.Marker.Feature.Card, c);
    souradnice.push(coor);
    znacky.push(znacka);
}

var options = {
    anchor: {left:0.5, top:0.5}}
znacky[1].decorate(SMap.Marker.Feature.RelativeAnchor, options);

var vrstva = new SMap.Layer.Marker(); // vrstva se značkami
mapa.addLayer(vrstva); // přidat ji do mapy
vrstva.enable(); // a povolit
for (var i=0;i<znacky.length;i++) {
    vrstva.addMarker(znacky[i]);
}

/*
var cz = mapa.computeCenterZoom(souradnice); // Spočítá pozici mapy tak, aby značky byly vidět
mapa.setCenterZoom(cz[0], cz[1]);     */   



/****************************************/
/*               MINIMAPA               */
/****************************************/

var mini1 = new SMap.Control.Minimap(162, 103, {color: "#000", opacity: 0});

mapa.addControl(mini1, {right:"0px", bottom:"0px"});

function myfunc() {
	alert(Object.keys(data).length);
}

/****************************************/
/*               SIDEBAR                */
/****************************************/


  	/* NAČTENÍ JÍDEL DO SIDEBARU */
function nactiLabky() {
	var i = 0
	for (var name in data) { 
		i = i + 1
		const x = document.createElement("li");
		x.setAttribute("id", i);
		var somePlace = document.getElementById("myMenu");
		somePlace.appendChild(x);
		const y = document.createElement("a");
		y.setAttribute("id", i);
		y.innerText = name;
		var somePlace2 = document.getElementById(i);
		somePlace2.appendChild(y);} 
}


function SidebarSearch() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("mySearch");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myMenu");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

  	/* SIDENAV - NAČÍTÁNÍ LABEK Z LISTU */
document.onclick = function(e){
	var x = e.target.innerText;
	var coor = data[x][0].trim()
	var newCoord = SMap.Coords.fromWGS84(coor);
	mapa.setCenter(newCoord);
	mapa.setZoom(15);
}
	







function openNav() {
	document.getElementById("sidenav").style.width = "25%";
} 
  
function closeNav() {
	document.getElementById("sidenav").style.width = "0";
}