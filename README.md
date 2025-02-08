### This is the BackEnd API for the Carbon. Tracked. Project. Created with ExpressJS and a mongoDB database.

Carbon. Tracked. is a MERN stack project centered around enterprises' concern toward achieving a lower carbon footprint, while still continuing to provide the essence of their business.

This project includes all of the functionality needed in the BackEnd to provide all the basic operations needed by the web app.

# Dependencies: 
### Dependencies to run the project:
## 1. Node Modules 
the modules in node used by the project must be installed, by running 
```npm install``` in the terminal (you need to have nodeJS installed).

## 2. Database:
This project uses mongoDB to manage its data, make sure you have mongoDB installed, and the following structure (database and collections), is created.


![image](https://github.com/user-attachments/assets/22c69eaa-4448-407d-87c7-42ddec1e483c). 

To load predefined factors and make the application running without making any changes in the database, import the attached ```emissionfactors.json``` file into your emissionfactors collection.
This is a functional template for some emissionfactors, and can later be changed directly from mongoDB compass's UI.

You can also run ```node seed``` in the project terminal to run a script that imports these collections.

## 3. Environment Variables: 
This project requires a .env file to run properly. For security reasons, the .env file is not included in the repository , you need to create one manually.

### Steps to Set Up:
1. Create a .env file in the project's root directory.

2. Open your terminal and run the following Node.js script to generate a random string:

```node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"```

This command uses the crypto module in Node.js to generate a random sequence of 32 bytes and then  converts it to a hexadecimal string.
   
3. Copy the generated string. and write this statement in your .env file ```JWT_SECRET=generated-string``` where ```generated-string``` is the string generated from the node command.

4. Save the changes to your .env file.

# Start the Server:
Ensure connection to your mongoDB, and to start the server, run the command 

```node server``` 

in the project terminal.

Now, your backend API should be up and running.

### To find previews for the web app, and access the FrontEnd repository, visit [Carbon. Tracked. FrontEnd](https://github.com/samehmohsenn/Carbon.Tracked.FrontEnd./)
