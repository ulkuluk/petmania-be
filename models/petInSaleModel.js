import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./userModel.js";

const { DataTypes } = Sequelize;

const PetInSale = db.define(
  "pet_in_sale",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("dog", "cat", "bird", "fish", "reptile"),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    healthStatus: {
      type: DataTypes.ENUM("healthy", "sick", "injured"),
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location_lat: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    location_long: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "email",
      },
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("pending", "available", "paid", "sold"),
      defaultValue: "available",
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// Relasi
User.hasMany(PetInSale, { foreignKey: "email" });
PetInSale.belongsTo(User, { foreignKey: "email" });

db.sync().then(() => console.log("Database Pet In Sale synced"));

export default PetInSale;
