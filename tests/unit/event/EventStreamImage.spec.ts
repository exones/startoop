import { EventStreamImage } from "@/sim/event/EventStreamImage";
import { EachImage } from "@/sim/recurrence/EachImage";
import { OnceImage } from "@/sim/recurrence/OnceImage";
import { MomentUtils } from "@/sim/time/MomentUtils";
import { Period } from "@/sim/time/Period";
import "jest-extended";
import "@/sim/time/PeriodExtensions";

describe("EventStreamImage", () => {

    var sut: EventStreamImage = new EventStreamImage("aName");

    beforeEach(() => {
        sut = new EventStreamImage("aName");
    });

    describe("constructor", () => {
        it("must create with correct default values", () => {
            expect(sut.name).toBe("aName");
            expect(sut.startAt).toEqual(Period.of(0, "days"));
            expect(sut.endAt).toEqual(undefined);
            expect(sut.emitter).toBeDefined();
            expect(sut.emitter()).toEqual({});
            expect(sut.recurrence).toBeDefined();
            expect(sut.recurrence).toBeInstanceOf(OnceImage);
        });
    });

    describe("from", () => {
        it("must create from string", () => {
            const res = sut.from("2020-12-31");

            expect(res).toBe(sut);
            expect(sut.startAt).toBeDefined();
            expect(sut.startAt).toEqual(MomentUtils.of("2020-12-31"));
        });

        it("must create from Period", () => {
            const res = sut.from(Period.of(1, "year"));

            expect(res).toBe(sut);
            expect(sut.startAt).toEqual(Period.of(1, "year"));
        });
    });

    describe("until", () => {
        it ("must create from string",  () => {
            const res = sut.until("2020-12-31");

            expect(res).toBe(sut);
            expect(sut.endAt).toBeDefined();
            expect(sut.endAt).toEqual(MomentUtils.of("2020-12-31"));
        });

        it("must create from Period", () => {
            const res = sut.until((1).years());

            expect(res).toBe(sut);
            expect(sut.endAt).toEqual(Period.of(1, "years"));
        });
    });

    describe("once", () => {
        it("must set correct recurrence", () => {
            const res = sut.once();

            expect(res).toBe(sut);
            expect(sut.recurrence).toBeInstanceOf(OnceImage);
        });
    });

    describe("each", () => {
        it("must set correct recurrence", () => {
            const res = sut.each((2).days());

            expect(res).toBe(sut);
            expect(sut.recurrence).toBeInstanceOf(EachImage);
            
            const eachRec = <EachImage>sut.recurrence;

            expect(eachRec.period).toEqual((2).days());
        });
    });
});