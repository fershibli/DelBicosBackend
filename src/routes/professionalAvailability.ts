import { Router } from "express";

import { AvailabilityController } from "../controllers/professionalAvailability.controller";

const router = Router({
  mergeParams: true,
});

const controller =
  new AvailabilityController();





/* ======================================================
   RAW AVAILABILITY
====================================================== */


router.put(
  "/:professionalId/day-override",
  controller.updateDayOverride
);

router.post(
  "/:professionalId/block",
  controller.blockDay
);

router.delete(
  "/:professionalId/block",
  controller.unblockDay
);

router.get(
  "/:professionalId/availability",
  controller.getAvailability
);

router.put(
  "/:professionalId/availability",
  controller.updateAvailability
);





/* ======================================================
   RESOLVED CALENDAR
====================================================== */

router.get(
  "/:professionalId/calendar",
  controller.getResolvedCalendar
);





/* ======================================================
   DAY OVERRIDE
====================================================== */

router.put(
  "/:professionalId/day-override",
  controller.updateDayOverride
);

router.delete(
  "/:professionalId/day-override/:date",
  controller.removeDayOverride
);





/* ======================================================
   BLOCKS
====================================================== */

router.post(
  "/:professionalId/block",
  controller.blockDay
);

router.delete(
  "/:professionalId/block/:date",
  controller.unblockDay
);

export default router;

