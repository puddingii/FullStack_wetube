# Youtube Clone Coding
This code is a full-stack coding with Youtube clone coding.

<br>

# Environment 
Front-end
- PUG
- SCSS
- Javascript  

Back-end
- Nodejs 
 
DB & Server
- MongoDB & Heroku

<br>

# Pages
Total 12 Pages.
- __Home__ : You can see the thumbnail of all the videos uploaded and there is a link to go see the videos. 
- __Join__ : It is a page where you can sign up for membership and you can log in as GitHub.
- __Social Duplicated__ : If the GitHub nickname is in DB when you log in as Github login, it is a page that allows you to change nickname.
- __Login__ : It is a page where you can log in and GitHub login is also possible.
- __Edit Profile__ : This page allows you to change your nickname, name, location, and avatar image.
- __Change Password__ : This page allows you to change your password when you have a normal login ID, not a GitHub login.
- __View Profile__ : It's a page where you can watch the videos you uploaded.
- __Upload__ : It's a page where you can upload a video.(thumbnail size limit <= 3mb, video size limit <= 10mb)
- __Edit Video detail__ : It is a page where you can change video information.
- __View Video detail__ : It is a page where you can see the video you uploaded and the details of the video you wrote down when you uploaded it. And you can see and write comments.
- __Search__ : This is a page where you can search for the video names.
- __404 Page__ : Error page.
  
<br>

Partials, Mixins, layout
- __Partials__
  + __header__ : There is a link to the login page and the sign up page. If you logged in, you can upload videos and edit profile.
  + __footer__ : Maker information
  + __social login__ : You can log in as a GitHub login.
- __Mixins__ : avatar image, message, video block
- __layout__ : main layout
  
<br>

# Others
Client file includes javascript and scss files for front-end.  
Middleware handles session information and provides conditions to enter specific addresses or manages Heroku, AWS.  
<br>
This design pattern is __MVC pattern__.  
- __Model__ : models file(User, Video, Comment)
- __View__ : views file(pages, partials flie, mixins file, layouts file[main page])
- __Controller__ : controllers file(User Controller, Video Controller)  

Router file has address information.
- __API router__ : This router has the address used by javascript to connect to db with fetch.
- __global router__ : This router has 
- __user router__ : This router has the address for processing user information. 
- __video router__ : This router has the address for processing video information.
