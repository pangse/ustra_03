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
  { name: "서울", lat: 37.5665, lng: 126.9780, assetCount: 1200, rentalCount: 300, address: "서울특별시 중구 세종대로", contact: "02-123-4567", manager: "김서울" },
  { name: "부산", lat: 35.1796, lng: 129.0756, assetCount: 800, rentalCount: 200, address: "부산광역시 중구 중앙대로", contact: "051-123-4567", manager: "박부산" },
  { name: "대구", lat: 35.8722, lng: 128.6025, assetCount: 500, rentalCount: 120, address: "대구광역시 중구 국채보상로", contact: "053-123-4567", manager: "이대구" },
  { name: "인천", lat: 37.4563, lng: 126.7052, assetCount: 600, rentalCount: 150, address: "인천광역시 남동구 예술로", contact: "032-123-4567", manager: "최인천" },
  { name: "광주", lat: 35.1595, lng: 126.8526, assetCount: 400, rentalCount: 90, address: "광주광역시 동구 중앙로", contact: "062-123-4567", manager: "정광주" },
  { name: "대전", lat: 36.3504, lng: 127.3845, assetCount: 450, rentalCount: 100, address: "대전광역시 서구 둔산대로", contact: "042-123-4567", manager: "한대전" },
  { name: "울산", lat: 35.5384, lng: 129.3114, assetCount: 350, rentalCount: 80, address: "울산광역시 남구 중앙로", contact: "052-123-4567", manager: "오울산" },
  { name: "수원", lat: 37.2636, lng: 127.0286, assetCount: 300, rentalCount: 70, address: "경기도 수원시 팔달구 정조로", contact: "031-123-4567", manager: "유수원" },
  { name: "고양", lat: 37.6584, lng: 126.8320, assetCount: 280, rentalCount: 65, address: "경기도 고양시 덕양구 고양대로", contact: "031-234-5678", manager: "문고양" },
  { name: "용인", lat: 37.2411, lng: 127.1776, assetCount: 270, rentalCount: 60, address: "경기도 용인시 처인구 중부대로", contact: "031-345-6789", manager: "장용인" },
  { name: "창원", lat: 35.2279, lng: 128.6811, assetCount: 260, rentalCount: 55, address: "경상남도 창원시 의창구 중앙대로", contact: "055-123-4567", manager: "임창원" },
  { name: "성남", lat: 37.4200, lng: 127.1265, assetCount: 250, rentalCount: 50, address: "경기도 성남시 수정구 산성대로", contact: "031-456-7890", manager: "서성남" },
  { name: "청주", lat: 36.6424, lng: 127.4890, assetCount: 240, rentalCount: 48, address: "충청북도 청주시 상당구 상당로", contact: "043-123-4567", manager: "신청주" },
  { name: "전주", lat: 35.8242, lng: 127.1480, assetCount: 230, rentalCount: 45, address: "전라북도 전주시 완산구 전주천동로", contact: "063-123-4567", manager: "권전주" },
  { name: "천안", lat: 36.8151, lng: 127.1139, assetCount: 220, rentalCount: 43, address: "충청남도 천안시 동남구 만남로", contact: "041-123-4567", manager: "백천안" },
  { name: "안산", lat: 37.3219, lng: 126.8309, assetCount: 210, rentalCount: 41, address: "경기도 안산시 단원구 중앙대로", contact: "031-567-8901", manager: "남안산" },
  { name: "안양", lat: 37.3943, lng: 126.9568, assetCount: 200, rentalCount: 40, address: "경기도 안양시 만안구 안양로", contact: "031-678-9012", manager: "심안양" },
  { name: "남양주", lat: 37.6367, lng: 127.2166, assetCount: 190, rentalCount: 38, address: "경기도 남양주시 경춘로", contact: "031-789-0123", manager: "조남양주" },
  { name: "부천", lat: 37.5034, lng: 126.7660, assetCount: 180, rentalCount: 36, address: "경기도 부천시 길주로", contact: "032-234-5678", manager: "구부천" },
  { name: "평택", lat: 36.9947, lng: 127.0885, assetCount: 170, rentalCount: 34, address: "경기도 평택시 평택로", contact: "031-890-1234", manager: "표평택" },
  // 주요 방송국
  { name: "KBS", lat: 37.5244, lng: 126.9568, assetCount: 100, rentalCount: 25, address: "서울 영등포구 여의도동", contact: "02-789-1234", manager: "강KBS" },
  { name: "MBC", lat: 37.5822, lng: 126.9368, assetCount: 90, rentalCount: 22, address: "서울 마포구 상암동", contact: "02-789-5678", manager: "민MBC" },
  { name: "SBS", lat: 37.5799, lng: 126.8906, assetCount: 85, rentalCount: 21, address: "서울 양천구 목동", contact: "02-789-3456", manager: "송SBS" },
  { name: "EBS", lat: 37.4853, lng: 127.0215, assetCount: 80, rentalCount: 20, address: "서울 강남구 도곡동", contact: "02-789-2345", manager: "이EBS" },
  { name: "YTN", lat: 37.5663, lng: 126.9436, assetCount: 75, rentalCount: 19, address: "서울 마포구 상암동", contact: "02-789-4567", manager: "윤YTN" },
  { name: "JTBC", lat: 37.5794, lng: 126.8946, assetCount: 70, rentalCount: 18, address: "서울 마포구 상암동", contact: "02-789-5670", manager: "정JTBC" },
];

const center: [number, number] = [37.5665, 126.9780]; // 서울 중심 좌표

const HouseMap = () => (
  <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 16 }}>주요 창고 위치</h2>
    <MapContainer
      center={center as [number, number]}
      zoom={11}
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
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{city.name}</div>
            <div>자산 수: {city.assetCount}개</div>
            <div>대여 수: {city.rentalCount}건</div>
            <div>창고 주소: {city.address}</div>
            <div>연락처: {city.contact}</div>
            <div>담당자: {city.manager}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
);

export default HouseMap;
