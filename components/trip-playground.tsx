'use client';

import { useState, useEffect, SetStateAction, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane,
  Hotel,
  MapPin,
  Plus,
  Edit2,
  ArrowRight,
  Car,
  Train,
  Bus,
  Trash2,
  Save,
  Search,
  CheckCircle,
  Share2,
  CreditCard,
} from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { TripSummary } from './trip-summary';
// import { BudgetTracker } from './budget-tracker'
// import { SearchAndFilter } from './search-and-filter'
// import { RecommendationSystem } from './recommendation-system'
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const MapWithNoSSR = dynamic(() => import('./map'), { ssr: false });

const elementTypes = {
  flight: {
    icon: Plane,
    color: 'bg-blue-100 text-blue-600',
    connection: 'flight',
  },
  hotel: {
    icon: Hotel,
    color: 'bg-green-100 text-green-600',
    connection: 'stay',
  },
  activity: {
    icon: MapPin,
    color: 'bg-yellow-100 text-yellow-600',
    connection: 'activity',
  },
  transport: {
    icon: ArrowRight,
    color: 'bg-purple-100 text-purple-600',
    connection: 'transport',
  },
};

const transportIcons = {
  car: Car,
  train: Train,
  bus: Bus,
  flight: Plane,
};
export interface ElementInterface {
  details: {
    transportType?: 'car' | 'train' | 'bus' | 'flight';
    description: string;
    price: number;
    airline?: string;
    flightNumber?: string;
    departureTime?: string;
    arrivalTime?: string;
    duration?: string;
    checkIn?: string;
    checkOut?: string;
    roomType?: string;
    pricePerNight?: number;
    date?: string;
    location?: string;
    additionalInfo?: string;
    distance?: string;
    ticketPurchased?: boolean;
    reservationConfirmed?: boolean;
    gasPrice?: number;
  };

  id: string;
  type: keyof typeof elementTypes;
}

export interface TripTimelineProps {
  elements: ElementInterface[];
  updateElement: (
    id: string,
    details: Partial<ElementInterface['details']>,
  ) => void;
  removeElement: (id: string) => void;
  addElement: (index: number, type?: keyof typeof elementTypes) => void;
  moveElement: (fromIndex: number, toIndex: number) => void;
}
export interface TripElementProps {
  element: ElementInterface;
  updateElement: (
    id: string,
    details: Partial<ElementInterface['details']>,
  ) => void;
  removeElement: (id: string) => void;
  index: number;
  moveElement: (fromIndex: number, toIndex: number) => void;
}

