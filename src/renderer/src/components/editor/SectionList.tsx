import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Section } from '../../pages/ProposalEditor'

interface SortableItemProps {
  section: Section
  isActive: boolean
  onClick: () => void
}

function SortableItem({ section, isActive, onClick }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const Icon = section.Icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all select-none ${
        isDragging ? 'opacity-40 shadow-lg' : ''
      } ${
        isActive
          ? 'bg-indigo-50 border border-indigo-200'
          : 'hover:bg-slate-100 border border-transparent'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100"
        title="Drag to reorder"
      >
        <GripVertical size={13} />
      </button>
      <Icon
        size={14}
        strokeWidth={1.75}
        className={isActive ? 'text-indigo-500 shrink-0' : 'text-slate-400 shrink-0'}
      />
      <span
        className={`text-sm truncate ${
          isActive ? 'text-indigo-700 font-medium' : 'text-slate-600'
        }`}
      >
        {section.title}
      </span>
    </div>
  )
}

interface SectionListProps {
  sections: Section[]
  activeSectionId: string
  onSectionClick: (id: string) => void
  onReorder: (sections: Section[]) => void
}

export default function SectionList({
  sections,
  activeSectionId,
  onSectionClick,
  onReorder,
}: SectionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id)
      const newIndex = sections.findIndex((s) => s.id === over.id)
      onReorder(arrayMove(sections, oldIndex, newIndex))
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <SortableItem
                key={section.id}
                section={section}
                isActive={section.id === activeSectionId}
                onClick={() => onSectionClick(section.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className="p-3 border-t border-slate-100 shrink-0">
        <p className="text-xs text-slate-400 text-center">Drag to reorder</p>
      </div>
    </>
  )
}
