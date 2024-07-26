# create-singlestoredb-app

**Attention**: The code in this repository is intended for experimental use only and is not fully tested, documented, or supported by SingleStore. Visit the [SingleStore Forums](https://www.singlestore.com/forum/) to ask questions about this repository.

This package includes a tool to create a demo application powered by SingleStoreDB (https://www.singlestore.com/).

### How to start?

1. Open your terminal and run:

```sh
npx create-singlestoredb-app
```
2. Answer the prompts and choose between full built demos or templates based on Next.js, Express, or Remix!

3. Follow the instructions in your terminal and your app will be up and running in a few seconds!


### What will this tool do for me?

This tool creates a starter workspace (free!) at SingleStoreDB Cloud to power your application or demo. The created application will be connected to your workspace through the `.env` file. You can also connect through mysql protocol:

```sh
mysql -u <user> -h <hostnmae> -P 3333 --default-auth=mysql_native_password --password=<password> <db_name>
```
