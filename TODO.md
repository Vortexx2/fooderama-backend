# Todos:

[x] Use `zod` to validate restaurant routes. Will help us to extract types as well.

[x] Understand how errors are being processed and formatted to understand if they have been standardised across the application.

[x] Every restaurant has some cuisines. Add an association and a way to query it.
  - [x] POST `/cuisines` to add a particular cuisine. Only the highest level admins are authorised to add cuisines. This authorization exists so as to make it easy for search to index it and make the naming scheme standardized.
  - [x] GET `/restaurants` has an option to include its respective Cuisine association.
  - [x] POST & PUT `/restaurants` has a way to add already registered Cuisines to the restaurant. Since during creation we can't guarantee that what is passed in `Cuisines` array are all existing records and not new ones. If a cuisine like `{ cuisineName }` is passed, sequelize creates a new record.

[x] Fix typescript support for associations by declaring associations in the models.

[x] Write E2E testing, for running them before each commit.

[] Add auth
  - [x] Add email and password authentication from the database
  - [x] Add JWTs
  - [] Add asymmetric keys
  - [] Add expiry to JWTs
  - [] Add roles
  - [] Add email verification
  - [] Add revoking of JWTs
  - [] Add banning of accounts by a superadmin

[] Add a veg field to dishes and restaurants.

[] Add really good mock data for restaurants, for testing the frontend and for future use.

[ ] Write an OpenAPI spec sheet for good documentation.

[ ] Write examples or tests for Postman for better API reliability.

[ ] Implement pagination using Link Headers for admin page for users and orders for particular restaurants.:
  - Using a link header package like [parse-link-header](https://www.npmjs.com/package/parse-link-header).
