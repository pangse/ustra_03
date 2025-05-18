import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { CSSProperties } from "react";

// 기본 마커 아이콘(Leaflet 1.7+에서 마커가 안 보일 때 필요)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// 목 데이터 (대한민국 주요 도시 + 주요 방송국)
const mockData = [
  // 주요 도시
  { name: "서울", lat: 37.5665, lng: 126.9780, count: 1200 },
  { name: "부산", lat: 35.1796, lng: 129.0756, count: 800 },
  { name: "대구", lat: 35.8722, lng: 128.6025, count: 500 },
  { name: "인천", lat: 37.4563, lng: 126.7052, count: 600 },
  { name: "광주", lat: 35.1595, lng: 126.8526, count: 400 },
  { name: "대전", lat: 36.3504, lng: 127.3845, count: 450 },
  { name: "울산", lat: 35.5384, lng: 129.3114, count: 350 },
  { name: "수원", lat: 37.2636, lng: 127.0286, count: 300 },
  { name: "고양", lat: 37.6584, lng: 126.8320, count: 280 },
  { name: "용인", lat: 37.2411, lng: 127.1776, count: 270 },
  { name: "창원", lat: 35.2279, lng: 128.6811, count: 260 },
  { name: "성남", lat: 37.4200, lng: 127.1265, count: 250 },
  { name: "청주", lat: 36.6424, lng: 127.4890, count: 240 },
  { name: "전주", lat: 35.8242, lng: 127.1480, count: 230 },
  { name: "천안", lat: 36.8151, lng: 127.1139, count: 220 },
  { name: "안산", lat: 37.3219, lng: 126.8309, count: 210 },
  { name: "안양", lat: 37.3943, lng: 126.9568, count: 200 },
  { name: "남양주", lat: 37.6367, lng: 127.2166, count: 190 },
  { name: "부천", lat: 37.5034, lng: 126.7660, count: 180 },
  { name: "평택", lat: 36.9947, lng: 127.0885, count: 170 },
  // 주요 방송국
  { name: "KBS", lat: 37.5244, lng: 126.9568, count: 100 }, // 서울 영등포구 여의도동
  { name: "MBC", lat: 37.5822, lng: 126.9368, count: 90 },  // 서울 마포구 상암동
  { name: "SBS", lat: 37.5799, lng: 126.8906, count: 85 },  // 서울 양천구 목동
  { name: "EBS", lat: 37.4853, lng: 127.0215, count: 80 },  // 서울 강남구 도곡동
  { name: "YTN", lat: 37.5663, lng: 126.9436, count: 75 },  // 서울 마포구 상암동
  { name: "JTBC", lat: 37.5794, lng: 126.8946, count: 70 }, // 서울 마포구 상암동
];

const center: [number, number] = [36.5, 127.8]; // 대한민국 중심 좌표

const HouseMap = () => (
  <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 16 }}>주요 창고 위치</h2>
    <MapContainer
      center={center as [number, number]}
      zoom={7}
      style={{ height: "400px", width: "100%", borderRadius: 12, boxShadow: "0 2px 8px #0001" } as CSSProperties}
    >
      {/* OpenStreetMap 타일 레이어 */}
      <TileLayer
        attribution={'© OpenStreetMap contributors'}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* 목 데이터 마커 표시 */}
      {mockData.map(city => (
        <Marker key={city.name} position={[city.lat, city.lng] as [number, number]}>
          <Popup>
            <div style={{ fontWeight: 600 }}>{city.name}</div>
            자산 수: {city.count}개
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
);

export default HouseMap;
