import { DataTypes } from "sequelize";
import db from "../config/database.js";

const User = db.define("user", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location_lat: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  location_long: {
    type: DataTypes.DECIMAL,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true, 
  
});

db.sync().then(() => console.log("Database User synced"));

export default User;