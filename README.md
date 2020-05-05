# WeEat

## Description
We wanted to provide a fresh take on how people search for food, especially given recent events which have forced many to shelter in place and order delivery from various restaurants. As we become increasingly health-aware, we may want to search for food that contains (or omits) particular ingredients of interest. More broadly, perhaps we don’t have a good idea of what we’d like to eat on a particular day, and would like to see what kinds of cuisines are most likely to contain my food items of interest. This is what our app would like to address.

The web app will take as input ingredients that the user is interested in having. Using the list of ingredients, the web app will suggest a cuisine (or several cuisines) that are most likely to utilize those ingredients. The user will then be able to  select a cuisine from this list, after which the app will suggest restaurants nearby with that cuisine type. The goal is to provide a fresh way of choosing what food to order.

## Local set up
1. Install Yarn, NodeJS, and Oracle Instant Client Package binaries.
2. Run `git clone https://github.com/jhltom/CIS550-Project.git`.
3. Go to `./client` directory: `cd client`.
4. Install client dependencies: `yarn install`.
5. Start client: `yarn run start`.
6. Go to `./server` directory: `cd server`.
7. Install server dependencies: `yarn install`.
8. Start server: `yarn run start`.
9. Open browser to `http://localhost:3000/`.


## Pre-processing Code
Code used for cleaning, wrangling, and ingesting were written by each member to handle the data each member was in charge of. They are located in:  

`./database/dataprocessing/*.java`  
`./database/*.py`  
`./utility/*`  