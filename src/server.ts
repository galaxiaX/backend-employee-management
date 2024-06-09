import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import Employee from "./model/Employee";

import dotenv from "dotenv";
import { ReqBodyType } from "./types/type";
import { EmployeeType } from "./types/employee.type";
dotenv.config();

const app = express();
const port = 8000;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
  }
};

connectMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.MAIN_URL || "*",
    // origin: process.env.MAIN_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.get("/check", async (req: Request, res: Response) => {
  res.json({ result: "ok" });
});

app.route("/employees").get(async (req, res) => {
  try {
    const employeeList = await Employee.find();
    res.status(200).json(employeeList);
  } catch (err: any) {
    console.error(err);
    res.status(err?.status || 500).send(err);
  }
});

app.route("/employee/(:id)").get(async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.find({
      _id: new mongoose.Types.ObjectId(id),
    });
    res.status(200).json(employee);
  } catch (err: any) {
    console.error(err);
    res.status(err?.status || 500).send(err);
  }
});

app
  .route("/create")
  .post(async (req: ReqBodyType<Omit<EmployeeType, "_id">>, res) => {
    try {
      const bodyData = req.body;

      const data = await Employee.create(bodyData);
      res.status(201).json({ message: "Employee created", data });
    } catch (err: any) {
      console.error(err);
      res.status(err?.status || 500).send(err);
    }
  });

app.route("/update/(:id)").put(async (req: ReqBodyType<EmployeeType>, res) => {
  try {
    const bodyData = req.body;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { status: 422, message: "ID is not valid" };
    }

    const foundedList = await Employee.findById(id);
    if (!foundedList) throw { status: 404, message: "Employee not found" };

    foundedList.set({
      ...bodyData,
    });
    const data = await foundedList.save();

    res.json({ message: "Employee updated", data });
  } catch (err: any) {
    console.error(err);
    res.status(err?.status || 500).send(err);
  }
});

app.route("/delete/(:id)").delete(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { status: 422, message: "ID is not valid" };
    }
    const foundedEmployee = await Employee.findById(id);
    if (!foundedEmployee) throw { status: 404, message: "Employee not found" };

    const deletedEmployee = await Employee.findByIdAndDelete(id);
    res.json({ message: "Employee deleted", data: deletedEmployee });
  } catch (err: any) {
    console.error(err);
    res.status(err?.status || 500).send(err);
  }
});

app.listen(port, () => console.log("Server is running on port " + port));
