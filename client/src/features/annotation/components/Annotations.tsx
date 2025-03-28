import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Archetype } from '@/api/types';
import useAnnotation from '../hooks/useAnnotation';
import Emitter from '../utils/emitter';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';

export default function Annotations() {
  const {
    annotations,
    selectedArchetype: selectedArchetypeId,
    selectedEntity,
    addArchetype,
    removeArchetype,
    selectArchetype,
    removeEntity,
    selectEntity,
  } = useAnnotation();
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedArchetypeId) {
      const archetype = annotations.find((archetype) => archetype.id === selectedArchetypeId);
      setSelectedArchetype(archetype || null);
    }
  }, [selectedArchetypeId, annotations]);

  return (
    <Box display='flex' flexDirection='column' width={400} height='100%' bgcolor='grey.300' p={2}>
      <Button variant='contained' color='primary' onClick={addArchetype} fullWidth>
        {t('annotation.add-archetype')}
      </Button>
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
        {annotations?.map((archetype) => (
          <Accordion
            slotProps={{ transition: { unmountOnExit: true } }}
            key={archetype.id}
            // TODO: Highlight faces on mouse enter performance issue
            /* onMouseEnter={() => 
              Emitter.emit('HIGHLIGHT_FACES', archetype.entities.map((entity) => entity.faces).flat())
            } 
            onMouseLeave={() => Emitter.emit('HIGHLIGHT_FACES', [])}
            */
            expanded={selectedArchetypeId === archetype.id}
            
          >
            <AccordionSummary 
              onClick={() => selectArchetype(archetype.id)}
            >
              <ListItemText primary={archetype.label} />
              { selectedArchetypeId === archetype.id && (
                <IconButton
                  edge='end'
                  onClick={(e) => {
                    e.stopPropagation();
                    if (archetype.entities.length > 0) {
                      const res = confirm('Archetype contains entities. Remove?');
                      if (!res) return;
                    }
                    Emitter.emit('HIGHLIGHT_FACES', []);
                    removeArchetype(archetype.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </AccordionSummary>
            { selectedArchetype?.entities.length === 0 ? 
              <Typography align='center' mt={2}>
                {t('annotation.select-entity')}
              </Typography>
              :
              <AccordionDetails>
                {selectedArchetype &&
                <List dense>
                  {selectedArchetype.entities.map((entity) => (
                    <ListItem
                      key={entity.id}
                      disablePadding
                      onMouseEnter={() => Emitter.emit('HIGHLIGHT_FACES', entity.faces)}
                      onMouseLeave={() => Emitter.emit('HIGHLIGHT_FACES', [])}
                    >
                      <ListItemButton
                        selected={selectedEntity === entity.id}
                        onClick={() => selectEntity(selectedArchetype.id, entity.id)}
                      >
                        <ListItemText
                          primary={
                            selectedArchetype.archetype === entity.id
                              ? t('annotation.archetype')
                              : t('annotation.entity')
                          }
                        />
                        {selectedEntity === entity.id && (
                          <IconButton
                            edge='end'
                            onClick={(e) => {
                              e.stopPropagation();
                              Emitter.emit('HIGHLIGHT_FACES', []);
                              removeEntity(selectedArchetype.id, entity.id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton> 
                        )}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                }
              </AccordionDetails>
            }
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}
