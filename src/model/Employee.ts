import { Schema, model } from "mongoose";

const EmployeeSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    gender: Number,
    birth_date: Date,
    address: String,
    subdistrict: String,
    district: String,
    province: String,
    id_card_exp_date: Date,
  },
  {
    timestamps: true,
  }
);

const EmployeeModel = model("Employee", EmployeeSchema);

export default EmployeeModel;
