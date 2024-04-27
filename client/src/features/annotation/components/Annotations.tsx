import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Archetype } from '@/api/types';
import useAnnotation from '../hooks/useAnnotation';
import Emitter from '../utils/emitter';
import DeleteIcon from '@/assets/icons/delete.png';
import '../styles/Annotations.css';

export default function Annotations() {
  const { annotations, selectedArchetype: selectedArchetypeId, selectedEntity, addArchetype, removeArchetype, selectArchetype, removeEntity, selectEntity } = useAnnotation();
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedArchetypeId) {
      const archetype = annotations.find(archetype => archetype.id === selectedArchetypeId);
      setSelectedArchetype(archetype || null);
    }
  }, [selectedArchetypeId, annotations]);

  return (
    <div className='flex flex-col w-full h-full p-1 bg-gray-800'>
      <section className='flex flex-col overflow-y-auto mb-2 bg-gray-700'>
        <h4>
          {t('annotation.archetypes')}
        </h4>
        {annotations?.map(archetype => (
          <div 
            key={archetype.id}
            onClick={() => selectArchetype(archetype.id)}
            onMouseEnter={() => 
              Emitter.emit('HIGHLIGHT_FACES', archetype.entities.map(entity => entity.faces).flat())
            }
            onMouseLeave={() => Emitter.emit('HIGHLIGHT_FACES', [])}
            className={`annotation-item ${selectedArchetypeId === archetype.id ? 'selected' : ''}`}
          >
            <span>{archetype.label}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Stop event propagation
                if (archetype.entities.length > 0) {
                  const res = confirm('Archetype contains entities. Remove?');
                  if (!res) return;
                  else {
                    Emitter.emit('HIGHLIGHT_FACES', []);
                    removeArchetype(archetype.id);
                  }
                }
                else {
                  Emitter.emit('HIGHLIGHT_FACES', []);
                  removeArchetype(archetype.id);
                }
              }}>
              <img src={DeleteIcon} style={{ width: '15px', height: '15px' }} alt='delete' />
            </button>
          </div>
        ))}
        <button onClick={addArchetype}>
          {t('annotation.add-archetype')}
        </button>
      </section>
      <section className='flex flex-col overflow-y-auto mb-2 pl-1 bg-gray-700'>
        <h4>
          {t('annotation.entities')}
        </h4>
        { !selectedArchetype ? <p className='center-text'>
          {t('annotation.select-archetype')}
        </p> :
          selectedArchetype?.entities.map(entity => (
            <div
              key={entity.id}
              onClick={() => selectEntity(selectedArchetype.id, entity.id)}
              onMouseEnter={() => Emitter.emit('HIGHLIGHT_FACES', entity.faces) }
              onMouseLeave={() => Emitter.emit('HIGHLIGHT_FACES', [])}
              className={`annotation-item ${selectedEntity === entity.id ? 'selected' : ''}`} 
            >
              <span>
                { selectedArchetype.archetype === entity.id ? t('annotation.archetype') : t('annotation.entity') }
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  Emitter.emit('HIGHLIGHT_FACES', []);
                  removeEntity(selectedArchetype.id, entity.id);
                }}>
                <img src={DeleteIcon} style={{ width: '15px', height: '15px' }} alt='delete' />
              </button>
            </div>
          ))
        }
        
      </section>
    </div>
  );
}
