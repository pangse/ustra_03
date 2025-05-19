import { useEffect, useState } from 'react';

function useFetch(url: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);
  return { data, loading };
}

export default function MockCrudPage() {
  const { data: users, loading: loadingUsers } = useFetch('/api/users');
  const { data: assets, loading: loadingAssets } = useFetch('/api/assets');
  const { data: rentals, loading: loadingRentals } = useFetch('/api/rentals');

  return (
    <div style={{ padding: 24 }}>
      <h1>Mock Data CRUD 테스트</h1>
      <section style={{ margin: '24px 0' }}>
        <h2>Users</h2>
        {loadingUsers ? 'Loading...' : (
          <ul>
            {users.map((u: any) => (
              <li key={u.id}>{u.name} ({u.role}) - {u.email}</li>
            ))}
          </ul>
        )}
      </section>
      <section style={{ margin: '24px 0' }}>
        <h2>Assets</h2>
        {loadingAssets ? 'Loading...' : (
          <ul>
            {assets.map((a: any) => (
              <li key={a.id}>{a.name} ({a.status}) - RFID: {a.rfid_tag}</li>
            ))}
          </ul>
        )}
      </section>
      <section style={{ margin: '24px 0' }}>
        <h2>Rentals</h2>
        {loadingRentals ? 'Loading...' : (
          <ul>
            {rentals.map((r: any) => (
              <li key={r.id}>Asset #{r.materialId} by User #{r.userId} - {r.status} (대여일: {r.rentDate})</li>
            ))}
          </ul>
        )}
      </section>
      <div style={{ marginTop: 40, color: '#888' }}>
        <p>※ 이 페이지는 mock 데이터의 read-only 예시입니다. (추가/삭제/수정은 실제 API 구현 필요)</p>
      </div>
    </div>
  );
} 