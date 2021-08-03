# Youtube Clone Coding
This code is a full-stack coding with Youtube clone coding.


# Environment 
Front-end
- PUG
- SCSS
- Javascript  

Back-end
- Nodejs 
 
DB & Server
- MongoDB & Heroku

# Pages
Total 12 Pages.
- Home : You can see the thumbnail of all the videos uploaded and there is a link to go see the videos. 
- Join : It is a page where you can sign up for membership and you can log in as GitHub.
- Social Duplicated : If the GitHub nickname is in DB when you log in as Github login, it is a page that allows you to change nickname.
- Login : It is a page where you can log in and GitHub login is also possible.
- Edit Profile : This page allows you to change your nickname, name, location, and avatar image.
- Change Password : This page allows you to change your password when you have a normal login ID, not a GitHub login.
- View Profile : It's a page where you can watch the videos you uploaded.
- Upload : It's a page where you can upload a video.(thumbnail size limit <= 3mb, video size limit <= 10mb)
- Edit Video detail : It is a page where you can change video information.
- View Video detail : It is a page where you can see the video you uploaded and the details of the video you wrote down when you uploaded it. And you can see and write comments.
- Search : This is a page where you can search for the video names.
- 404 Page : Error page.

Partials, Mixins, layout
- Partials 
  + header : There is a link to the login page and the sign up page. If you logged in, you can upload videos and edit profile.
  + footer : Maker information
  + social login : You can log in as a GitHub login.
- Mixins : avatar image, message, video block
- layout : main layout
  

# Others
This design pattern is MVC pattern.  
- Model : models file(User, Video, Comment)
- View : views file(pages, partials flie, mixins file, layouts file[main page])
- Controller : controllers file(User Controller, Video Controller)  
