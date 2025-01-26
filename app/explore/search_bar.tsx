'use client';
import { useEffect, useState } from 'react';
import autocomplete from '@/lib/google';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';

const Search_bar = () => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (input.trim() === '') {
        setPredictions([]);
        return;
      }
      const predictions = await autocomplete(input);
      setPredictions(predictions || []);
    };
    fetchPredictions();
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() !== '') {
      router.push(`/booking/${encodeURIComponent(input)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <Command className="rounded-lg border shadow-md bg-white">
        <CommandInput
          value={input}
          onValueChange={setInput}
          placeholder="Where do you want to go?"
          className="w-full p-4 text-lg focus:outline-none placeholder-gray-500"
        />
        <CommandList className="max-h-60 overflow-y-auto">
          {predictions.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup heading="Suggestions">
              {predictions.map((prediction) => (
                <CommandItem
                  key={prediction.place_id}
                  onSelect={() => {
                    setInput(prediction.description);
                    router.push(
                      `/booking/${encodeURIComponent(prediction.description)}`,
                    );
                  }}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                >
                  {prediction.description}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
        </CommandList>
      </Command>
    </form>
  );
};

export default Search_bar;
