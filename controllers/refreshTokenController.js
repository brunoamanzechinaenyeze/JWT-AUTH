const userDB = {
    users: require("../model/user.json"),
    setUsers: function (data) {
      this.users = data;
    },
  };
  
  
  const jwt = require("jsonwebtoken");
  require("dotenv").config;
  
  const handleRefreshToken =  (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt)  
      res.status(401)
    console.log(cookies.jwt)
    const foundUser = userDB.users.find((person) => person.username === user);
    if (!foundUser) return res.sendStatus(401); //Unauthorized
  
    //Evaluate password
    const match =  bcrypt.compare(pwd, foundUser.password);
  
    if (match) {
      //JWT
      const accessToken = jwt.sign(
        { username: foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
  
      //Saving refresh token with current user
      const otherUsers = userDB.users.filter(
        (person) => person.username !== foundUser.username
      );
  
      const currentUser = { ...foundUser, refreshToken };
      userDB.setUsers([...otherUsers, currentUser])
       fsPromises.writeFile(
        path.join(__dirname, "..", "model", "user.json"),
        JSON.stringify(userDB.users)
      );
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({
        accessToken,
      });
    } else {
      res.sendStatus(401);
    }
  };
  
  module.exports = { handleRefreshToken };
  