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
  icao24: string;
  callsign: string;
  origin_country: string;
  time_position: number;
  last_contact: number;
  longitude: number;
  latitude: number;
  baro_altitude: number;
  on_ground: boolean;
  velocity: number;
  true_track: number;
  vertical_rate: number;
  sensors: number[];
  geo_altitude: number;
  squawk: string;
  spi: boolean;
  position_source: number;
}

const FlightTracker = () => {
  const [searchArea, setSearchArea] = useState({
    lamin: 45.8389,  // Default to North America bounds
    lomin: -130.0,
    lamax: 49.0,
    lomax: -120.0
  });
  const { toast } = useToast();

  const { data: flights, isLoading } = useQuery({
    queryKey: ["flights", searchArea],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `https://opensky-network.org/api/states/all`,
          {
            params: {
              ...searchArea,
              extended: 1
            }
          }
        );
        return response.data.states?.map((flight: any[]) => ({
          icao24: flight[0],
          callsign: flight[1]?.trim(),
          origin_country: flight[2],
          time_position: flight[3],
          last_contact: flight[4],
          longitude: flight[5],
          latitude: flight[6],
          baro_altitude: flight[7],
          on_ground: flight[8],
          velocity: flight[9],
          true_track: flight[10],
          vertical_rate: flight[11],
          sensors: flight[12],
          geo_altitude: flight[13],
          squawk: flight[14],
          spi: flight[15],
          position_source: flight[16],
        })) || [];
      } catch (error) {
        toast({
          title: "Error fetching flights",
          description: "Please try again later or contact support.",
          variant: "destructive",
        });
        return [];
      }
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Min Latitude</label>
          <Input
            type="number"
            value={searchArea.lamin}
            onChange={(e) => setSearchArea(prev => ({...prev, lamin: parseFloat(e.target.value)}))}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Max Latitude</label>
          <Input
            type="number"
            value={searchArea.lamax}
            onChange={(e) => setSearchArea(prev => ({...prev, lamax: parseFloat(e.target.value)}))}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Min Longitude</label>
          <Input
            type="number"
            value={searchArea.lomin}
            onChange={(e) => setSearchArea(prev => ({...prev, lomin: parseFloat(e.target.value)}))}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Max Longitude</label>
          <Input
            type="number"
            value={searchArea.lomax}
            onChange={(e) => setSearchArea(prev => ({...prev, lomax: parseFloat(e.target.value)}))}
            className="w-full"
          />
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
              <TableHead>Call Sign</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Altitude</TableHead>
              <TableHead>Speed</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flights?.map((flight: Flight) => (
              <TableRow key={flight.icao24}>
                <TableCell className="font-medium">{flight.callsign || 'N/A'}</TableCell>
                <TableCell>{flight.origin_country}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>Lat: {flight.latitude?.toFixed(4)}</div>
                    <div>Long: {flight.longitude?.toFixed(4)}</div>
                  </div>
                </TableCell>
                <TableCell>{flight.baro_altitude ? `${Math.round(flight.baro_altitude)}m` : 'N/A'}</TableCell>
                <TableCell>{flight.velocity ? `${Math.round(flight.velocity * 3.6)}km/h` : 'N/A'}</TableCell>
                <TableCell>{flight.on_ground ? 'On Ground' : 'In Air'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default FlightTracker;