// import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import L from 'leaflet'

import { ElementInterface } from "./trip-playground"

// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: '/images/marker-icon-2x.png',
//   iconUrl: '/images/marker-icon.png',
//   shadowUrl: '/images/marker-shadow.png',
// })

// export default function Map({ elements }) {
//   const center: L.LatLngExpression = [0, 0] // Default center
//   const zoom = 2

//   // Group elements by type
//   const groupedElements = elements.reduce((acc, element) => {
//     if (!acc[element.type]) {
//       acc[element.type] = []
//     }
//     acc[element.type].push(element)
//     return acc
//   }, {})

//   // Create connections between elements
//   const connections: [number, number][][] = []
//   for (let i = 0; i < elements.length - 1; i++) {
//     const current = elements[i]
//     const next = elements[i + 1]
//     if (current.details.lat && current.details.lng && next.details.lat && next.details.lng) {
//       connections.push([
//         [current.details.lat, current.details.lng],
//         [next.details.lat, next.details.lng]
//       ])
//     }
//   }

//   return (
//     <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       {Object.entries(groupedElements).map(([type, elements]) => (
//         elements.map((element, index) => (
//           <Marker 
//             key={`${type}-${index}`} 
//             position={[element.details.lat || 0, element.details.lng || 0]}
//             icon={L.divIcon({
//               className: 'custom-icon',
//               html: `<div style="background-color: ${getColorForType(type)}; width: 10px; height: 10px; border-radius: 50%;"></div>`,
//             })}
//           >
//             <Popup>
//               <h3>{element.details.description}</h3>
//               <p>Type: {type}</p>
//               <p>Price: ${element.details.price}</p>
//               {element.details.additionalInfo && <p>{element.details.additionalInfo}</p>}
//             </Popup>
//           </Marker>
//         ))
//       ))}
//       {connections.map((connection, index) => (
//         <Polyline key={index} positions={connection} color="blue" />
//       ))}
//     </MapContainer>
//   )
// }

// function getColorForType(type) {
//   switch (type) {
//     case 'flight': return 'blue'
//     case 'hotel': return 'green'
//     case 'activity': return 'orange'
//     case 'transport': return 'purple'
//     default: return 'gray'
//   }
// }


export default function Map({
  elements
}: {
  elements: ElementInterface[]
}) {
  console.log(elements)
  return (<h2>Interactive Map</h2>)
}