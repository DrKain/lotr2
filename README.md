
# Land of the Rair

This is a monorepo. For a specific project setup/config, check those project subfolders (for example, the `server` needs a `.env` setup before it will run.).

## Getting Started

You can either use docker, or you can use your own installed Node / Mongo / Redis (or, of course, a hosted Mongo / Redis).

### Environment Variables

These either need to be set in a `.env` file or set some other way (in the `server` directory):

* `DATABASE_URI` - the path to the mongodb instance

Additionally, these _can_ be set, and circumstantially should be:

* `SINGLE_CORE` - run the game in single core mode (untested)
* `TS_NODE_TRANSPILE_ONLY` - set to `1` to make transpiling and development significantly faster on windows

Further, some properties are completely optional:

* None Yet

### Other Repos

* [Assets](https://github.com/LandOfTheRair/Assets) - home of bgm, macicons, sfx, and spritesheets (frontend content)
* [Content](https://github.com/LandOfTheRair/Content) - home of droptables, items, maps, npc stats, npc scripts, quests, recipes, and spawners (backend content)

### Docker

Just run `docker-compose up` and it will build, run, and start the client and server (as well as Mongo and Redis).

### Your Installed Node

You will want to be using Node 12 (at least) to run this project.

#### Setup

* `npm install` - install dependencies for the client and server.
* `npm run setup` - setup both the client and server for development (See "Developing Content" for some advice on running the same instance of the Content folder for client and server).

#### Developing Content

One option you have to run Land of the Rair and actively work on the content, is to clone [the Content repo](https://github.com/LandOfTheRair/Content) right alongside Land of ther Rair (meaning you'll have `folder/LandOfTheRair` and `folder/Content`). If you have the Content repo available and run `npm run setup`, it will symlink the Content repo so you can develop it concurrently without having to commit, push, pull, and update. Or copying, or whatever.

#### Running Both Projects

Run `npm start` and the client and server will both start up.

You can also do `npm run start:server` and `npm run start:client` to start the two separately.
