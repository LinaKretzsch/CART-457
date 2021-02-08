# CART-457

## Application Plan


### Purpose of Application 

The application enables 3 users to draw a collaborative sketch together. Each user has to login using their password and email address. When the user signs in they can choose to participate in a collaborative drawing or visit the gallery to see all the drawings they have participated in. Each user does not know the other person they drew the drawing with. 

---

### Technology used 
- HTML and CSS to basic website setup
- JavaScript for interactivity of website such as drawing part. Will probably use an interactive canvas from a library
- SQL for database which will hold username, password and drawings the user participated in as well as partial drawings which will be combined to a full drawing once each user is done
- NodeJS for server interactions so that 3 users can use the application simultaneously

---
### Development

|Component |Strategy |                                                                                                      
|----------|:--------|
| HTML CSS: Basic Setup     | I started creating the HTML and CSS files in order to get a better idea how I would like to structure the app. |
| JavaScript: Canvas | I decided to use a flexbox in order to structure the elements betters for resizing of the website and to make it compatible for different devices|
||The canvas will have an image background to create the illusion of a folded piece of paper, while the user can only draw on a third of it. The other 2 thirds of the paper will be drawn on by two other users. |
|| I want to use the JS library Konva in order to implement the canvas drawing feature https://konvajs.org/docs/index.html.|


---

### Design/Layout

|Component |Purpose | Style|  
|----------|:--------|:--------|
|Start Page| Asks user to login to their account with username and password. Once the user is logged in, they are asked to either navigate to their account, open the gallery or participate in a drawing.| Minimal Design, simple and not confusing|
|Drawing/Main Page| White image in the background of canvas resembling a paper folded in three parts. Each user can be drawn on by a different user. | Simplistic style, not confusing and easy to nativate.|
|| There are 3 drawing tools, a pencil, an eraser and a revert option. The pencil and eraser radius is indicated when the cursor is on the canvas. The size can be altered by scrolling in and out| The tools are depicted as an outline for each tool. The current active tools is indicated by the icons outline glowing| 
|Account Page| The login/log out option can also be accessed from a burger menu in the upper right corner. The user can also see a gallery of drawing they participated in in the accounts section.||


---

Issues Encountered:
