import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; 

const encodedDbName = encodeURIComponent("Course1_c++");
const connectionSrt = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.j9gms.mongodb.net/${encodedDbName}?retryWrites=true&w=majority&appName=Cluster0`;

const courseSchema = new mongoose.Schema({
  course_name: { type: String, required: true },
  instructor: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  sections: { type: [{ type: [{ type: String, required: true }, { type: [String], required: true }], required: true }], required: true },
  price: { type: Number, required: true }
});

const CourseNew = mongoose.models.Details || mongoose.model("Details", courseSchema, "Details");

mongoose.set("debug", true);

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    console.log("✅ Already connected to MongoDB.");
    return;
  }
  try {
    console.log("🚀 Connecting to MongoDB...");
    await mongoose.connect(connectionSrt);
    console.log("✅ Successfully connected to MongoDB.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

let data: { course_name: string; instructor: string; description: string; duration: string; sections: { type: string; content: string[] }[], price: Number }[] = [];

export async function GET() {
  try {
    await connectDB();
    data = await CourseNew.find();
    
    if (!data || data.length === 0) {
      return NextResponse.json({ result: "No data found" }, { status: 404 });
    }
    return NextResponse.json({ result: data });
  } 
  catch (error) {
    console.error("Error in GET route:", error);
    return NextResponse.json({ 
      error: "Failed to fetch data", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}