import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plane, Loader2 } from "lucide-react";
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
  status: string;
  airline: string;
}

const mockFlights: Flight[] = [
  {
    id: "1",
    flightNumber: "SA123",
    departure: "Johannesburg",
    arrival: "Cape Town",
    status: "On Time",
    airline: "South African Airways",
  },
  {
    id: "2",
    flightNumber: "BA456",
    departure: "London",
    arrival: "Johannesburg",
    status: "Delayed",
    airline: "British Airways",
  },
  {
    id: "3",
    flightNumber: "EK789",
    departure: "Dubai",
    arrival: "Johannesburg",
    status: "Boarding",
    airline: "Emirates",
  },
];

const FlightTracker = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: flights, isLoading } = useQuery({
    queryKey: ["flights", searchQuery],
    queryFn: async () => {
      // Simulating API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockFlights.filter(
        (flight) =>
          flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flight.airline.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectFlight = (flight: Flight) => {
    // TODO: Implement biometric verification flow
    console.log("Selected flight:", flight);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by flight number or airline..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-md"
        />
        <Plane className="text-primary h-6 w-6" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flight Number</TableHead>
              <TableHead>Airline</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flights?.map((flight) => (
              <TableRow key={flight.id}>
                <TableCell>{flight.flightNumber}</TableCell>
                <TableCell>{flight.airline}</TableCell>
                <TableCell>{flight.departure}</TableCell>
                <TableCell>{flight.arrival}</TableCell>
                <TableCell>{flight.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectFlight(flight)}
                  >
                    Select
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