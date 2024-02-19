import { useEffect, useState } from "react";
import { useTaskContext } from "features/annotation/hooks/useTask";
import Sidebar from "common/components/sidebar/Sidebar";
import TextInput from "common/components/input/TextInput";
import AnnotationViewer from "../annotation/viewer/AnnotationViewer";
import ColorInput from "common/components/input/ColorInput";
import Button from "common/components/button/Button";
import useTaskDispatcher from "features/taskDispatcher";
import RangeInput from "common/components/input/RangeInput";
import CheckboxInput from "common/components/input/CheckboxInput";
import './EntityEditor.css';
import Collapsable from "common/components/collapsable/Collapsable";
import EntityPropertiesEditor from "./EntityPropertiesEditor";




export default function EntityEditor() {

    const { task, selectedArchetype, selectedEntity, dispatch } = useTaskContext();
    const DISPATCH = useTaskDispatcher();
    const [label, setLabel] = useState<string>('');
    const [color, setColor] = useState<string>('');

    useEffect(() => {
        if (!selectedArchetype) return;
        setLabel(selectedArchetype.label);
        setColor(selectedArchetype.color);
    }, [selectedArchetype]);


    const onSave = () => {
        if (!selectedArchetype) return;
        
        DISPATCH.UPDATE_PATTERN_ARCHETYPE_LABEL(selectedArchetype.nameId, label, true);
	}

    const onArchetypeDelete = () => {
        if (!selectedArchetype) return;
        DISPATCH.REMOVE_PATTERN_ARCHETYPE(selectedArchetype.nameId, true);
    }

	const onEntityDelete = () => {
		if (!selectedEntity || !selectedArchetype) return;
		DISPATCH.REMOVE_PATTERN_ENTITY(selectedArchetype.nameId, selectedEntity.nameId, true);
	}

    const handleColorChange = (color: string) => {
        if (!selectedArchetype) return;
        console.log(color);
        dispatch({ type: 'UPDATE_SELECTED_PATTERN_ARCHETYPE', payload: {color}});
    }

    return (
        <Sidebar width='20vw' position='right'>
            {task?.class === 'object' &&
                <Collapsable title='Preview'>
                    <AnnotationViewer />
                </Collapsable>
            }
            <Collapsable title='Archetype'>
                { selectedArchetype ?
                    <div>
                        <TextInput 
                            label='Label'
                            targetName={'label'}
                            type='text'
                            value={label}
                            text={selectedArchetype.label}
                            handleInput={e => setLabel(e.target.value)}
                        />
                        <ColorInput label='Color' targetName={'color'} value={color} handleInput={e=>setColor(e.target.value)} onColorSelected={color => handleColorChange(color)}/>
                        <Button text='Delete' class='small' onClick={onArchetypeDelete}/>
                    </div>
                    :
                    <div>No archetype selected</div> }
            </Collapsable>
            <Collapsable title='Entity'>
            { selectedEntity ?
                    <div>
                        {selectedEntity.isArchetype ?
                            <div>
                                Archetype
                            </div>
                            : 
                            <EntityPropertiesEditor />
                        }
                        <Button text='Delete' class='small' onClick={onEntityDelete}/>
                        
                    </div>
                    : <div>No entity selected</div>
                }
            </Collapsable>
            {/* Delete later:  */}
            <Button text='Save' class='small' onClick={onSave}/>
        </Sidebar>
    )
}
