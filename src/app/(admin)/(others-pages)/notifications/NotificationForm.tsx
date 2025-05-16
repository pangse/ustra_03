export default function NotificationForm({ notification, onClose, onSuccess }: any) {
  return (
    <div>
      <h2>Notification Form</h2>
      <pre>{JSON.stringify(notification, null, 2)}</pre>
      <button onClick={onClose}>닫기</button>
      <button onClick={onSuccess}>저장</button>
    </div>
  );
} 