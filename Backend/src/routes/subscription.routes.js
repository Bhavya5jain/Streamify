import express from "express";
const router = express.Router();
import {createSubscription,getAllSubscriptions,getSubscriptionById,deleteSubscription} from "../controllers/subscription.controller.js"
import {authMiddleware} from "../middlewares/Auth.middleware.js";

router.use(authMiddleware)

router.post("/",createSubscription);
router.get("/",getAllSubscriptions);
router.get("/:subscriptionId",getSubscriptionById);
router.delete("/:subscriptionId",deleteSubscription);

export default router