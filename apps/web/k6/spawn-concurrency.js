import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    spawn:
    {
      executor: 'constant-arrival-rate',
      rate: 20, // RPS
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 50,
      maxVUs: 100,
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.05'], // >95% success
  },
};

export default function () {
  const url = `${__ENV.API_BASE}/instance/spawn`;
  const payload = JSON.stringify({ challengeId: __ENV.CHALLENGE_ID });
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${__ENV.TOKEN}` };
  const res = http.post(url, payload, { headers });
  check(res, { 'status 200/201': (r) => [200, 201, 202].includes(r.status) });
  sleep(0.1);
}
