//[[-135,35.35515017991291],[-45,35.35515017991291],[45,35.35515017991291],[135,35.35515017991291]]


const bbox = [[-135,35.35515017991291],[-45,35.35515017991291],[45,35.35515017991291],[135,35.35515017991291]];

// https://ows.terrestris.de/osm/service?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=SRTM30-Hillshade&HEIGHT=128&WIDTH=258&SRS=EPSG:3857&STYLES=&BBOX=754537.982649482,6545165.75830494,844317.2886574034,6600561.500309828

const url = `https://ows.terrestris.de/osm/service?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=SRTM30-Hillshade&HEIGHT=512&WIDTH=512&SRS=EPSG:4326&STYLES=&BBOX=-180,35.35515017991291,180,90`;
