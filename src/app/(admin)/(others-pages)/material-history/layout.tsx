import { ReactNode } from 'react';

export const metadata = {
  title: '자산 이력 관리',
  description: '자산의 입출고 이력을 관리하는 페이지입니다.',
};

export default function MaterialHistoryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {children}
    </div>
  );
} 