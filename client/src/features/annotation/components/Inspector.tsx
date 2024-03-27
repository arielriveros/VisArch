import { useEffect, useState } from 'react';
import { Archetype, Entity } from '@/api/types';
import useAnnotation from '../hooks/useAnnotation';
import ArchetypeViewer from './ArchetypeViewer';

export default function Inspector() {
  const {
    annotations, users,
    selectedArchetype: selectedArchetypeId,
    selectedEntity: selectedEntityId,
    updateArchetype, updateEntity, setEntityAsArchetype
  } = useAnnotation();
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  useEffect(() => {
    setSelectedArchetype(annotations.find(archetype => archetype.id === selectedArchetypeId) || null);
  }, [selectedArchetypeId, annotations]);

  useEffect(() => {
    if (selectedArchetypeId && selectedEntityId) {
      const archetype = annotations.find(archetype => archetype.id === selectedArchetypeId);
      const entity = archetype?.entities.find(entity => entity.id === selectedEntityId);
      setSelectedEntity(entity || null);
      return;
    }
    
    setSelectedEntity(null);
  }, [selectedArchetypeId, selectedEntityId, annotations]);
  return (
    <div className='flex flex-col w-full h-full p-1 bg-gray-800'>
      <section className='flex flex-col overflow-y-auto mb-2 bg-gray-700'>
        <h4>Archetype</h4>
        {
          !selectedArchetype ? <p className='center-text'>Select an Archetype</p> :
            <div className='flex flex-col items-center px-2'>
              <span className='flex justify-between w-full'>
                <p>Added By</p>
                <p>{users.find(user => user._id === selectedArchetype.addedBy)?.name}</p>
              </span>
              <span className='flex justify-between w-full'>
                <p>Label</p>
                <input 
                  type='text' 
                  className='text-black'
                  value={selectedArchetype.label} 
                  onChange={e => {
                    const value = e.target.value;
                    setSelectedArchetype({ ...selectedArchetype, label: value });
                  }}
                  onBlur={() => {
                    updateArchetype(selectedArchetype.id, selectedArchetype.label, selectedArchetype.color);
                  }}
                />
              </span>
              <span className='flex justify-between w-full'>
                <p>Color</p>
                <input 
                  type='color' 
                  value={selectedArchetype.color} 
                  onChange={e => {
                    const value = e.target.value;
                    setSelectedArchetype({ ...selectedArchetype, color: value });
                  }}
                  onBlur={() => {
                    updateArchetype(selectedArchetype.id, selectedArchetype.label, selectedArchetype.color);
                  }}
                />
              </span>
            </div>
        }
      </section>
      <section className='flex flex-col overflow-y-auto mb-2 bg-gray-700'>
        <h4>Entity</h4>
        {
          !selectedEntity ? <p className='center-text'>Select an Entity</p> :
            <div className='flex flex-col items-center px-2'>
              <span className='flex justify-between w-full'>
                <p>Added By</p>
                <p>{users.find(user => user._id === selectedEntity.addedBy)?.name}</p>
              </span>
              <span className='flex justify-between w-full'>
                <p>Faces</p>
                <p>{selectedEntity.faces.length}</p>
              </span>
              { selectedArchetype?.archetype === null ? 
                <button onClick={() => setEntityAsArchetype(selectedArchetype.id, selectedEntity.id)}>
                  Set as Archetype
                </button> :
                <>
                  {selectedArchetype && 
                    <ArchetypeViewer 
                      archetype={selectedArchetype}
                      selectedEntity={selectedArchetype.archetype !== selectedEntity.id ? selectedEntity : null}
                    />}
                  {
                    selectedArchetype?.archetype === selectedEntity.id ?
                      <button onClick={() => setEntityAsArchetype(selectedArchetype.id, null)}>
                        Unset as Archetype
                      </button>
                      : <>
                        <span className='flex justify-between w-full'>
                          <p>Scale</p>
                          <input 
                            type='range'
                            min={0}
                            max={2}
                            step={0.05}
                            value={selectedEntity.scale} 
                            onChange={e => {
                              const value = parseFloat(e.target.value);
                              setSelectedEntity({ ...selectedEntity, scale: value });
                            }}
                            onMouseUp={() => {
                              if (selectedArchetypeId && selectedEntityId)
                                updateEntity(selectedArchetypeId, selectedEntityId, selectedEntity.scale, selectedEntity.orientation, selectedEntity.reflection);
                            }}
                          />
                        </span>
                        <span className='flex justify-between w-full'>
                          <p>Orientation</p>
                          <input 
                            type='range'
                            min={-180}
                            max={180}
                            step={0.5}

                            value={selectedEntity.orientation} 
                            onChange={e => {
                              const value = parseFloat(e.target.value);
                              setSelectedEntity({ ...selectedEntity, orientation: value });
                            }}
                            onMouseUp={() => {
                              if (selectedArchetypeId && selectedEntityId)
                                updateEntity(selectedArchetypeId, selectedEntityId, selectedEntity.scale, selectedEntity.orientation, selectedEntity.reflection);
                            }}
                          />
                        </span>
                        <span className='flex justify-between w-full'>
                          <p>Reflection</p>
                          <input 
                            type='checkbox' 
                            checked={selectedEntity.reflection} 
                            onChange={e => {
                              const value = e.target.checked;
                              setSelectedEntity({ ...selectedEntity, reflection: value });
                              if (selectedArchetypeId && selectedEntityId)
                                updateEntity(selectedArchetypeId, selectedEntityId, selectedEntity.scale, selectedEntity.orientation, value);
                            }}
                          />
                        </span>
                        <button 
                          onClick={() => {
                            setSelectedEntity({ ...selectedEntity, scale: 1, orientation: 0, reflection: false });
                            if (selectedArchetypeId && selectedEntityId)
                              updateEntity(selectedArchetypeId, selectedEntityId, 1, 0, false);
                          }}>
                            Reset
                        </button>
                      </>
                  }
                </>
              }
            </div>
        }
      </section>
    </div>
  );
}
