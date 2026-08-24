import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Test Configuration (Defining the Traffic Load)
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up from 0 to 10 Virtual Users (VUs) over 30 seconds
    { duration: '1m', target: 10 },  // Stay steady at 10 VUs for 1 minute
    { duration: '30s', target: 0 },  // Ramp down to 0 VUs over 30 seconds
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
    http_req_duration: ['p(95)<500'], // 95% of requests must complete under 500ms
  },
};

// 2. The Test Scenario (What each Virtual User actually does)
export default function () {
  // Send a standard GET request to your server
  const response = http.get('https://sandbox.erp.quatrixglobal.com');

  // Validate that the server responded with a 200 OK status
  check(response, {
    'status is 200': (r) => r.status === 200,
  });

  // Pause for 1 second between loops to mimic a human user typing/clicking
  sleep(1);
}
