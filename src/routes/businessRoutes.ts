import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import Booking from "../models/Booking";
import Business from "../models/Business";
import Category from "../models/Category";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const businesses = await Business.find();
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching businesses", error: err });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const business = req.body;

  try {
    const categoryExists = await Category.findOne({ name: business.category });
    if (!categoryExists) {
      return res.status(400).json({
        message: "Failed to add business: specified category does not exist.",
      });
    }

    const newBusiness = new Business(business);

    const savedBusiness = await newBusiness.save();
    res.status(201).json(savedBusiness);
  } catch (err) {
    res.status(500).json({
      message: "Server error while adding business.",
      error: (err as Error).message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("gauta uzklausa pagal id:", req.params.id);
    const business = await Business.findById(req.params.id);
    console.log(business);
    if (business) {
      res.json(business);
    } else {
      res.status(404).send("Business not found");
    }
  } catch (err) {
    console.log("nepaejo pagal id:");
    res.status(500).json({ message: "Error fetching business", error: err });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const filteredBusinesses = await Business.find({
      category: req.params.category.toLowerCase(),
    });
    res.json(filteredBusinesses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching businesses by category", error: err });
  }
});

router.get("/:id/bookings/date/:date", async (req, res) => {
  try {
    const slots = await Booking.find({
      businessId: req.params.id,
      date: new Date(req.params.date),
    });
    res.json(slots);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching bookings for the specified date and business",
      error: err,
    });
  }
});

router.post("/businesses", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      about,
      address,
      category,
      contactPerson,
      email,
      imageUrls,
    } = req.body;

    const newBusiness = new Business({
      name,
      about,
      address,
      category,
      contactPerson,
      email,
      imageUrls,
    });

    const savedBusiness = await newBusiness.save();
    res.status(201).json(savedBusiness);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});


export default router;
