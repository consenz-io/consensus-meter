# About

Consenz is a platform for creating agreements.
The platform lets a group of people create a document that reflects the issues they agree upon
and discuss the issues that are in disagreement.

The platform allows any group of people at any scale to formulate a text
in a single, coherent and clear document in a transparent and democratic way.
The platform enable it through a new kind of Internet discussion.
Instead of spreading across countless responses,
the discussion converges around a collaborative and democratic document
by incorporating voting mechanisms with discussion tools.
This allows to distinguish between agreed upon and controversial issues,
and the process has a clear product: A text that reflects the consent of the participants.

The consensus meter is an algorithm that determine the document Threshold: 
A number that represent how many supporters needed to approve an edit suggestion to the document.
The threshold is always a percentage of the total sum of users in a document at given time.

You can watch and interact with consenz web app demo using this link - https://www.figma.com/proto/lBVtIWr5UDhJXFXgJWgO8j/Consenz-Wireframe-(Copy)?node-id=1702%3A9054&scaling=scale-down-width&page-id=1702%3A9053&starting-point-node-id=1702%3A9054

You can watch and interact with the consensus meter simulation using this link - https://simulation.consenz.io/
# Tech Stack
> The information below refers to the [main app](https://github.com/consenz-io/webapp). The simulation impleneted in this hackathon only uses a react frontend, for the purpose of demonstrating the consensus meter. 

## Backend
We are using PostgreSQL as our DB, [hasura](https://hasura.io) as our graphql API gateway. For the POC votes are saved in the database, but in the upcoming months we are going to implement on-chain voting (C1). We would use [Cardano DB Sync](https://docs.cardano.org/cardano-components/cardano-db-sync/about-db-sync) for synchronization between the blockchain and our DB.
## Frontend
We are using react for the client app, MUI as our components library, and apollo client for communication with the graphQL API.

# Setup
In order to run the code in the repository, execute in a terminal:
```sh
git clone git@github.com:consenz-io/consensus-meter.git
cd demo
yarn
yarn start
```
The demo app would run at http://localhost:3000
