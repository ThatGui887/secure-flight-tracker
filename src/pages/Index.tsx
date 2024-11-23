import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FlightTracker from "@/components/FlightTracker";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-primary">Secure Flight Tracker</h1>
        <Card>
          <CardHeader>
            <CardTitle>Flight Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <FlightTracker />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;