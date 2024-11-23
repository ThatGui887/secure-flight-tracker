import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plane, Loader2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Flight {
  id: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: string;
  airline: string;
}

const mockFlights: Flight[] = [
  {
    id: "1",
    flightNumber: "SA123",
    departure: "New York (JFK)",
    arrival: "London (LHR)",
    departureTime: "08:00 AM",
    arrivalTime: "9:30 PM",
    price: 450,
    status: "Available",
    airline: "British Airways",
  },
  {
    id: "2",
    flightNumber: "BA456",
    departure: "London (LHR)",
    arrival: "Paris (CDG)",
    departureTime: "10:15 AM",
    arrivalTime: "12:45 PM",
    price: 180,
    status: "Few seats left",
    airline: "Air France",
  },
  {
    id: "3",
    flightNumber: "EK789",
    departure: "Dubai (DXB)",
    arrival: "Singapore (SIN)",
    departureTime: "11:30 PM",
    arrivalTime: "1:15 PM",
    price: 680,
    status: "Available",
    airline: "Emirates",
  },
];

const FlightTracker = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  const { data: flights, isLoading } = useQuery({
    queryKey: ["flights", fromLocation, toLocation],
    queryFn: async () => {
      // Simulating API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockFlights.filter(
        (flight) =>
          (!fromLocation ||
            flight.departure.toLowerCase().includes(fromLocation.toLowerCase())) &&
          (!toLocation ||
            flight.arrival.toLowerCase().includes(toLocation.toLowerCase()))
      );
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <Input
            placeholder="Departure city or airport"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <Input
            placeholder="Arrival city or airport"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <div className="relative">
            <Input
              type="date"
              className="w-full"
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Airline</TableHead>
              <TableHead>Flight</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flights?.map((flight) => (
              <TableRow key={flight.id}>
                <TableCell className="font-medium">{flight.airline}</TableCell>
                <TableCell>{flight.flightNumber}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{flight.departure}</div>
                    <div className="text-sm text-gray-500">{flight.departureTime}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{flight.arrival}</div>
                    <div className="text-sm text-gray-500">{flight.arrivalTime}</div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">${flight.price}</TableCell>
                <TableCell>{flight.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Book Now
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default FlightTracker;