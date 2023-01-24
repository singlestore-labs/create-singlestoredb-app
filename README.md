# create-singlestore-app

This package includes a tool to create a demo application powered by SingleStoreDB (https://www.singlestore.com/).


### How to start?

1- Signup for a free trial account at https://portal.singlestore.com/

2- Go to API Keys page (last section of the sidebar) and [create your API key](https://docs.singlestore.com/managed-service/en/reference/management-api.html#authorization).

3- Open your terminal and run:
```
npx create-singlestore-app <YOUR_APP_NAME> <YOUR_API_KEY>
```

4- Your app will be up and running on http://localhost:3000, powered by SingleStoreDB!

### What will this tool do for me?
This tool creates a [Workspace](https://docs.singlestore.com/managed-service/en/getting-started-with-singlestoredb-cloud/about-workspaces/what-is-a-workspace.html) at SingleStoreDB Cloud to power your application while it sets up a demo app for you. When your Workspace is ready to be used, it sets up a secured connection to your application and creates a database `shop` and two tables: `item` and `sales`, so your demo works right away. We provide the API calls to remove them or to create new ones. You can build up on its structure. 
### What app can I expect to be running?

The app created by this tool is a React + TypeScript + Express + SingleStoreDB Demo app. The app is started with a [boilerplate](https://github.com/singlestore-labs/singlestore-app-boilerplate), and you can count with packages like MaterialUI, Formik, YUP, react-chartjs-2 and others. We have a REST API integrated with SingleStoreDB structure done for you. It has everything already configurated and integrated so you can start implementing your idea right away. Happy coding!
