import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'], // <5% failures
  },
};

export default function () {
  const url = `${__ENV.API_BASE}/submission`;
  const payload = JSON.stringify({ challengeId: __ENV.CHALLENGE_ID, flag: 'CTF{rate}' });
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${__ENV.TOKEN}` };
  const res = http.post(url, payload, { headers });
  check(res, { 'status is 201/403/400': (r) => [201, 400, 403].includes(r.status) });
  sleep(0.2);
}
