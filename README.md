# About
## Project Name
Consensus Meter Simulation
## Team Name
Consenz
## Short description 
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
For this project we have created a simulation of the consensus meter to demonstrate it's behavior at a scale and to set a base for future improvements and optimization.

## Long description
Governance and decision making are made mainly by two methods: discussion and voting. Discussions allow the participants to express different opinions and perspectives and to take into consideration the pros and cons, the benefits and the risks before decisions are made.

But discussions are not scalable. Discussions create noise, and when there is too much noise it is hard to identify the signal, i.e. the data that is relevant and contributes to the process. 

In decentralized organizations, the governance is being made by voting on proposals on-chain. The focus on proposals leaves outside wider policy challenges that are relevant to the community, such as process guidelines, community code of conduct, monetary policy etc. Discussions are usually disconnected from the voting process and spread around on different platforms: snapshot.org, twitter, google-docs, telegram, discord, reddit, github and others.

This situation makes the decision-making process ineffective and creates a risk of getting decisions that are not in the best interest of the community and its members. Also, it may discourage many members from taking an active part in the process.

### Our Solution:

Consenz is a platform that was created to address those problems and offer a proven solution.

The following discussion-features make Consenz unique, compared to other platforms:

- Instead of an endless and chaotic thread of comments, there is a focus and a product to the process: A document that can be discussed and edited by the participants and reflect their agreements.
- There is a clear structure to the content: comments are attributed to a specific section and function as arguments for or against it; sections are attributed to a - specific topic; topics are attributed to the document.
- There is a voting system that allows the users to express their opinion without adding noise to the discussion.
- The voting system also creates a method to deal with conflicts and determine which opinion has the majority of participants' agreements.
- Those agreements are separated from the noise by a simple algorithm that determines which section received enough support and can be added to the document automatically.

You can read more about the consensus meter algorithm logic [here](https://github.com/consenz-io/consensus-meter/blob/main/Logic.md#consensus-meter-logic).

The process on consenz creates a "micro-democracy" system - an option to discuss the details of a proposal by all members of the DAOs community without limiting it to a small group of representatives. Consenz combines elements of - and is inspired by - liquid democracy, direct democracy, deliberative democracy and sociocracy.

## Payment Address (USDC on Milkomeda)
0x02Bde23d0338E9DdC2412d902CB3E213B6dee8Ed

## Website link
https://consenz.io
## Contracts
Still in research. We plan to use [OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/governance) Solidity libraries to creat the smart contracts needed for consenz voting on-chain.
## Frontend code
https://github.com/consenz-io/webapp
## Screens / graphic materials

- You can watch and interact with consenz web app demo using this [Figma prototype](https://www.figma.com/proto/lBVtIWr5UDhJXFXgJWgO8j/Consenz-Wireframe-(Copy)?node-id=1702%3A9054&scaling=scale-down-width&page-id=1702%3A9053&starting-point-node-id=1702%3A9054)

- You can watch and interact with the consensus meter simulation [here](https://simulation.consenz.io/)
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
