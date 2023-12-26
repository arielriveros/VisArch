import Button from 'common/components/button/Button';
import Sidebar from 'common/components/sidebar/Sidebar';
import ArchetypesList from 'features/annotation/components/archetypesList/ArchetypesList';
import EntitiesList from 'features/annotation/components/entitiesList/EntitiesList';
import { useTaskContext } from 'features/annotation/hooks/useTask';
import { useAuthContext } from 'features/authentication/hooks/useAuthContext';
import useTaskDispatcher from 'features/taskDispatcher';
import './AnnotationSidebar.css';

export default function AnnotationSidebar() {
    const { user } = useAuthContext();
    const { task, uploadTask } = useTaskContext();
    const { ADD_PATTERN_ARCHETYPE } = useTaskDispatcher();

    return (
        <Sidebar width='350px'>
            <div>
                <Button text='Add Archetype' class='small' onClick={()=>ADD_PATTERN_ARCHETYPE(null, true)} />
                <Button text='Save' class='small' onClick={()=>{if (task && user) uploadTask(task, user.token); }}/>
            </div>
            <div className='list-container'>
                <b>Archetypes</b>
                <ArchetypesList />
            </div>
            <div className='list-container'>
                <b>Entities</b>
                <EntitiesList />
            </div>
        </Sidebar>
    )
}
