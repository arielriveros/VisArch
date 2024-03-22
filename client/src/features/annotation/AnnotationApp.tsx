import { useParams } from 'react-router-dom';
import Toolbar from './components/Toolbar';
import Manager from './components/Manager';
import ModelContextProvider from './contexts/ModelContext';
import ConfigContextProvider from './contexts/ConfigContext';
import AnnotationContextProvider from './contexts/AnnotationContext';

export default function AnnotationApp() {
  const { taskId } = useParams<{ taskId: string }>();

  return (
    <main>
      <ConfigContextProvider>
        <ModelContextProvider>
          <Toolbar />
          <AnnotationContextProvider>
            <Manager taskId={taskId} key={taskId}/>
          </AnnotationContextProvider>
        </ModelContextProvider>
      </ConfigContextProvider>
    </main>
  );
}
