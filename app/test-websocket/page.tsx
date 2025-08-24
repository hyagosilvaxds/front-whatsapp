import WebSocketTest from '@/components/websocket-test';
import WebSocketTester from '@/components/websocket-tester';

export default function TestWebSocketPage() {
  return (
    <div className="space-y-6">
      <WebSocketTester />
      <WebSocketTest />
    </div>
  );
}
