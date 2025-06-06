import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./userModel.js";
import PetInSale from "./petInSaleModel.js";

const { DataTypes } = Sequelize;

const Transaction = db.define(
  "transaction",
  {
    
    buyerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "email",
      },
    },
    animalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PetInSale,
        key: "id",
      },
    },
    sellerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "email",
      },
    },
    status: {
      type: DataTypes.ENUM("paid", "shipping", "delivered", "canceled"),
      defaultValue: "paid",
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    shipping_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // createdAt & updatedAt aktif
  }
);

// Relasi buyer → transaction
User.hasMany(Transaction, { foreignKey: "buyerEmail" });
Transaction.belongsTo(User, { foreignKey: "buyerEmail"});

// Relasi seller → transaction
User.hasMany(Transaction, { foreignKey: "sellerEmail"});
Transaction.belongsTo(User, { foreignKey: "sellerEmail"});

// Relasi animal → transaction
PetInSale.hasMany(Transaction, { foreignKey: "animalId" });
Transaction.belongsTo(PetInSale, { foreignKey: "animalId" });

db.sync().then(() => console.log("Database Transaction synced"));

export default Transaction;

