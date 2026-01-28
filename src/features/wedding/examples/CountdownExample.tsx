import { WeddingCountdown } from '../components';

export default function CountdownExample() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <WeddingCountdown 
        weddingDate="2026-06-15 14:00:00"
      />
    </div>
  );
}