const TripElement = ({
  element,
  updateElement,
  removeElement,
  index,
  moveElement,
}: TripElementProps) => {
  const { icon: Icon, color } = elementTypes[element.type];
  const TransportIcon = element.details.transportType
    ? transportIcons[element.details.transportType]
    : Icon;

  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({ ...element.details });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateElement(element.id, editedDetails);
    setIsEditing(false);
  };

  const handleRemove = () => {
    removeElement(element.id);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const dragRef = useRef<number | null>(null)

  // const handleDragStart = (e: React.DragEvent) => {
  //   e.dataTransfer.setData('text/plain', index.toString())
  //   e.dataTransfer.effectAllowed = 'move'
  //   if (dragRef.current !== null) {
  //     dragRef.current = index
  //   }
  // }

  // const handleDragOver = (e: { preventDefault: () => void }) => {
  //   e.preventDefault()
  // }

  // const handleDrop = (e: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => string } }) => {
  //   e.preventDefault()
  //   const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
  //   const toIndex = index
  //   if (fromIndex !== toIndex) {
  //     moveElement(fromIndex, toIndex)
  //   }
  // }

  const renderEditForm = () => {
    switch (element.type) {
      case 'flight':
        return (
          <div className="space-y-2">
            <Input
              type="text"
              name="description"
              value={editedDetails.description}
              onChange={handleInputChange}
              placeholder="Flight description"
            />
            <Input
              type="text"
              name="airline"
              value={editedDetails.airline}
              onChange={handleInputChange}
              placeholder="Airline"
            />
            <Input
              type="text"
              name="flightNumber"
              value={editedDetails.flightNumber}
              onChange={handleInputChange}
              placeholder="Flight number"
            />
            <Input
              type="datetime-local"
              name="departureTime"
              value={editedDetails.departureTime}
              onChange={handleInputChange}
            />
            <Input
              type="datetime-local"
              name="arrivalTime"
              value={editedDetails.arrivalTime}
              onChange={handleInputChange}
            />
            <Input
              type="number"
              name="price"
              value={editedDetails.price}
              onChange={handleInputChange}
              placeholder="Price"
            />
            <Textarea
              name="additionalInfo"
              value={editedDetails.additionalInfo}
              onChange={handleInputChange}
              placeholder="Additional information (e.g., luggage allowance, meal options)"
            />
            <div className="flex items-center space-x-2">
              <Label htmlFor="ticketPurchased">Ticket Purchased</Label>
              <input
                type="checkbox"
                id="ticketPurchased"
                checked={editedDetails.ticketPurchased || false}
                onChange={(e) =>
                  setEditedDetails((prev) => ({
                    ...prev,
                    ticketPurchased: e.target.checked,
                  }))
                }
              />
            </div>
          </div>
        );
      case 'hotel':
        return (
          <div className="space-y-2">
            <Input
              type="text"
              name="description"
              value={editedDetails.description}
              onChange={handleInputChange}
              placeholder="Hotel name"
            />
            <Input
              type="datetime-local"
              name="checkIn"
              value={editedDetails.checkIn}
              onChange={handleInputChange}
            />
            <Input
              type="datetime-local"
              name="checkOut"
              value={editedDetails.checkOut}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="roomType"
              value={editedDetails.roomType}
              onChange={handleInputChange}
              placeholder="Room type"
            />
            <Input
              type="number"
              name="pricePerNight"
              value={editedDetails.pricePerNight}
              onChange={handleInputChange}
              placeholder="Price per night"
            />
            <Textarea
              name="additionalInfo"
              value={editedDetails.additionalInfo}
              onChange={handleInputChange}
              placeholder="Additional information (e.g., amenities, nearby attractions)"
            />
            <div className="flex items-center space-x-2">
              <Label htmlFor="reservationConfirmed">
                Reservation Confirmed
              </Label>
              <input
                type="checkbox"
                id="reservationConfirmed"
                checked={editedDetails.reservationConfirmed || false}
                onChange={(e) =>
                  setEditedDetails((prev) => ({
                    ...prev,
                    reservationConfirmed: e.target.checked,
                  }))
                }
              />
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="space-y-2">
            <Input
              type="text"
              name="description"
              value={editedDetails.description}
              onChange={handleInputChange}
              placeholder="Activity description"
            />
            <Input
              type="date"
              name="date"
              value={editedDetails.date}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="duration"
              value={editedDetails.duration}
              onChange={handleInputChange}
              placeholder="Duration of activity"
            />
            <Input
              type="text"
              name="location"
              value={editedDetails.location}
              onChange={handleInputChange}
              placeholder="Location"
            />
            <Input
              type="number"
              name="price"
              value={editedDetails.price}
              onChange={handleInputChange}
              placeholder="Price"
            />
            <Textarea
              name="additionalInfo"
              value={editedDetails.additionalInfo}
              onChange={handleInputChange}
              placeholder="Detailed activity description"
            />
            <div className="flex items-center space-x-2">
              <Label htmlFor="ticketPurchased">Ticket Purchased</Label>
              <input
                type="checkbox"
                id="ticketPurchased"
                checked={editedDetails.ticketPurchased || false}
                onChange={(e) =>
                  setEditedDetails((prev) => ({
                    ...prev,
                    ticketPurchased: e.target.checked,
                  }))
                }
              />
            </div>
          </div>
        );
      case 'transport':
        return (
          <div className="space-y-2">
            <Input
              type="text"
              name="description"
              value={editedDetails.description}
              onChange={handleInputChange}
              placeholder="Transport description"
            />
            <Select
              value={editedDetails.transportType}
              onValueChange={(value: 'car' | 'train' | 'bus' | 'flight') =>
                setEditedDetails((prev) => ({ ...prev, transportType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Transport type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="flight">Flight</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="datetime-local"
              name="departureTime"
              value={editedDetails.departureTime}
              onChange={handleInputChange}
            />
            <Input
              type="datetime-local"
              name="arrivalTime"
              value={editedDetails.arrivalTime}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="distance"
              value={editedDetails.distance}
              onChange={handleInputChange}
              placeholder="Distance"
            />
            <Input
              type="number"
              name="price"
              value={editedDetails.price}
              onChange={handleInputChange}
              placeholder="Price"
            />
            <Textarea
              name="additionalInfo"
              value={editedDetails.additionalInfo}
              onChange={handleInputChange}
              placeholder="Additional information (e.g., stops, travel conditions)"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        const targetIndex = Math.round(info.offset.y / 100) + index;
        if (targetIndex !== index) {
          moveElement(index, Math.max(0, targetIndex));
        }
      }}
    >
      <div className={`flex items-center p-4 rounded-lg ${color} cursor-move`}>
        <TransportIcon className="h-6 w-6 mr-4" />
        {isEditing ? (
          <div className="flex-grow">
            {renderEditForm()}
            <div className="mt-2 flex justify-end space-x-2">
              <Button onClick={handleSave} variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <span className="flex-grow">{element.details.description}</span>
            <span className="ml-2 text-sm font-semibold">
              ${element.details.price}
            </span>
            {element.details.ticketPurchased && (
              <Tooltip>
                <TooltipTrigger>
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ticket Purchased</p>
                </TooltipContent>
              </Tooltip>
            )}
            {element.details.reservationConfirmed && (
              <Tooltip>
                <TooltipTrigger>
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reservation Confirmed</p>
                </TooltipContent>
              </Tooltip>
            )}
            <button onClick={handleEdit} className="ml-2">
              <Edit2 className="h-4 w-4 text-gray-600 hover:text-gray-800" />
            </button>
            <button onClick={handleRemove} className="ml-2">
              <Trash2 className="h-4 w-4 text-red-600 hover:text-red-800" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

const TripTimeline = ({
  elements,
  updateElement,
  removeElement,
  addElement,
  moveElement,
}: TripTimelineProps) => {
  return (
    <div className="relative mt-8 mb-12">
      <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-300"></div>
      <AnimatePresence>
        {elements.map((element, index) => (
          <motion.div
            key={element.id}
            className="relative flex items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`absolute left-5 w-3 h-3 rounded-full ${elementTypes[element.type].color.split(' ')[0]} border-2 border-white`}
            ></div>
            <div className="ml-12 w-full">
              <TripElement
                element={element}
                updateElement={updateElement}
                removeElement={removeElement}
                index={index}
                moveElement={moveElement}
              />
            </div>
            {index < elements.length - 1 && (
              <div className="absolute left-6 top-full h-8 w-0.5 bg-gray-300"></div>
            )}
            {index < elements.length - 1 && (
              <div className="absolute left-5 top-full mt-4 transform -translate-x-1/2">
                {elementTypes[elements[index + 1].type].connection ===
                'flight' ? (
                  <Plane className="h-4 w-4 text-blue-500" />
                ) : elementTypes[elements[index + 1].type].connection ===
                  'transport' ? (
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <button
        onClick={() => addElement(elements.length)}
        className="absolute left-6 bottom-0 transform -translate-x-1/2 bg-blue-500 rounded-full p-1 text-white hover:bg-blue-600 transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

const DestinationSearch = ({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex">
        <Input
          type="text"
          placeholder="Search destinations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" className="ml-2">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
};

interface AIRecommendationsProps {
  recommendations: {
    description: string;
    type: keyof typeof elementTypes;
    price: number;
  }[];
  onAddToItinerary: (recommendation: {
    description: string;
    type: keyof typeof elementTypes;
    price: number;
  }) => void;
}

const AIRecommendations = ({
  recommendations,
  onAddToItinerary,
}: AIRecommendationsProps) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{rec.description}</span>
              <Button onClick={() => onAddToItinerary(rec)} size="sm">
                Add to Itinerary
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const CollaborationPanel = ({
  onShare,
}: {
  onShare: (email: string) => void;
}) => {
  const [email, setEmail] = useState('');

  const handleShare = () => {
    onShare(email);
    setEmail('');
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Collaborate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            type="email"
            placeholder="Enter email to share"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const BookingPanel = ({ onBook }: { onBook: () => void }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onBook} className="w-full">
          <CreditCard className="h-4 w-4 mr-2" />
          Book and Pay
        </Button>
      </CardContent>
    </Card>
  );
};

interface TripPlaygroundProps {
  tripData: {
    duration: number;
    travelers: number;
    elements: ElementInterface[];
  };
  onTripUpdate: (updatedTrip: {
    duration: number;
    travelers: number;
    elements: ElementInterface[];
  }) => void;
  onSaveDraft: (tripData: {
    duration: number;
    travelers: number;
    elements: ElementInterface[];
  }) => void;
}

export function TripPlayground({
  tripData,
  onTripUpdate,
  onSaveDraft,
}: TripPlaygroundProps) {
  const [elements, setElements] = useState(tripData.elements);
  const [totalPrice, setTotalPrice] = useState(0);
  const [budget, setBudget] = useState(5000);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<
    { description: string; type: keyof typeof elementTypes; price: number }[]
  >([]);

  useEffect(() => {
    const newTotalPrice = elements.reduce(
      (sum, element) => sum + element.details.price,
      0,
    );
    setTotalPrice(newTotalPrice);
  }, [elements]);

  const addElement = (
    index: number | undefined,
    type: keyof typeof elementTypes = 'activity',
  ) => {
    const newElement: ElementInterface = {
      id: `element${elements.length + 1}`,
      type,
      details: { description: `New ${type}`, price: 0 },
    };
    const newElements = [
      ...elements.slice(0, index),
      newElement,
      ...elements.slice(index),
    ];
    setElements(newElements);
    onTripUpdate({ ...tripData, elements: newElements });
  };

  const updateElement = (
    id: string,
    newDetails: Partial<ElementInterface['details']>,
  ) => {
    const updatedElements = elements.map((element) =>
      element.id === id
        ? { ...element, details: { ...element.details, ...newDetails } }
        : element,
    );
    setElements(updatedElements);
    onTripUpdate({ ...tripData, elements: updatedElements });
  };

  const removeElement = (id: string) => {
    const updatedElements = elements.filter((element) => element.id !== id);
    setElements(updatedElements);
    onTripUpdate({ ...tripData, elements: updatedElements });
  };

  const moveElement = (fromIndex: number, toIndex: number) => {
    const newElements = [...elements];
    const [movedElement] = newElements.splice(fromIndex, 1);
    newElements.splice(toIndex, 0, movedElement);
    setElements(newElements);
    onTripUpdate({ ...tripData, elements: newElements });
  };

  const handleSaveDraft = () => {
    onSaveDraft({ ...tripData, elements });
  };

  const handleSearch = (query: SetStateAction<string>) => {
    setSearchQuery(query);
    // Simulating AI recommendations based on search
    const mockRecommendations: {
      description: string;
      type: keyof typeof elementTypes;
      price: number;
    }[] = [
      { description: 'Visit Tokyo Skytree', type: 'activity', price: 20 },
      { description: 'Explore Shibuya Crossing', type: 'activity', price: 0 },
      { description: 'Traditional Tea Ceremony', type: 'activity', price: 50 },
      {
        description: 'Day trip to Nikko National Park',
        type: 'activity',
        price: 100,
      },
      { description: 'Stay at Shinjuku Hotel', type: 'hotel', price: 150 },
    ];
    setAiRecommendations(mockRecommendations);
  };

  const handleAddToItinerary = (recommendation: {
    type: keyof typeof elementTypes;
    description: string;
    price: number;
  }) => {
    const newElement = {
      id: `element${elements.length + 1}`,
      type: recommendation.type,
      details: {
        description: recommendation.description,
        price: recommendation.price,
        isVerified: false,
      },
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    onTripUpdate({ ...tripData, elements: newElements });
  };

  const handleShare = (email: string) => {
    // Implement sharing logic here
    console.log(`Sharing itinerary with ${email}`);
  };

  const handleBook = () => {
    // Implement booking logic here
    console.log('Booking trip');
  };

  const filteredElements = elements.filter((element) =>
    element.details.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Placeaway Trip Playground
        </h1>
        <DestinationSearch onSearch={handleSearch} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TripTimeline
              elements={filteredElements}
              updateElement={updateElement}
              removeElement={removeElement}
              addElement={(index: number, type?: keyof typeof elementTypes) =>
                addElement(index, type)
              }
              moveElement={moveElement}
            />
          </div>
          <div className="space-y-8">
            <TripSummary
              duration={tripData.duration}
              travelers={tripData.travelers}
              totalPrice={totalPrice}
            />
            {/* <BudgetTracker
              budget={budget}
              setBudget={setBudget}
              totalPrice={totalPrice}
            /> */}
            <AIRecommendations
              recommendations={aiRecommendations}
              onAddToItinerary={handleAddToItinerary}
            />
            <CollaborationPanel onShare={handleShare} />
            <BookingPanel onBook={handleBook} />
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          <Button onClick={handleSaveDraft} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => setShowMap(!showMap)}>
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>
        {showMap && (
          <div className="mt-8 h-96">
            <MapWithNoSSR elements={elements} />
          </div>
        )}
      </div>
    </div>
  );
}
