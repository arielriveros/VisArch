import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Archetype } from '@/api/types';
import useAnnotation from '../hooks/useAnnotation';
import Emitter from '../utils/emitter';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
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
    <Box display='flex' flexDirection='column' width={300}>
      <Box flex='1' overflow='auto' bgcolor='grey.700' p={2}>
        <Typography variant='h6'>
          {t('annotation.archetypes')}
        </Typography>
        <List>
          {annotations?.map((archetype) => (
            <ListItem
              key={archetype.id}
              disablePadding
              onMouseEnter={() =>
                Emitter.emit('HIGHLIGHT_FACES', archetype.entities.map((entity) => entity.faces).flat())
              }
              onMouseLeave={() => Emitter.emit('HIGHLIGHT_FACES', [])}
            >
              <ListItemButton
                selected={selectedArchetypeId === archetype.id}
                onClick={() => selectArchetype(archetype.id)}
              >
                <ListItemText primary={archetype.label} />
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
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button variant='contained' color='primary' onClick={addArchetype} fullWidth>
          {t('annotation.add-archetype')}
        </Button>
      </Box>
      <Divider />
      <Box flex='1' overflow='auto' pl={1} bgcolor='grey.700' p={2}>
        <Typography variant='h6'>
          {t('annotation.entities')}
        </Typography>
        {!selectedArchetype ? (
          <Typography align='center'>{t('annotation.select-archetype')}</Typography>
        ) : (
          <List>
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
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
