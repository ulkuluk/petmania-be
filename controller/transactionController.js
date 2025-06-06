import Transaction from "../models/transactionModel.js";

// Tambah transaksi baru
export async function addTransaction(req, res) {
  try {
    const {
      buyerEmail,
      animalId,
      sellerEmail,
      price,
      shipping_address,
    } = req.body;

    const newTransaction = await Transaction.create({
      buyerEmail,
      animalId,
      sellerEmail,
      price,
      shipping_address,
      status: "paid",
    });

    res.status(201).json({
      status: "success",
      msg: "Transaksi berhasil dibuat",
      data: newTransaction,
    });
  } catch (error) {
    console.error("Error menambahkan transaksi:", error);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan server",
    });
  }
}

// Ambil semua transaksi
export async function getAllTransactions(req, res) {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json({
      status: "success",
      msg: "Berhasil mengambil semua transaksi",
      data: transactions,
    });
  } catch (error) {
    console.error("Error mengambil transaksi:", error);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan server",
    });
  }
}

// Ambil transaksi berdasarkan email buyer
export async function getTransactionsByBuyer(req, res) {
  try {
    const { email } = req.params;

    const transactions = await Transaction.findAll({
      where: { buyerEmail: email },
    });

    res.status(200).json({
      status: "success",
      msg: "Berhasil mengambil transaksi berdasarkan buyer",
      data: transactions,
    });
  } catch (error) {
    console.error("Error mengambil transaksi buyer:", error);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan server",
    });
  }
}

// Update status transaksi
export async function updateTransactionStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({
        status: "failed",
        msg: "Transaksi tidak ditemukan",
      });
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json({
      status: "success",
      msg: "Status transaksi berhasil diperbarui",
      data: transaction,
    });
  } catch (error) {
    console.error("Error memperbarui status transaksi:", error);
    res.status(500).json({
      status: "failed",
      msg: "Terjadi kesalahan server",
    });
  }
}

export const getTransactionsByAnimalId = async (req, res) => {
  try {
    const { animalId } = req.params;

    const transactions = await Transaction.findAll({
      where: {
        animalId: animalId,
      },
      order: [['createdAt', 'DESC']],
    });

    if (transactions.length === 0) {
      return res.status(200).json({ status: "success", msg: "Tidak ada transaksi ditemukan untuk hewan ini.", data: [] });
    }

    res.status(200).json({ status: "success", msg: "Transaksi berhasil dimuat.", data: transactions });
  } catch (error) {
    console.error("Error fetching transactions by animal ID:", error);
    res.status(500).json({ status: "failed", msg: "Terjadi kesalahan di server.", error: error.message });
  }
};
