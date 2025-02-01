import { useAppSelector } from '../../hooks/useAppSelector'
import { ChatArea } from './ChatArea/Entry'


import { EmptyState } from './EmptyState'

export const DashboardInterface = () => {
    const {selectedRelationship} = useAppSelector((state) => state.app)
  return (
    <div>
        {
            selectedRelationship ?
            <ChatArea/>
            : <EmptyState
            hasRelationships={false}
            onAddRelationship={() => {}}
        />
        }
    </div>
  )
}
