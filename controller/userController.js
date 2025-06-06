import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import multer from 'multer'; // Import multer
import { Storage } from '@google-cloud/storage';

const storageGCS = new Storage({
  projectId: "if-b-08", // Ambil dari environment variable
});
const bucketName = "petmania-bucket"; 
const bucket = storageGCS.bucket(bucketName);

// Konfigurasi Multer untuk menangani upload file
// Menggunakan memory storage karena Multer akan langsung menyerahkan buffer ke GCS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas ukuran file 5MB
  },
});

async function uploadProfilePicture(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'failed', msg: 'Tidak ada file yang diunggah.' });
    }
    // Perhatikan: userId dikirim melalui field 'userId' di body multipart/form-data
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ status: 'failed', msg: 'User ID tidak ditemukan dalam request body.' });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ status: 'failed', msg: 'User tidak ditemukan.' });
    }

    // Nama file di GCS (contoh: profile_pictures/userId_timestamp_originalName.jpg)
    const fileName = `profile_pictures/${userId}_${Date.now()}_${req.file.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false, // Tidak perlu resumable untuk file kecil
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error('GCS Upload Error:', err);
      return res.status(500).json({ status: 'failed', msg: 'Gagal mengunggah ke Google Cloud Storage.', error: err.message });
    });

    blobStream.on('finish', async () => {
      // Pastikan file bersifat publik jika ingin diakses langsung
      await blob.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      // Perbarui URL gambar profil di database user
      user.profilePicture = publicUrl; // SESUAIKAN DENGAN NAMA KOLOM DI MODELMU
      await user.save();

      return res.status(200).json({
        status: 'success',
        msg: 'Foto profil berhasil diunggah dan diperbarui.',
        data: { profilePictureUrl: publicUrl }
      });
    });

    blobStream.end(req.file.buffer);

  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    return res.status(500).json({ status: 'failed', msg: 'Terjadi kesalahan server.', error: error.message });
  }
}

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
  upload,
  uploadProfilePicture,
};
