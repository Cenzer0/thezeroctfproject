# API Overview

- Base URL: https://api.ctf.example.com/api
- OpenAPI: https://api.ctf.example.com/api/docs

## Auth
- POST /auth/register
- POST /auth/login

## Challenges
- GET /challenges
- GET /challenges/:slug
- POST /challenges (auth)
- POST /challenges/:id/presign (auth)

## Submission
- POST /submission (auth)
- POST /submission/hint (auth)

## Instance
- POST /instance/spawn (auth)

Notes:
- All auth endpoints return/accept JSON; JWT in Authorization: Bearer <token>.
- CSRF cookie used for browser requests; add X-CSRF-Token header when needed.
