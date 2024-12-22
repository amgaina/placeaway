import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UserGeneratedContent() {
 const userContent = [
   { 
     id: 1, 
     user: 'TravelLover123', 
     destination: 'Barcelona', 
     content: 'The Sagrada Familia is a must-see! Book tickets in advance to avoid long queues. The architecture is simply breathtaking.', 
     rating: 5 
   },
   { 
     id: 2, 
     user: 'AdventureSeeker', 
     destination: 'Bali', 
     content: 'Don\'t miss the sunrise trek to Mount Batur. It\'s challenging but the view from the top is absolutely worth it!', 
     rating: 4 
   },
   { 
     id: 3, 
     user: 'CultureExplorer', 
     destination: 'Istanbul', 
     content: 'The Grand Bazaar is a shopper\'s paradise. Bring your bargaining skills and be prepared to get lost in the maze of shops!', 
     rating: 5 
   },
 ]

 return (
   <div className="py-12 bg-primary/5">
     <div className="container mx-auto px-4">
       <h2 className="text-3xl font-bold mb-6 text-center text-primary">Traveler Insights</h2>
       <div className="grid gap-6 md:grid-cols-3">
         {userContent.map((content) => (
           <Card key={content.id}>
             <CardHeader>
               <CardTitle className="flex justify-between items-center">
                 <span className="text-primary">{content.user}</span>
                 <span className="text-amber-500">{'\u2605'.repeat(content.rating)}</span>
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground mb-3 italic">&ldquo;{content.content}&rdquo;</p>
               <p className="text-sm text-muted-foreground">Destination: {content.destination}</p>
             </CardContent>
           </Card>
         ))}
       </div>
       <div className="mt-8 text-center">
         <Button variant="default" size="lg">
           Share Your Experience
         </Button>
       </div>
     </div>
   </div>
 )
}

