import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
        <h4>
          {t('annotation.archetype')}
        </h4>
        {
          !selectedArchetype ? <p className='center-text'>
            {t('annotation.select-archetype')}
          </p> :
            <div className='flex flex-col items-center px-2'>
              <span className='flex justify-between w-full'>
                <p>Added By</p>
                <p>{users.find(user => user._id === selectedArchetype.addedBy)?.displayName}</p>
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
        <h4>
          {t('annotation.entity')}
        </h4>
        {
          !selectedEntity ? <p className='center-text'>
            {t('annotation.select-entity')}
          </p> :
            <div className='flex flex-col items-center px-2'>
              <span className='flex justify-between w-full'>
                <p>
                  {t('annotation.added-by')}
                </p>
                <p>{users.find(user => user._id === selectedEntity.addedBy)?.displayName}</p>
              </span>
              <span className='flex justify-between w-full'>
                <p>
                  {t('annotation.faces')}
                </p>
                <p>{selectedEntity.faces.length}</p>
              </span>
              { selectedArchetype?.archetype === null ? 
                <button onClick={() => setEntityAsArchetype(selectedArchetype.id, selectedEntity.id)}>
                  {t('annotation.set-archetype')}
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
                        {t('annotation.unset-archetype')}
                      </button>
                      : <>
                        <span className='flex justify-evenly w-full'>
                          <div className='w-full text-right pr-4'>
                            {t('annotation.scale')}
                          </div>
                          <div className='w-full'>
                            <input 
                              type='range'
                              min={0.1}
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
                          </div>
                          <div className='w-full text-center'>
                            {selectedEntity.scale.toFixed(2)}
                          </div>
                        </span>
                        <span className='flex justify-between w-full'>
                          <div className='w-full text-right pr-4'>
                            {t('annotation.orientation')}
                          </div>
                          <div className='w-full'>
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
                          </div>
                          <div className='w-full text-center'>
                            {selectedEntity.orientation.toFixed(2)}
                          </div>
                        </span>
                        <span className='flex justify-evenly w-full'>
                          <div className='w-full text-right pr-4'>
                            {t('annotation.reflected')}
                          </div>
                          <div className='w-full justify-center'>
                            <input 
                              className='w-full'
                              type='checkbox' 
                              checked={selectedEntity.reflection} 
                              onChange={e => {
                                const value = e.target.checked;
                                setSelectedEntity({ ...selectedEntity, reflection: value });
                                if (selectedArchetypeId && selectedEntityId)
                                  updateEntity(selectedArchetypeId, selectedEntityId, selectedEntity.scale, selectedEntity.orientation, value);
                              }}
                            />
                          </div>
                          <div className='w-full' />
                        </span>
                        <button 
                          onClick={() => {
                            setSelectedEntity({ ...selectedEntity, scale: 1, orientation: 0, reflection: false });
                            if (selectedArchetypeId && selectedEntityId)
                              updateEntity(selectedArchetypeId, selectedEntityId, 1, 0, false);
                          }}>
                          {t('annotation.reset')}
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
