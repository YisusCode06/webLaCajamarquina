import jwt from "jsonwebtoken";
export const requireToken = (req, res, next) => {
  try {
    //console.log(req);
    let token = req.headers?.authorization;
    console.log(token);
    if (!token) {
      throw new Error("No existe el token usa Bearer");
    }
    token = token.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    req.uid = payload.uid;
    next();
  } catch (error) {
    console.log(error.message);

    const TokenVerificationErrors = {
      ["invalid signature"]: "La firma del JWT-no-es válida",
      ["jwt expired"]: "JWT-expirado",
      ["invalid token"]: "Token-no-válido",
      ["No-Bearer"]: "Utiliza formato Bearer",
    };

    return res

      .status(401)
      .send({ error: TokenVerificationErrors[error.message] });

    // return res.status(401).json({
    //   ok: false,
    //   msg: error.message,
    // });
  }
};
