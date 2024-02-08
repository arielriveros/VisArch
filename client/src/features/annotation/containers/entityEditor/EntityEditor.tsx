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


interface EntityEditorProps {
    orientation: number;
    scale: number;
    reflection: boolean;
}

export default function EntityEditor() {

    const { task, selectedArchetype, selectedEntity, dispatch } = useTaskContext();
    const DISPATCH = useTaskDispatcher();
    const [label, setLabel] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [properties, setProperties] = useState<EntityEditorProps>({orientation: 0, scale: 1, reflection: false});

    useEffect(() => {
        if (!selectedArchetype) return;
        setLabel(selectedArchetype.label);
        setColor(selectedArchetype.color);
    }, [selectedArchetype]);

    useEffect(() => {
        if (!selectedEntity) return;
        setProperties({
            orientation: selectedEntity.orientation,
            scale: selectedEntity.scale,
            reflection: selectedEntity.reflection
        });
    }, [selectedEntity]);


    const onSave = () => {
        if (!selectedArchetype) return;
        dispatch({ type: 'UPDATE_SELECTED_PATTERN_ARCHETYPE', payload: {color}});
        DISPATCH.UPDATE_PATTERN_ARCHETYPE_LABEL(selectedArchetype.nameId, label, true);

		if (!selectedEntity) return;
		DISPATCH.UPDATE_PATTERN_ENTITY_PROPERTIES(selectedArchetype.nameId, selectedEntity.nameId, properties, true);
	}

    const onArchetypeDelete = () => {
        if (!selectedArchetype) return;
        DISPATCH.REMOVE_PATTERN_ARCHETYPE(selectedArchetype.nameId, true);
    }

	const onEntityDelete = () => {
		if (!selectedEntity || !selectedArchetype) return;
		DISPATCH.REMOVE_PATTERN_ENTITY(selectedArchetype.nameId, selectedEntity.nameId, true);
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
                        <ColorInput label='Color' targetName={'color'} value={color} handleInput={e=>setColor(e.target.value)}/>
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
                            <div className='entity-editor'>
                                <RangeInput
                                    label='Orientation'
                                    targetName={'orientation'}
                                    min={0}
                                    max={360}
                                    step={0.1}
                                    value={properties.orientation}
                                    handleInput={e => setProperties({...properties, orientation: parseInt(e.target.value)})}
                                    mouseUp={()=>console.log("UP")}
                                />
                                <RangeInput
                                    label='Scale'
                                    targetName={'scale'}
                                    min={0}
                                    max={1.5}
                                    step={0.01}
                                    value={properties.scale}
                                    handleInput={e => setProperties({...properties, scale: parseFloat(e.target.value)})}
                                />
                                <CheckboxInput  
                                    label='Reflection'
                                    targetName={'reflection'}
                                    value={properties.reflection}
                                    handleInput={e => setProperties({...properties, reflection: e.target.checked})}
                                />
                            </div>
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
