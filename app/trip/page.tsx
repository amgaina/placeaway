'use client';

import Image from 'next/image';
import {
  Plane,
  Info,
  Calendar,
  Euro,
  Zap,
  Phone,
  Send,
  Sun,
  Globe,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

{
  /* Travel Page */
}
export default function TravelPage() {
  return (
    <div className="bg-slate-100 text-slate-800 p-6 min-h-screen">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-sky-700">
          Your Paris Adventure
        </h1>
        <p className="text-xl text-sky-600">Discover the city of lights</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Travel Overview */}
        <Card className="bg-white shadow-md">
          <CardHeader className="p-4 bg-sky-100">
            <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
              <Plane className="h-6 w-6" />
              Travel Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2 text-lg">
              <p>
                <span className="font-semibold">Origin:</span> Monroe, LA, USA
              </p>
              <p>
                <span className="font-semibold">Destination:</span> Paris,
                France
              </p>
              <p>
                <span className="font-semibold">Distance:</span> ~4,700 miles
              </p>
              <p>
                <span className="font-semibold">Time Difference:</span> +7 hours
              </p>
              <p>
                <span className="font-semibold">Flight:</span> MLU → Major Hub →
                CDG
              </p>
              <p>
                <span className="font-semibold">Travel Time:</span> ~12-15 hours
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Budget Tracker */}
        <Card className="bg-white shadow-md">
          <CardHeader className="p-4 bg-sky-100">
            <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
              <Euro className="h-6 w-6" />
              Budget Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between text-lg">
              <span>Total: $9000</span>
              <span>Spent: $6000</span>
            </div>
            <Progress value={66} className="h-3 bg-sky-100" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Flight', amount: '$1906', icon: Plane },
                { label: 'Accommodation', amount: '$1494', icon: Calendar },
                { label: 'Food', amount: '$600', icon: Euro },
                { label: 'Activities', amount: '$500', icon: Calendar },
                { label: 'Transport', amount: '$300', icon: Plane },
                { label: 'Misc', amount: '$200', icon: Euro },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between bg-sky-50 p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-sky-600" />
                    <span>{item.label}</span>
                  </div>
                  <span>{item.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Trip Overview */}
        <Card className="bg-white shadow-md">
          <CardContent className="p-0">
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Paris skyline"
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/60 to-transparent flex items-end p-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Day 1: Departure
                  </h2>
                  <p className="text-lg text-sky-100">
                    MLU → Major Hub → Overnight to Paris
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between p-3 bg-sky-50">
              <Button
                variant="outline"
                size="sm"
                className="text-sky-700 border-sky-300 hover:bg-sky-100"
              >
                More Info
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-sky-700 border-sky-300 hover:bg-sky-100"
              >
                Next Day
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-sky-700 border-sky-300 hover:bg-sky-100"
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="bg-white shadow-md">
          <CardHeader className="p-4 bg-sky-100">
            <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
              <Globe className="h-6 w-6" />
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Weather Forecast', icon: Sun },
                { label: 'Currency Converter', icon: Euro },
                { label: 'Language Translation', icon: Globe },
                { label: 'Emergency Contacts', icon: AlertTriangle },
                { label: 'Local Customs', icon: Info },
                { label: 'Flight Status', icon: Plane },
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  size="lg"
                  className="flex items-center justify-start gap-2 h-auto py-3 px-4 text-left text-sky-700 border-sky-300 hover:bg-sky-100"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Itinerary */}
        <Card className="bg-white shadow-md">
          <CardHeader className="p-4 bg-sky-100">
            <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
              <Calendar className="h-6 w-6" />
              Trip Itinerary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="itinerary" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-sky-50">
                <TabsTrigger
                  value="itinerary"
                  className="data-[state=active]:bg-white text-sm py-2"
                >
                  Itinerary
                </TabsTrigger>
                <TabsTrigger
                  value="dining"
                  className="data-[state=active]:bg-white text-sm py-2"
                >
                  Dining
                </TabsTrigger>
                <TabsTrigger
                  value="accommodations"
                  className="data-[state=active]:bg-white text-sm py-2"
                >
                  Accommodations
                </TabsTrigger>
                <TabsTrigger
                  value="attractions"
                  className="data-[state=active]:bg-white text-sm py-2"
                >
                  Attractions
                </TabsTrigger>
              </TabsList>
              <TabsContent value="itinerary" className="p-4 space-y-3">
                <p className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-sky-600" /> Day 1: Depart MLU
                </p>
                <p className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-sky-600" /> Day 2: Arrive CDG
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-sky-600" /> Day 2-7: Explore
                  Paris
                </p>
                <p className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-sky-600" /> Day 8: Return to
                  MLU
                </p>
              </TabsContent>
              <TabsContent value="dining" className="p-4">
                <p>Discover the best of Parisian cuisine...</p>
              </TabsContent>
              <TabsContent value="accommodations" className="p-4">
                <p>Luxurious hotels and cozy apartments await...</p>
              </TabsContent>
              <TabsContent value="attractions" className="p-4">
                <p>Must-visit landmarks and hidden gems...</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Travel Tips */}
        <Card className="bg-white shadow-md">
          <CardHeader className="p-4 bg-sky-100">
            <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
              <Info className="h-6 w-6" />
              Travel Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-xl text-sky-700">
                Cultural Tips
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Learn basic French phrases</li>
                <li>Dress smartly; Parisians dress well</li>
                <li>Tipping: 5-10% for good service</li>
                <li>Many shops close Sundays & lunch (12-2 PM)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-xl text-sky-700">
                Practical Info
              </h3>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-sky-600" />
                  Currency: Euro (€)
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-sky-600" />
                  Electricity: 230V, 50Hz; Need adapter
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-sky-600" />
                  Emergency: 112
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Input */}
      <Card className="bg-white shadow-md">
        <CardHeader className="p-4 bg-sky-100">
          <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
            <Send className="h-6 w-6" />
            Chat with AI Travel Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              placeholder="Ask me anything about your trip..."
              className="flex-grow bg-white border-sky-300 text-slate-800 placeholder-slate-400 text-lg py-6"
            />
            <Button
              size="lg"
              className="bg-sky-600 text-white hover:bg-sky-700 px-6"
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
