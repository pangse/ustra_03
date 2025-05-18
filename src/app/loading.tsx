export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-[9999]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
} 