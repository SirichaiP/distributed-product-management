# Identity Service Postman/Newman

## Import
1. Import `identity-service-74.postman_collection.json`
2. Import `identity-service-local.postman_environment.json`
3. Select environment: `Identity Service Local`

## Run in Postman
Collection > Run > Run Identity Service - Full 74 Test Cases

## Run with Newman
```bash
npm install -g newman
newman run identity-service-74.postman_collection.json -e identity-service-local.postman_environment.json
```

## Notes
- Base URL: http://localhost:5067
- First request uses POST /auth/register as requested.
- Some destructive/negative cases use placeholder variables such as deleteUserId, expiredJwt, revokedRefreshToken.
- For strict CI, seed admin/customer users and set environment variables before running.
