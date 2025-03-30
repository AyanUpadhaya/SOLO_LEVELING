import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
dotenv.config({
  path: "./.env",
});
//Schema
const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});
const Notes = mongoose.model("note", notesSchema);

//rate limit
import { rateLimit } from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 60, // Limit each IP to 60 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const app = express();

// Middleware
app.use(json());
app.use(cors());
// Apply the rate limiting middleware to all requests.
app.use(limiter);

// Utility to catch async errors
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom AppError class
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post(
  "/notes",
  catchAsync(async (req, res, next) => {
    const data = req.body;
    const note = new Notes(data);
    if (!note) next(new AppError("Something went wrong creating note", 400));

    await note.save();
    res.json({ message: "note created", data: note });
  })
);

app.get(
  "/notes",
  catchAsync(async (req, res, next) => {
    // const notes = await Notes.find().select("title").limit(2);
    const notes = await Notes.find().select("title");
    if (notes.length == 0) return next(new AppError("No notes available", 400));
    res.json(notes);
  })
);
app.get(
  "/notes/:id",
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const note = await Notes.findById(id);
    if (!note) return next(new AppError("Note not found", 404));
    res.json(note);
  })
);
app.put(
  "/notes/:id",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  catchAsync(async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new AppError(
          errors
            .array()
            .map((err) => err.msg)
            .join(", "),
          400
        )
      );
    }

    const id = req.params.id;
    const updatedNote = await Notes.findByIdAndUpdate(
      id,
      { title: req.body.title, content: req.body.content },
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    if (!updatedNote) return next(new AppError("Note not found", 404));

    res.status(200).json({ message: "Note updated", note: updatedNote });
  })
);

// Dummy products data
const getProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 },
        { id: 3, name: "Product 3", price: 300 },
      ]);
    }, 100);
  });
};

// Products route
app.get(
  "/products",
  catchAsync(async (_, res, next) => {
    const products = await getProducts();
    console.log(products);
    res.json(products);
    if (products.length == 0) next(new AppError("No products available", 400));
  })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  mongoose
    // eslint-disable-next-line no-undef
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Failed to connect ", err));
});
