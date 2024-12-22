// 'use client'

// import { useState } from 'react'
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import L from 'leaflet'

// // Fix for default marker icon
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: '/images/marker-icon-2x.png',
//   iconUrl: '/images/marker-icon.png',
//   shadowUrl: '/images/marker-shadow.png',
// })

// export default function InteractiveMap({ destinations }) {
//   const [center, setCenter] = useState([0, 0]) // Default center
//   const zoom = 2

//   return (
//     <div className="h-96 w-full mb-8">
//       <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {destinations.map((dest) => (
//           <Marker key={dest.id} position={[dest.lat, dest.lng]}>
//             <Popup>
//               <h3>{dest.name}</h3>
//               <p>{dest.description}</p>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   )
// }


export default function InteractiveMap() {
  return (<h2>Interactive Map</h2>)
}