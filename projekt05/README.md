# Komandkalkulator
This is a pseudo-calculator for a planned economy loosely inspired by a hit video game. Create goods, create production methods that input and output said goods, create population centres, and create facilities in said population centres that use your production methods.

There are no restrictions for the economic parts, as this is strictly a 'planning' tool. Although I do not know what you could use it for anywho.
## Usage
This operates on a simple premise. You create goods in the goods tab. You create production methods that have input and output goods and amounts. you create population centres, and inside them, facilities that have production methods. Then you gaze upon the updated spreadsheet of goods and the total balance of your economy and at last you despair at your deficit.

**Permissions:**
Users can have departments, and permissions. Departments allocate *where* your permissions work. Permissions are split into create update delete, because everyone can read everywhere as long as one is logged in. 
- "Resource accounting" has access to goods.
- "Process administration" has access to production methods.
- "Urban planning" to population centres.
- "Economic management" to population centres and goods.
- "on-Stand" has access to nothing.
There is no functionality to add departments through the website, though you can always just edit your local database. Department-category connections are governed through a pivot table -- meta_department_relations.

## Installation and configuration:
1. run "npm install" in this folder to install modules
2. run "npm run create_env". neccessary. This require you to be able to run bash natively.
 - If you cannot run bash natively, start git bash in the project directory and run this `./utils/generate_env.sh > .env`
3. run "npm run setup_database" to create the database. this creates categories and department relations. it is imperative you do this.
4. to start the server "npm run run_server"

**Notes:** 
- To create an admin account, run "npm run create_admin_account [username] [password]". An administrator account is required to edit user permissions and make non-admins able to do things.
- The localhost port is 1965 by default. Change the env file if you want it otherwise. If no port is specified, it runs on 6767.
- "npm run fill_db" to fill the database with some sample data.
