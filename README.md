#  Trello-clone application(client side)
![](./trello-home-example.png)

![](./example-screenshot.png)

# This Trello-clone app is an example of a kanban-board.
The app allows:
- Сreate boards
- Delete boards
- Rename boards
- Add tasks to board
- Delete tasks or task
- Rename tasks(title or text)
- Move tasks on the board
- Archive and restore tasks
- View archived tasks
- Search for tasks on the board
- To search for user tasks, enter the user's mail. The first character is @. Example: @asd@gmail.com.
- View the history of actions on board tasks
- Invite other app users to the board
- Assign task executor to users who have been invited to the board
- Remove the task from the executor
- The invited user has the right only to view tasks and the ability to exit the task if he is the executor

## Application Technology Stack

The application is written by HTML/CSS/TypeScript/Angular

# To launch the app, you need to:

 Open terminal and follow the next commands:
 
 - Clone the repository
 
  ```sh
  $ git clone https://github.com/Superior-925/Trello-frontend.git
  ```

- Go to project folder

```sh
 $ cd Trello-frontend
  ```

- Install dependencies by NPM
 
 ```
 $ npm install
```

- Launch the applications
 
 ```sh
$ npm start
```

- Go to the following link http://localhost:4200

## To test the app run the following commands

- Run this command for unit testing

```sh
$ ng test
 ```

## For end-to-end testing, run the commands (you also need a server)

```sh
$ cypress install
 ```

- To launch the testing interface of end-to-end tistings, run the command

```sh
$ ng e2e
 ```

- To run end-to-end tests in automatic mode, run the following commands

```sh
$ npm start

$ cypress run
 ```


If you have questions - contact me on email skykeeper925@gmail.com.
Best regards Antony Logunov.
