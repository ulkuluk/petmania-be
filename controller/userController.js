import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// GET all users
async function getUsers(req, res) {
  try {
    const response = await User.findAll();
    res.status(200).json({
      status: "success",
      msg: "Berhasil mengambil semua user",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan di server",
    });
  }
}

// GET user by ID
async function getUserById(req, res) {
  try {
    const response = await User.findOne({ where: { id: req.params.id } });
    if (!response) {
      return res.status(404).json({
        status: "failed",
        msg: "User tidak ditemukan",
      });
    }
    res.status(200).json({
      status: "success",
      msg: "Berhasil mengambil data user",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan di server",
    });
  }
}

// CREATE new user
async function createUser(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password ) {
      return res.status(400).json({
        status: "failed",
        msg: "Semua field wajib diisi",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: "failed",
        msg: "Email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    return res.status(201).json({
      status: "success",
      msg: "Registrasi berhasil",
      data: newUser,
    });
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan di server",
    });
  }
}

// UPDATE user
async function updateUser(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    let updatedData = { name, email, phone };

    if (password) {
      const encryptPassword = await bcrypt.hash(password, 5);
      updatedData.password = encryptPassword;
    }

    const result = await User.update(updatedData, { where: { id: req.params.id } });

    if (result[0] === 0) {
      return res.status(404).json({
        status: "failed",
        msg: "User tidak ditemukan atau tidak ada data yang berubah",
      });
    }

    res.status(200).json({
      status: "success",
      msg: "User berhasil diupdate",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan di server",
    });
  }
}

// DELETE user
async function deleteUser(req, res) {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({
        status: "failed",
        msg: "User tidak ditemukan",
      });
    }
    res.status(200).json({
      status: "success",
      msg: "User berhasil dihapus",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan di server",
    });
  }
}

// LOGIN (no token)
async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        msg: "Email atau password salah",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        status: "failed",
        msg: "Email atau password salah",
      });
    }

    const { password: _, ...safeUserData } = user.toJSON();

    res.status(200).json({
      status: "success",
      msg: "Login berhasil",
      data: safeUserData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan di server",
    });
  }
}

// LOGOUT (no token)
async function logout(req, res) {
  res.status(200).json({
    status: "success",
    msg: "Logout berhasil",
  });
}

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginHandler,
  logout,
};
