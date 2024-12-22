import { Edit2, Trash2 } from 'lucide-react'

export interface Draft {
  id: string
  name: string
  destinations: string[]
  duration: number
  travelers: number
}

interface DraftListProps {
  drafts: Draft[]
  onContinueDraft: (draftId: string) => void
  onDeleteDraft: (draftId: string) => void
}



export function DraftList({ drafts, onContinueDraft, onDeleteDraft }:DraftListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {drafts.map((draft) => (
        <div key={draft.id} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">{draft.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {draft.destinations.join(', ')}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {draft.duration} days, {draft.travelers} travelers
          </p>
          <div className="flex justify-between">
            <button
              onClick={() => onContinueDraft(draft.id)}
              className="flex items-center text-sky-600 hover:text-sky-800"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Continue
            </button>
            <button
              onClick={() => onDeleteDraft(draft.id)}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

