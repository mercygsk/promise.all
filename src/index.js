// Importing database functions. DO NOT MODIFY THIS LINE.
import { central, db1, db2, db3, vault } from "./databases.js";

async function getUserData(id) {
  // Validate input id
  // if (typeof id !== "number" || id < 1 || id > 10) {
  //   throw new Error("Invalid Input -- Out of Range");
  // }

  try {
    // Get the name of the database to look up the user
    const dbName = await central(id);

    // Use Promise.all to query databases concurrently
    const [basicInfo, personalInfo] = await Promise.all([dbs[dbName](id), vault(id)]);

    // Assemble the final user data object
    const userData = {
      id: id,
      name: personalInfo.name,
      username: basicInfo.username,
      email: personalInfo.email,
      address: {
        street: personalInfo.address.street,
        suite: personalInfo.address.suite,
        city: personalInfo.address.city,
        zipcode: personalInfo.address.zipcode,
        geo: personalInfo.address.geo
      },
      phone: personalInfo.phone,
      website: basicInfo.website,
      company: basicInfo.company
    };

    return userData;
  } catch (error) {
    // If any database request fails, return a rejected promise
    throw new Error(`Database Error: ${error.message}`);
  }
}

// Object mapping database names to their respective functions
const dbs = {
  db1: db1,
  db2: db2,
  db3: db3
};

// Example usage:
getUserData(5)
  .then(userData => console.log(userData))
  .catch(error => console.error(error));

// Test with various id values:
// Valid numbers: 1 through 10
// getUserData(1)
// getUserData(10)
// Invalid numbers: less than 1 or higher than 10
// getUserData(0)
// getUserData(11)
// Invalid data types: strings, Booleans, etc.
// getUserData("invalid")
// getUserData(true)
