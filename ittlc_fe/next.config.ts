import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 외부 접근을 위한 Cross-Origin 요청 허용 설정
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    // 로컬 네트워크 접근을 위해 일반적인 IP 범위들을 추가
    // 실제 사용하는 IP 주소를 여기에 추가하세요
    // 예: '192.168.1.100', '10.0.0.50' 등
  ],
};

export default nextConfig;
