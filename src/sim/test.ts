import { EarnEvent } from './EarnEvent';
import { Events } from './event/Events';
import { SystemImage } from "./System";
import "@/sim/time/PeriodExtensions";
import { Period } from './time/Period';

let sys: SystemImage = new SystemImage("test");

let salary = sys
    .eventStream("salary")
    .from(Period.of(1, "month"))
    // .for(3, "years")
    .each((1).day())
    .emit(Events.earn(1000));

// let x = EarnEvent.NAME;

// type EventName<T> =
//     T extends EventListenCondition<EarnEvent> ? EarnEvent :
//     T extends EventListenCondition<SpendEvent> ? SpendEvent : "UNKNOWN";

// type ExtractType<T> = T extends EventListenCondition<infer R> ? R : never;


// export class Test {
//     listen<T extends EventData>(cls: any, reaction: SensorEventReaction<T>) {
//         return this.listenIf<T>(cls, (evt) => true, reaction);
//     }

//     listenIf<T extends EventData>(cls: any, condition: EventListenCondition<T>, reaction: SensorEventReaction<T>) {
//         console.log(cls.name);
//         return this;
//     }
// }

// let test = new Test();


// test.listen<EarnEvent>(EarnEvent, (sys, evt) => {
//     console.log(`Event ${evt.name} occured with amount ${evt.amount}`)
// });

// const data: Plotly.Data[] = [
//     {
//         x: ['giraffes', 'orangutans', 'monkeys'],
//         y: [20, 14, 23],
//         type: 'bar'
//     }
// ];

// Plotly.newPlot('div', data);



// let stdSalary = sys
//     .eventStream("Salary")
//     .from("12/10/2020")
//     .each().month()
//     .emit(Events.spend(1000))
//     .thenAfter(3).years()
//     .changeEvent(Events.spend(2000))

// sys
//     .sensor("earnings")
//     .listen( [ EarnEvent ] )

// sys
//     .eventStream(stdSalary)
//     .sameAs(stdSalary)

// let alexey = sys
//     .entity("Alexey")
//     .with(stdSalary)
