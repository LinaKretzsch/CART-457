## Application Plan


### Purpose of Application

The application enables 3 users to draw a collaborative sketch together. Each user has to login using their password and email address. When the user signs in they can choose to participate in a collaborative drawing or visit the gallery to see all the drawings they have participated in. Each user does not know the other person they drew the drawing with.

---

### Technology used
- HTML and CSS to basic website setup
- JavaScript for interactivity of website such as drawing part. Will probably use an interactive canvas from a library
- NodeJS for server interactions so that 3 users can use the application simultaneously
- Express for server functionality to handle post and get requests
- The website is hosted on heroku and the server currently resets every other hour

---
### Component Development

|Component |Strategy |                                                                                                      
|----------|:--------|
| HTML CSS: Basic Setup     | I started creating the HTML and CSS files in order to get a better idea how I would like to structure the app. |
| JavaScript: Canvas | I decided to use a flexbox in order to structure the elements betters for resizing of the website and to make it compatible for different devices|
||The canvas will have an image background to create the illusion of a folded piece of paper, while the user can only draw on a third of it. The other 2 thirds of the paper will be drawn on by two other users. |
|| I want to use the JS library Konva in order to implement the canvas drawing feature https://konvajs.org/docs/index.html.|
| JavaScript: Cursor| I used a library and copied some code to have a more stialized cursor. The cursor is now an ellipse and will change the radius if the brush radius is increased or decreased on scroll https://codepen.io/designcourse/pen/GzJKOE |

---

### Overall Design/Layout

|Component |Purpose | Style|  
|----------|:--------|:--------|
|Start Page| Asks user to login to their account with username and password. Once the user is logged in, they are asked to either navigate to their account, open the gallery or participate in a drawing.| Minimal Design, simple and not confusing|
|Drawing/Main Page| White image in the background of canvas resembling a paper folded in three parts. Each user can be drawn on by a different user. | Simplistic style, not confusing and easy to navigate.|
|| There are 3 drawing tools, a pencil, an eraser and a revert option. The pencil and eraser radius is indicated when the cursor is on the canvas. The size can be altered by scrolling in and out| The tools are depicted as an outline for each tool. The current active tools is indicated by the icons outline glowing|
|Account Page| The login/log out option can also be accessed from a burger menu in the upper right corner. The user can also see a gallery of drawing they participated in in the accounts section.||
|Gallery Page| Will show a gallery of finished images| The gallery will hold the images creates by different users. The user can decide to folder by images they participated or see all images|

---

### Issues Encountered:
1. The Cursor is currently not showing the desired effect when pressed. I would the cursor radius to get smaller upon click. Changing this property has been more complex since the cursor outline is drawn on each cursor movement. 
2. I Followed a tutorial in order to change application into single page application using node and express. Since this was all new to me I had difficulties to restore the previous state of my project and hence decided to revert the changes and move on due to a strict timeline. I might attempt to restructure the files once I have everything implemented by creating a new branch and safely try using express. I would have preferred to structure this application as a SPA to learn but since I would like to get this project completed I will move on for now.
3. Since I was unable to create new image files on the server I had to add empty image files and overwrite them when a user submits a finished drawing. This enabled me to show that the overall logic of the application is working, however drawings are only saved on the server until it reloads which happens about every hour.

---

### Future Development

I would like to implement the following features in the future: 
1. I would like to turn the applicaiton into a SPA and would like to use react to render the project
2. A proper database needs to be established to hold the data of the finished drawings
3. A login screen with username and password should be added so that every user can filter for images theyr participated in on the gallery page
