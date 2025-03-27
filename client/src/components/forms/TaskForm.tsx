import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import MeshInput from '@/components/mesh-input/MeshInput';

interface TaskFormProps {
  task: {
    name: string;
    description: string;
    mesh: File | null;
    thumbnail: File | null;
  };
  setTask: (task: {
    name: string;
    description: string;
    mesh: File | null;
    thumbnail: File | null;
  }) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function TaskForm(props: TaskFormProps) {
  const { task, setTask, handleSubmit } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmitConfirm = (e: FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleMesh = (glbFile: File, screenshot: File) => {
    setTask({ ...task, mesh: glbFile, thumbnail: screenshot });
  };

  return (
    <section className='form-container'>
      <div className='form-title'>
        <h2>{t('tasks.create-task')}</h2>
      </div>
      <form className='form'>
        <label htmlFor='name'>
          {t('tasks.name')}
        </label>
        <input
          className='text-input'
          type='text'
          id='name'
          value={task.name}
          placeholder={t('tasks.form.name-placeholder')}
          onChange={(e) =>
            setTask({ ...task, name: e.target.value })
          }
          required
          maxLength={20}
        />
        <label htmlFor='description'>
          {t('tasks.description')}
        </label>
        <textarea
          className='text-input'
          id='description'
          value={task.description}
          placeholder={t('tasks.form.description-placeholder')}
          onChange={(e) =>
            setTask({ ...task, description: e.target.value })
          }
          required
          maxLength={100}
        />

        <MeshInput handleMesh={handleMesh} />

        <div className='flex justify-center items-center mt-5'>
          <button onClick={goBack} className='m-2 flex justify-center'>
            {t('tasks.form.cancel')}
          </button>
          <ConfirmButton label={t('tasks.form.submit')} onConfirm={
            (e: FormEvent<HTMLFormElement>) => handleSubmitConfirm(e)
          } />
        </div>
        
      </form>
    </section>
  );
}
