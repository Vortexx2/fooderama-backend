# Fooderama Backend

## Setup Instructions

1. Initialise postgres docker instance correctly using:

- `docker run -d --name dev-postgres -e POSTGRES_PASSWORD=dbpass -v ${POSTGRES_DATA_PATH}/:/var/lib/postgresql/data -p 5432:5432 postgres`
- Default username is `postgres`

2. Start postgres docker instance:<br/>
   `docker start dev-postgres`

3. Initialise pgadmin4 docker instance correctly using: <br/>
   `docker run -p 80:80 -e 'PGADMIN_DEFAULT_EMAIL=naastalover@gmail.com' -e 'PGADMIN_DEFAULT_PASSWORD=dbpass' --name dev-pgadmin -d dpage/pgadmin4`

4. Start pgadmin4 docker instance:<br/>
   `docker start dev-pgadmin`

5. Get IP address for connecting pgadmin4 to postgres: <br/>
   `docker inspect dev-postgres -f "{{ json .NetworkSettings.Networks }}"`<br/>
   `172.17.0.2`

6. Register a server to the server group

- I named it **default**

7. Create a database in it called **fooderama-test**.

8. Generate a RSA private and public keypair:

   - Use the below command to generate a private key and copy it to `config/private.pem`:<br/>
     `openssl genrsa`

   - Derive a public key from the private key using the following command:<br/>
     `openssl rsa -in config/private.pem -pubout -out config/public.pem`
