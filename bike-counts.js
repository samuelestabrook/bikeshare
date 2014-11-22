function init() {

//var startWord = "ocean";

map = new OpenLayers.Map("mapdiv", {
            projection: mercator
        });

        var mapnik = new OpenLayers.Layer.OSM();

        map.addLayer(mapnik);

        var geographic = new OpenLayers.Projection("EPSG:4326");
        var mercator = new OpenLayers.Projection("EPSG:900913");

        var lonlat = new OpenLayers.LonLat(-77.039525, 38.912690).transform(
            geographic, // transform from WGS 1984
            mercator // to Spherical Mercator
          );

        var zoom = 13;

        var markers = new OpenLayers.Layer.Markers( "Markers" );
        
        map.addLayer(markers);
        
        markers.addMarker(new OpenLayers.Marker(lonlat));

        // allow testing of specific renderers via "?renderer=Canvas", etc
        //var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        //renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
        
        var context = {
            getSize: function(feature) {
                return feature.attributes["counts"] / map.getResolution() * .08;
            }
        };
        
        var template = {
        pointRadius: "${getSize}", // using context.getSize(feature)
        fillColor: "#0dce71",
        fillOpacity: 0.6,
        strokeWidth: 1,
        strokeColor: "#ffffff"
        };

        var style = new OpenLayers.Style(template, {context: context});

        var wfs = new OpenLayers.Layer.Vector("WFS", {
            strategies : [new OpenLayers.Strategy.BBOX()],
            protocol : new OpenLayers.Protocol.WFS({
                //version : "2.0.0",
                url : "http://localhost:8080/geoserver/wfs",
                featurePrefix : "bike",
                featureType : "results_table",
                featureNS : "http://localhost:8080/bike",
                srsName : "EPSG:4326",
                geometryName : "geom"
            }),
            styleMap: new OpenLayers.StyleMap(style),
            projection: geographic
        //    renderers: renderer
        });

        //wfs.mergeNewParams({viewparams: "word:"+startWord});

        map.addLayer(wfs);

        map.setCenter(lonlat, zoom);
      }
      window.onload = init;