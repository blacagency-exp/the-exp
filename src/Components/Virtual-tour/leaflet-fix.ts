// leaflet-fix.ts
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix the icon paths for Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-expect-error: _getIconUrl is being deleted to fix icon path issues in Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});