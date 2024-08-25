export const isLogin = async (req, res, next) => {
  try {
    if (req.session.user) {
      console.log("User is Authenticated");
    } else {
      res.redirect(process.env.BASE_URL + "register/login");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      console.log("User is already Authenticated");
      res.redirect(process.env.BASE_URL + "register/home");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

