import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plane, Loader2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface Flight {
  flight: {
    iata: string;
    icao: string;
  };
  departure: {
    airport: string;
    iata: string;
    scheduled: string;
  };
  arrival: {
    airport: string;
    iata: string;
    scheduled: string;
  };
  airline: {
    name: string;
  };
  flight_status: string;
}

const FlightTracker = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const { toast } = useToast();

  const { data: flights, isLoading } = useQuery({
    queryKey: ["flights", fromLocation, toLocation],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://api.aviationstack.com/v1/flights`,
          {
            params: {
              access_key: import.meta.env.VITE_AVIATION_API_KEY,
              dep_iata: fromLocation,
              arr_iata: toLocation,
              limit: 10,
            },
          }
        );
        return response.data.data;
      } catch (error) {
        toast({
          title: "Error fetching flights",
          description: "Please try again later or contact support.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: Boolean(fromLocation && toLocation),
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">From (IATA code)</label>
          <Input
            placeholder="e.g. JFK, LAX"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value.toUpperCase())}
            className="w-full"
            maxLength={3}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">To (IATA code)</label>
          <Input
            placeholder="e.g. LHR, CDG"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value.toUpperCase())}
            className="w-full"
            maxLength={3}
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
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flights?.map((flight: Flight) => (
              <TableRow key={flight.flight.iata}>
                <TableCell className="font-medium">{flight.airline.name}</TableCell>
                <TableCell>{flight.flight.iata}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{flight.departure.airport}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(flight.departure.scheduled).toLocaleTimeString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{flight.arrival.airport}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(flight.arrival.scheduled).toLocaleTimeString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{flight.flight_status}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Track
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