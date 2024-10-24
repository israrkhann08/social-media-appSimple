const express = require("express");
const app = express();
const port = 3000;
var jwt = require("jsonwebtoken");
const Skey = "1122aabb";


//middleware json parse
app.use(express.json());

const userData = {
    kashif: {
      email: "kashif@gmail.com",
      password: "k123",
      posts: [
        // post 1 start here
        {
          post: 1,
          content: "This Is First Post From Kashif",
          category: "text",
          likes: {
            likedNumber: 2,
            likedBy: ["ali", "haroon"],
          },
          comments: [
            {
              commentNumber: 1,
              userId: "ali",
              comment: "I love this text",
            },
          ],
        },
        // post 2 start here
        {
          post: 2,
          content: "This Is second post",
          category: "text",
          likes: {
            likedNumber: 2,
            likedBy: ["ali", "haroon"],
          },
          comments: [
            {
              commentNumber: 1,
              userId: "haroon",
              comment: "I love this text",
            },
          ],
        },
        // post 2 end here
      ],
    },
    // first kashif data is done
    // 2nd data is start
    ali: {
      email: "ali@gmail.com",
      password: "a123",
      posts: [
        // post 1 start here
        {
          post: 1,
          content: "This Is First Post From Ali",
          category: "text",
          likes: {
            likedNumber: 2,
            likedBy: ["kashif", "haroon"],
          },
          comments: [
            {
              commentNumber: 1,
              userId: "kashif",
              comment: "I love this text",
            },
          ],
        },
        // post 2 start here
        {
          post: 2,
          content: "This Is second post from ali",
          category: "text",
          likes: {
            likedNumber: 2,
            likedBy: ["kashif", "haroon"],
          },
          comments: [
            {
              commentNumber: 1,
              userId: "haroon",
              comment: "I love this text",
            },
          ],
        },
        // post 2 end here
      ],
    },
    //   third key start
    haroon: {
      email: "haroon@gmail.com",
      password: "h123",
      posts: [
        // post 1 start here
        {
          post: 1,
          content: "This Is First Post From haroon",
          category: "text",
          likes: {
            likedNumber: 2,
            likedBy: ["ali", "kashif"],
          },
          comments: [
            {
              commentNumber: 1,
              userId: "ali",
              comment: "I love this text",
            },
          ],
        },
        // post 2 start here
        {
          post: 2,
          content: "This Is second post",
          category: "text",
          likes: {
            likedNumber: 2,
            likedBy: ["ali", "kashif"],
          },
          comments: [
            {
              commentNumber: 1,
              userId: "kashif",
              comment: "I love this text",
            },
          ],
        },
        // post 2 end here
      ],
    },
  };

  app.post("/login", (req, res) => {
    const {email, password} = {...req.body}
    for (let data in userData) {
      if (userData[data].email == email && userData[data].password == password) {
        let uEmail = userData[data].email;
        var token = jwt.sign({ email: uEmail }, Skey);
        return res.status(200).json({
          message: "Login successful",
          token
        });
      }
    }
    return res.status(401).json({
      message: "Invalid username or password",
    });
  });


  app.get("/isLoggedIn", authenticate, (req, res) => {
    let user = req.user;
    return res.status(200).json({
      message: "is logged in",
      user,
    });
  });
  

  // for profile post start
app.get('/profile', authenticate, (req, res) => {
    const loggedInEmail = req.user.email;
    console.log(loggedInEmail);
    
    let userPosts = null;
    for (let userKey in userData) {
      if (userData[userKey].email === loggedInEmail) {
        userPosts = userData[userKey].posts;
        break;
      }
    }
    if (userPosts) {
      return res.status(200).json({
        message: "Profile posts",
        posts: userPosts
      });
    } else {
      return res.status(404).json({
        message: "No posts of login user"
      });
    }
  });




app.get('/timeline' ,authenticate, (req , res)=>{
    let loginEmail = req.user.email;
    let timelinePost = [];
    for (let userKey in userData){
        if(userData[userKey].email != loginEmail){
            timelinePost =timelinePost.concat(userData[userKey].posts)
        }
    }
    return res.status(200).json({
        message : "timeline posts",
        posts : timelinePost
    });
    }) ;


  // Authenticate
  function authenticate(req, res, next) {
    console.log("Middleware");
  if (req.headers.token) {
    try {
      var decoded = jwt.verify(req.headers.token, Skey);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not Logged in",
    });
  }
}



app.listen(port, () => {
    console.log(`app running on port ${port}`);
  });