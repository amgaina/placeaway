import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import {
  TripPreferenceInput,
  TripPreferenceSchema,
  TripWithPreferencesAndBudgetAndTripRecommendation,
} from '@/schemas/trip';
import { z } from 'zod';

const interests = [
  'Art & Culture',
  'Food & Dining',
  'Nature & Outdoors',
  'Shopping',
  'History',
  'Adventure',
  'Relaxation',
  'Nightlife',
] as const;

interface PreferencesFormProps {
  defaultValues?: TripWithPreferencesAndBudgetAndTripRecommendation;
  onSubmit: (values: TripPreferenceInput) => Promise<void>;
  onCancel: () => void;
}

export function PreferencesForm({
  defaultValues,
  onSubmit,
  onCancel,
}: PreferencesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TripPreferenceInput>({
    resolver: zodResolver(TripPreferenceSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      startDate: defaultValues?.startDate || new Date(),
      endDate:
        defaultValues?.endDate ||
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      preferences: {
        destination: defaultValues?.title || '',
        visitorCount: defaultValues?.preferences?.visitorCount || 1,
        interests: defaultValues?.preferences?.interests || [],
        hasChildren: defaultValues?.preferences?.hasChildren || false,
        hasPets: defaultValues?.preferences?.hasPets || false,
        origin: defaultValues?.preferences?.origin || '',
      },
    },
  });

  async function handleSubmit(values: TripPreferenceInput) {
    setIsSubmitting(true);
    try {
      const transformedValues: z.infer<typeof TripPreferenceSchema> = {
        title: values.title,
        startDate: values.startDate?.valueOf() ? values.startDate : undefined,
        endDate: values.endDate?.valueOf() ? values.endDate : undefined,
        preferences: {
          visitorCount: values.preferences.visitorCount,
          hasPets: values.preferences.hasPets,
          hasChildren: values.preferences.hasChildren,
          interests: values.preferences.interests,
          destination: values.preferences.destination,
          origin: values.preferences.origin,
        },
      };
      await onSubmit(transformedValues);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trip Title</FormLabel>
              <FormControl>
                <Input placeholder="Summer Vacation 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > new Date(2025, 0, 1)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferences.visitorCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Visitors</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="preferences.hasChildren"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Traveling with Children</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferences.interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interests</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2">
                    {interests.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={
                          field.value.includes(interest) ? 'default' : 'outline'
                        }
                        onClick={() => {
                          const updated = field.value.includes(interest)
                            ? field.value.filter((i) => i !== interest)
                            : [...field.value, interest];
                          field.onChange(updated);
                        }}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
