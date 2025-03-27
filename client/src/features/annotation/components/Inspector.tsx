import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, TextField, Button, Slider, Checkbox, FormControlLabel, Divider } from '@mui/material';
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
    <Box display="flex" flexDirection="column" width={400} height="100%" bgcolor="grey.300" p={2}>
      <Box mb={2}>
        <Typography variant="h6">{t('annotation.archetype')}</Typography>
        <Divider />
        {!selectedArchetype ? (
          <Typography align="center" mt={2}>
            {t('annotation.select-archetype')}
          </Typography>
        ) : (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>{t('annotation.added-by')}</Typography>
              <Typography>{users.find(user => user._id === selectedArchetype.addedBy)?.displayName}</Typography>
            </Box>
            <TextField
              label={t('annotation.label')}
              fullWidth
              value={selectedArchetype.label}
              onChange={e => setSelectedArchetype({ ...selectedArchetype, label: e.target.value })}
              onBlur={() => updateArchetype(selectedArchetype.id, selectedArchetype.label, selectedArchetype.color)}
              margin="normal"
            />
            <TextField
              label={t('annotation.color')}
              type="color"
              fullWidth
              value={selectedArchetype.color}
              onChange={e => setSelectedArchetype({ ...selectedArchetype, color: e.target.value })}
              onBlur={() => updateArchetype(selectedArchetype.id, selectedArchetype.label, selectedArchetype.color)}
              margin="normal"
            />
          </Box>
        )}
      </Box>

      <Box bgcolor="grey.700" p={2} borderRadius={1}>
        <Typography variant="h6" color="white">{t('annotation.entity')}</Typography>
        <Divider sx={{ borderColor: 'white', my: 1 }} />
        {!selectedEntity ? (
          <Typography align="center" color="white" mt={2}>
            {t('annotation.select-entity')}
          </Typography>
        ) : (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="white">{t('annotation.added-by')}</Typography>
              <Typography color="white">{users.find(user => user._id === selectedEntity.addedBy)?.displayName}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="white">{t('annotation.faces')}</Typography>
              <Typography color="white">{selectedEntity.faces.length}</Typography>
            </Box>
            {selectedArchetype?.archetype === null ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEntityAsArchetype(selectedArchetype.id, selectedEntity.id)}
              >
                {t('annotation.set-archetype')}
              </Button>
            ) : (
              <>
                {selectedArchetype && (
                  <ArchetypeViewer
                    archetype={selectedArchetype}
                    selectedEntity={selectedArchetype.archetype !== selectedEntity.id ? selectedEntity : null}
                  />
                )}
                {selectedArchetype?.archetype === selectedEntity.id ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setEntityAsArchetype(selectedArchetype.id, null)}
                  >
                    {t('annotation.unset-archetype')}
                  </Button>
                ) : (
                  <>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography color="white" flex={1} textAlign="right" pr={2}>
                        {t('annotation.scale')}
                      </Typography>
                      <Slider
                        value={selectedEntity.scale}
                        min={0.1}
                        max={2}
                        step={0.05}
                        onChange={(e, value) => setSelectedEntity({ ...selectedEntity, scale: value as number })}
                        onChangeCommitted={() => {
                          if (selectedArchetypeId && selectedEntityId)
                            updateEntity(selectedArchetypeId, selectedEntityId, selectedEntity.scale, selectedEntity.orientation, selectedEntity.reflection);
                        }}
                        sx={{ flex: 2 }}
                      />
                      <Typography color="white" flex={1} textAlign="center">
                        {selectedEntity.scale.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography color="white" flex={1} textAlign="right" pr={2}>
                        {t('annotation.orientation')}
                      </Typography>
                      <Slider
                        value={selectedEntity.orientation}
                        min={-180}
                        max={180}
                        step={0.5}
                        onChange={(e, value) => setSelectedEntity({ ...selectedEntity, orientation: value as number })}
                        onChangeCommitted={() => {
                          if (selectedArchetypeId && selectedEntityId)
                            updateEntity(selectedArchetypeId, selectedEntityId, selectedEntity.scale, selectedEntity.orientation, selectedEntity.reflection);
                        }}
                        sx={{ flex: 2 }}
                      />
                      <Typography color="white" flex={1} textAlign="center">
                        {selectedEntity.orientation.toFixed(2)}
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedEntity.reflection}
                          onChange={e => {
                            const value = e.target.checked;
                            setSelectedEntity({ ...selectedEntity, reflection: value });
                            if (selectedArchetypeId && selectedEntityId)
                              updateEntity(selectedArchetypeId, selectedEntityId, selectedEntity.scale, selectedEntity.orientation, value);
                          }}
                          sx={{ color: 'white' }}
                        />
                      }
                      label={<Typography color="white">{t('annotation.reflected')}</Typography>}
                    />
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => {
                        setSelectedEntity({ ...selectedEntity, scale: 1, orientation: 0, reflection: false });
                        if (selectedArchetypeId && selectedEntityId)
                          updateEntity(selectedArchetypeId, selectedEntityId, 1, 0, false);
                      }}
                    >
                      {t('annotation.reset')}
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
