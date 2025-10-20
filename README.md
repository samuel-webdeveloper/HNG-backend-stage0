# HNG backend stage 0
## Endpoint GET /me 
## Setup 
1. git clone <repo> 
2. cd stage0 
3. npm install 
4. Create .env (optional) with USER_EMAIL, USER_NAME, USER_STACK 
5. npm run dev 
6. Visit http://localhost:3000/me 

## Notes 
- Uses https://catfact.ninja/fact for dynamic facts 
- If external API fails, a fallback message is returned.