# Todos:

[x] Use `zod` to validate restaurant routes. Will help us to extract types as well.

[x] Understand how errors are being processed and formatted to understand if they have been standardised across the application.

[ ] Every restaurant has some cuisines. Add an association and a way to query it.
  - [x] POST `/cuisines` to add a particular cuisine. Only the highest level admins are authorised to add cuisines. This authorization exists so as to make it easy for search to index it and make the naming scheme standardized.
  - [x] GET `/restaurants` has an option to include its respective Cuisine association.
  - [x] POST & PUT `/restaurants` has a way to add already registered Cuisines to the restaurant. Since during creation we can't guarantee that what is passed in `Cuisines` array are all existing records and not new ones. If a cuisine like `{ cuisineName }` is passed, sequelize creates a new record.
    1. Add restaurant without `Cuisines` in the include.
    2. Check if length of `Cuisines` array is lesser than `config.MAX_CUISINES_CREATION`.
    3. Do not allow `cuisineName` in the `Cuisines` array.
    4. Check if all `cuisineId` are in the DB.
    5. If there is an aggregate way to do this, add the associations only if they all pass, since there is a way to add all of the associations in one query if we know they all exist.
    6. Else, run a loop over each cuisine and only add that association if that cuisine exists in the DB.

[ ] Write an OpenAPI spec sheet for good documentation.

[ ] Write examples or tests for Postman for better API reliability.

[ ] Implement pagination using Link Headers for admin page for users and orders for particular restaurants.:
  - Using a link header package like [parse-link-header](https://www.npmjs.com/package/parse-link-header).