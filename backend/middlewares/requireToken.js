import jwt from "jsonwebtoken";

export const requireToken = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("No se proporcionó un token. Usa el formato Bearer.");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = payload.uid;
    next();
  } catch (error) {
    console.error("Error de autenticación:", error.message);

    const TokenVerificationErrors = {
      ["invalid signature"]: "La firma del JWT no es válida",
      ["jwt expired"]: "El JWT ha expirado",
      ["invalid token"]: "Token JWT no válido",
    };

    const errorMessage =
      TokenVerificationErrors[error.message] ||
      "Se produjo un error durante la verificación del token.";

    return res.status(401).json({ error: errorMessage });
  }
};
