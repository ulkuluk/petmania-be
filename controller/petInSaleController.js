import PetInSale from "../models/petInSaleModel.js";
import User from "../models/userModel.js";

async function addPetInSale(req, res) {
  try {
    const {
      name,
      category,
      description,
      price,
      age,
      healthStatus,
      imgUrl,
      location_lat,
      location_long,
      email,
      status,
    } = req.body;

    const newPet = await PetInSale.create({
      name,
      category,
      description,
      price,
      age,
      healthStatus,
      imgUrl,
      location_lat,
      location_long,
      email,
      status,
    });

    return res.status(201).json({
      status: "success",
      msg: "Berhasil menambahkan penjualan pet",
      data: newPet,
    });
  } catch (error) {
    console.error("Reservasi error:", error);
    return res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan di server",
    });
  }
}

async function getPetInSale(req, res) {
  try {
    const response = await PetInSale.findAll({
      
    });

    res.status(200).json({
      status: "success",
      msg: "Berhasil mengambil data pet",
      data: response,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan server",
    });
  }
}

async function getPetInSaleByEmail(req, res) {
  try {
    const response = await PetInSale.findAll({
      where: { email: req.params.email },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });

    res.status(200).json({
      status: "success",
      msg: "Berhasil mengambil data pet berdasarkan email",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching PetInSale by email:", error.message);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan server",
    });
  }
}

async function getPetInSaleById(req, res) {
  try {
    const response = await PetInSale.findOne({
      where: { id: req.params.id },
    });

    res.status(200).json({
      status: "success",
      msg: "Berhasil mengambil data pet berdasarkan id",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching PetInSale by id:", error.message);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan server",
    });
  }
}

const updatePetStatusToBuyed = async (req, res) => {
  const { id } = req.params; // Mengambil ID dari parameter URL
  const { status } = req.body; // Mengambil status dari body (kita harapkan 'buyed')

  // Validasi sederhana jika perlu, misal:
  if (status !== 'paid') {
    return res.status(400).json({
      status: "failed",
      msg: "Hanya status 'paid' yang diizinkan untuk endpoint ini.",
    });
  }

  try {
    const [updatedRowsCount] = await PetInSale.update(
      { status: status }, // Data yang akan diupdate
      {
        where: {
          id: id, // Kondisi WHERE untuk mencari berdasarkan ID
        },
      }
    );

    if (updatedRowsCount === 0) {
      // Jika tidak ada baris yang diupdate, berarti ID tidak ditemukan
      return res.status(404).json({
        status: "failed",
        msg: `Hewan peliharaan dengan ID ${id} tidak ditemukan.`,
      });
    }

    // Ambil data hewan peliharaan yang sudah diupdate untuk dikirim sebagai respons
    const updatedPet = await PetInSale.findByPk(id);

    res.status(200).json({
      status: "success",
      msg: "Status hewan peliharaan berhasil diperbarui menjadi 'buyed'.",
      data: updatedPet, // Mengirimkan data hewan peliharaan yang sudah diupdate
    });
  } catch (error) {
    console.error("Error updating pet status:", error);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan di server saat memperbarui status hewan peliharaan.",
      error: error.message,
    });
  }
};

async function updatePetInSale(req, res) {
  try {
    const { name, category, description, price, age, healthStatus, imgUrl, location_lat, location_long } = req.body;
    let updatedData = { name, category, description, price, age, healthStatus, imgUrl, location_lat, location_long };

    const result = await PetInSale.update(updatedData, { where: { id: req.params.id } });

    if (result[0] === 0) {
      return res.status(404).json({
        status: "failed",
        msg: "Pet tidak ditemukan atau tidak ada data yang berubah",
      });
    }

    res.status(200).json({
      status: "success",
      msg: "Pet berhasil diupdate",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan di server",
    });
  }
}

async function deletePetInSale(req, res) {
  try {
    const deleted = await PetInSale.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({
        status: "failed",
        msg: "pet tidak ditemukan",
      });
    }
    res.status(200).json({
      status: "success",
      msg: "pet berhasil dihapus",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan di server",
    });
  }
}

export {
  addPetInSale,
  getPetInSale,
  getPetInSaleByEmail,
  getPetInSaleById,
  updatePetStatusToBuyed,
  updatePetInSale,
  deletePetInSale
};
