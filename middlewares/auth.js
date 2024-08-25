export const isLogin = async (req, res, next) => {
  try {
    if (req.session.user) {
      console.log("User is Authenticated");
      next();
    } else {
      return res.redirect(process.env.BASE_URL + "register/login");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      console.log("User is already Authenticated");
      return res.redirect(process.env.BASE_URL + "register/home/");
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const isOnWrongURL = async (req, res, next) => {
  try {
    if (req.session.user) {
      console.log("User is Authenticated");
      return res.redirect(process.env.BASE_URL + "register/home/");
    } else {
      return res.redirect(process.env.BASE_URL + "register/login");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
