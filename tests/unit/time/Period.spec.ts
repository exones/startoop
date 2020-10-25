import { Period } from "@/sim/time/Period";
import { unitOfTime } from "moment";

describe("Period constructor", () => {
    it("Period is created with correct values", () => {
        const sut: Period = new Period(12, "years");

        expect(sut.amount).toBe(12);
        expect(sut.unit).toBe(<unitOfTime.Base>"years");
    });
});
