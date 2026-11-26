import { PrismaClient } from "@prisma/client";

const routes = [
  { routeNumber: "BLUE", routeName: "St. Norbert", description: "Unicity to St. Norbert", busNumber: 1111, neighbourhood: "Portage", weekday: "Monday to Friday", weekend: "Saturday to Sunday", time: "06:00-00:00", stops: [10011, 10012, 10013] },
  { routeNumber: "FX2", routeName: "Main", description: "Garden City to St.Vital", busNumber: 2222, neighbourhood: "Garden City", weekday: "Monday to Friday", weekend: "Saturday to Sunday", time: "06:00-00:00", stops: [20011, 20012, 20013] },
  { routeNumber: "FX3", routeName: "Regent", description: "Rendonda to Pandora", busNumber: 3333, neighbourhood: "Transcona", weekday: "Monday to Friday", weekend: "Saturday", time: "06:00-00:00", stops: [30011, 30012, 30013] },
  { routeNumber: "FX4", routeName: "Main", description: "Garden City to St.Vital", busNumber: 4444, neighbourhood: "Garden City", weekday: "Monday to Friday", weekend: "Saturday to Sunday", time: "06:00-00:00", stops: [40011, 40012, 40013] },
  { routeNumber: "D10", routeName: "Panet", description: "Kildonan Place to Waterford Green", busNumber: 5555, neighbourhood: "East Kildonan", weekday: "Monday to Friday", weekend: "Saturday", time: "07:00-21:00", stops: [50011, 50012, 50013] },
  { routeNumber: "D11", routeName: "Salter", description: "Templeton to Beautmont Station", busNumber: 6666, neighbourhood: "North End", weekday: "Monday to Friday", weekend: "Saturday to Sunday", time: "05:00-00:00", stops: [60011, 60012, 60013] },
  { routeNumber: "D12", routeName: "Ellice", description: "Airport to the Forks", busNumber: 7777, neighbourhood: "West End", weekday: "Monday to Friday", weekend: "NA", time: "06:00-18:00", stops: [70011, 70012, 70013] },
  { routeNumber: "22", routeName: "Portage", description: "Unicity to Polo Park", busNumber: 8888, neighbourhood: "St. James", weekday: "Monday to Friday", weekend: "Saturday to Sunday", time: "06:00-00:00", stops: [80011, 80012, 80013] },
  { routeNumber: "28", routeName: "Arlington", description: "McPhillips to River Heights", busNumber: 9999, neighbourhood: "River Heights", weekday: "Monday to Friday", weekend: "Saturday to Sunday", time: "06:00-00:00", stops: [90011, 90012, 90013] },
  { routeNumber: "101", routeName: "South St, Vital On-Request", description: "On request bus that serves St. Vital area", busNumber: 1010, neighbourhood: "St. Vital", weekday: "NA", weekend: "NA", time: "NA", stops: [11011, 11012, 11013] },
];

export async function seedBusRoutes(prisma: PrismaClient) {
  for (const { stops, ...routeData } of routes) {
    await prisma.busRoute.upsert({
      where: { routeNumber: routeData.routeNumber },
      update: {},
      create: {
        ...routeData,
        stops: {
          create: stops.map((busStopNumber) => ({
            busStopNumber,
            }))
        },
        },
    });
    }
    console.log("Bus routes seeded successfully.");
}