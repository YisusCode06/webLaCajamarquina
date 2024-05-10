import { User } from "../models/User.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, role, name, dni, phone } = req.body;
  try {
    const user = new User({ email, password, role, name, dni, phone });

    await user.save();

    //Generar token JWT

    return res.json({ ok: true });
  } catch (error) {
    console.log(error.code); //muestra el codigo de error de express-validator
    if (error.code === 11000) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya existe",
      });
    }
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    const respuestaPassword = await user.comparePassword(password);
    if (!respuestaPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta!",
      });
    }

    //Generar token JWT
    const { token, expiresIn } = generateToken(user._id);
    generateRefreshToken(user._id, res);

    return res.json({ ok: true, token: token, expiresIn: expiresIn });
  } catch (error) {
    console.log(req.body);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const editUserById = async (req, res) => {
  const { id } = req.params;
  const { email, password, role, name, dni, phone } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { email, password, role, name, dni, phone }, { new: true });
    if (!user) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }
    return res.json({ ok: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }
    return res.json({ ok: true, msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }
    return res.json({ ok: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const refreshToken = (req, res) => {
  const refreshTokenCookie = req.cookies.refreshToken;
  try {
    if (!refreshTokenCookie) {
      throw new Error("No existe el token");
    }

    const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
    const { token, expiresIn } = generateToken(uid);
    return res.json({ ok: true, token: token, expiresIn: expiresIn });
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
  }
};

export const logout=(req, res)=>{
  res.clearCookie("refreshToken");
  return res.json({ok:true});
}
