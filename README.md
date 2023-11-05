# Technical Test

## Date of Submission
5 November 2023

## Installation
### Step 1 ###
Make sure you have installed Docker and docker compose in your local computer [installation](https://docs.docker.com/engine/install/)

build Frontend
```bash
docker build -t "vouch-client" ./vouch-client/
```

build Backend 
```bash
docker build -t "vouch-be" ./vouch-be/
```

run the application 
```bash
docker compose up
```

Older docker docker run
```bash
docker-compose up
```

open up a browser and run [localhost:3000](http://localhost:3000)

## Time spent
8 hours

## Assumptions made
Because this is realtime chat application, I was assuming using websocket is the best protocol to use.

## Shortcuts/Compromises made
I'm using NestJS for backend, the powerful framework that can be used for many application and it has websocket protocol under the hood. Also I'm using Nextjs for Frontend and tailwindcss and DaisyUI for UI library. It has a lot of component that can used so I don't have to build it from the scratch.

## Assume your application will go into production...
Ideally before the application going into production, it has to go testing first, for example using Unit testing and end-to-end tesing.

To ensure smooth experience, the application must be deployed with enough resources, and also it has to be monitored to make sure there is no memory leak.

Ideally, chat application like this have to had Authorization and Authentication to make sure the security of the application. and the sensitive data need to be encrypted.

## Other
I was planning to create isTyping feature, so the user can see other when they are typing in real time.

## Feedback
I think it's better if the application need to have authentication, and also the user have the option to upload profile. 

## License

[MIT](https://choosealicense.com/licenses/mit/)
