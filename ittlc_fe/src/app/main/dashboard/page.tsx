import React from 'react';

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 예시 카드 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">성도 현황</h2>
          <p className="text-gray-600">총 120명</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">이번 주 출석</h2>
          <p className="text-gray-600">85명</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">신규 등록</h2>
          <p className="text-gray-600">5명</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
