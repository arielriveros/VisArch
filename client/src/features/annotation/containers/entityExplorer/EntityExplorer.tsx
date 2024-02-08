import Button from 'common/components/button/Button';
import Sidebar from 'common/components/sidebar/Sidebar';
import ArchetypesList from 'features/annotation/components/archetypesList/ArchetypesList';
import EntitiesList from 'features/annotation/components/entitiesList/EntitiesList';
import { useTaskContext } from 'features/annotation/hooks/useTask';
import { useAuthContext } from 'features/authentication/hooks/useAuthContext';
import useTaskDispatcher from 'features/taskDispatcher';
import './EntityExplorer.css';
import Collapsable from 'common/components/collapsable/Collapsable';

export default function EntityExplorer() {
    const { user } = useAuthContext();
    const { task, uploadTask } = useTaskContext();
    const { ADD_PATTERN_ARCHETYPE } = useTaskDispatcher();

    return (
        <Sidebar width='300px' position='left'>
            <div>
                <Button text='Add Archetype' class='small' onClick={()=>ADD_PATTERN_ARCHETYPE(null, true)} />
                <Button text='Save' class='small' onClick={()=>{if (task && user) uploadTask(task, user.token); }}/>
            </div>
            <Collapsable title='Archatypes'>
                <ArchetypesList />
            </Collapsable>
            <Collapsable title='Entities'>
                <EntitiesList />
            </Collapsable>
        </Sidebar>
    )
}
