# fact-checking-server
The fact-checking server is responsible for managing the MongoDB database to store user account information and  <u>user check history</u>, and human fact-check result pulled daily from Google api.

# Connections 

## connDb.ts
The module provides an async function `getDb` , which will return a promise of DB connection with signleton pattern.

The database name is `fact-checking-website` for now.

## connmail.ts
Provides async function `getEmailService`, similar to `getDb`.

## googleApi.ts & apiTypes.ts
apiTypes.ts defines all the types used returned by Google API.

googleApi.ts exports two functions `fetchNow` which will start a fetching from the api instantly, and `schedultFetch` which will schedule a fetch every midnight.

The fetching process includes three steps. 
1. Find publishers using some pre-set popular words.
2. Use the publishers' name to search all their publications within a given time. 
3. Collect the claims and update database's `human_claims` collection.

# route 

## emailRoutes.ts
On receiving request `POST /email` with body `{email: #EMAIL#}`, emailRoutes will fist check if the email has been registered. If not it will get an email service from *connmail.ts* and send a verification code to the given email. Finally, it responds with the hashed verification code in JSON format `{veriCode: #HASHED_VERI_CODE#}`

## userRoutes.ts
*userRoutes.ts* handles all requests related with user account, including signIn, signUp, and delete user.

`signIn` listens to `POST /signIn` with body `{userName: #EMAIL#, passwd: #PASSWORD#}`. It will query the database collection `users` for salt and hashed password. If succeed, it will respond `true`.

`signUp` listens to `POST /signUp` with body `{userName: #EMAIL#, passwd: #PASSWORD#}`. If the email is used yet, a random salt will be generated and userName, hashedPasswd and salt will be stored into the database's `users` collection. 

`deleteUser` listen to `POST /deleteUser` with body `{userName: #EMAIL#}`. The user will be deleted from the database. 

## checkRoutes.ts
*checkRoute.ts* handles request `POST /check` with body `{query:#CLAIM#}`. It will first use the engine to check and then search in the human result database. The response is JSON `{human_result: HUMAN, fever_result: #MACHINE#}`