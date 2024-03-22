import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmButton from '@/components/ConfirmButton';
import ModelInput from '@/features/model-input/ModelInput';
import '@/styles/components/Form.css';

interface TaskFormProps {
  task: {
    name: string;
    description: string;
    model: File | null;
  };
  setTask: (task: {
    name: string;
    description: string;
    model: File | null;
  }) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function TaskForm(props: TaskFormProps) {
  const { task, setTask, handleSubmit } = props;
  const navigate = useNavigate();


  const handleSubmitConfirm = (e: FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleModel = (glbFile: File) => {
    setTask({ ...task, model: glbFile });
  };

  return (
    <section className='form-container'>
      <div className='form-title'> Create New Task </div>
      <form className='form'>
        <label htmlFor='name'>Name</label>
        <input
          className='text-input'
          type='text'
          id='name'
          value={task.name}
          placeholder='Task Name'
          onChange={(e) =>
            setTask({ ...task, name: e.target.value })
          }
          required
          maxLength={20}
        />
        <label htmlFor='description'>Description</label>
        <textarea
          className='text-input'
          id='description'
          value={task.description}
          placeholder='Task Description'
          onChange={(e) =>
            setTask({ ...task, description: e.target.value })
          }
          required
          maxLength={100}
        />

        <ModelInput handleModel={handleModel} />

        <div className='flex justify-center items-center mt-5'>
          <button onClick={goBack} className='m-2 flex justify-center'>
            Cancel
          </button>
          <ConfirmButton label='Submit' onConfirm={
            (e: FormEvent<HTMLFormElement>) => handleSubmitConfirm(e)
          } />
        </div>
        
      </form>
    </section>
  );
}
