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

   - Use the below command to generate a private key and copy it to `config/access.private.pem`:<br/>
     `openssl genrsa`

   - Derive a public key from the private key using the following command:<br/>
     `openssl rsa -in config/access.private.pem -pubout -out config/access.public.pem`

   - Similarly, do it for the keys for the refresh token as well.

9. Add default admin user through pgAdmin:
   - `email` -> 'janmey@gmail.com'
   - `password` -> '$2a$10$ZZQ8DFM.3yHR9tB8Khm4hedqBOqLQshwDGj7eXEfZPIdfX8kA5tt.'
   - `role` -> 'admin'
   - `refreshToken` -> 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidW5pcXVlQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiJ9.B14b3P2I7jTtqy3H-F1UlbGC5VZlfKGKcFsu7vh6xD9V_LXyoWYnOPqAPbf9yk6gT_klZGY7eoRM02oTfgVdI6hk5vKasjwo_AoPh-XESmneCmeVLv3YbV5wdpZ_3vQfS0XOHWynJhhzu3u3w3m34MdSJbj5KawltEyjZCB5wADd-b9Qhcpfpyd4XTcrh9RNTY6J9lsx5Iz7POfzlSbf9IbH0iMR98pLTykIW2omBHmlq9v-AvjS5YYitUXFI8hL7o8uoB2ePyZAm6e2vh7rijTjZTeVhXBCyP2yzRphsxs-N3i6Pqako9_klZb7SAAuYLjyB7Qf-Bb5Ndy0o0_ESA'
