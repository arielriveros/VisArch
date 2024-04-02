import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import Button from '../buttons/Button';
import '@/styles/components/Form.css';

interface ProjectFormProps {
  title: string;
  project: {
    name: string;
    description: string;
    collaborators: {displayName: string, email: string, id: string}[];
  };
  setProject: (project: {
    name: string;
    description: string;
    collaborators: {displayName: string, email: string, id: string}[];
  }) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  usersList: {displayName: string, email: string, id: string}[];
}

export default function ProjectForm(props: ProjectFormProps) {
  const { title, project, usersList, setProject, handleSubmit } = props;
  const [search, setSearch] = useState<string>('');
  const [filteredUsersList, setFilteredUsersList] = useState<{displayName: string, email: string, id: string}[]>(usersList);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSearch = async (search: string) => {
      if (!usersList) return;
      
      // filter by search
      const filteredList = usersList.filter( user => {
        return (
          // search by name
          user.displayName.toLowerCase().includes(search.toLowerCase()) ||
          // search by email
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      });
      
      setFilteredUsersList(filteredList);
    };

    handleSearch(search);
  }, [usersList, search]);

  const handleSetCollaborators = (collaborators: {id: string, displayName: string, email: string}[]) => {
    setProject({
      ...project,
      collaborators
    });
  };

  const handleSubmitConfirm = (e: FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
  };

  return (
    <section className='form-container'>
      <div className='form-title'> {title} </div>
      <form className='form'>
        <label htmlFor='name'>Name</label>
        <input
          className='text-input'
          type='text'
          id='name'
          value={project.name}
          placeholder='Project Name'
          onChange={(e) =>
            setProject({ ...project, name: e.target.value })
          }
          required
          maxLength={20}
        />

        <label htmlFor='description'>Description</label>
        <textarea
          className='text-input'
          id='description'
          value={project.description}
          placeholder='Project Description'
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
          maxLength={100}
        />

        <label htmlFor='collaborators'>Collaborators</label>
        <input
          className='text-input'
          type='text'
          id='collaborators'
          value={search}
          placeholder='Search for Collaborators'
          onChange={(e) => setSearch(e.target.value)}
        />
        { filteredUsersList && search &&
        <div className='flex flex-col w-full max-h-40 overflow-y-auto border-2'>
          {filteredUsersList.map(user => (
            // return if collaborator is already added
            project.collaborators.find(c => c.id === user.id) ? null :
              <div key={user.id} className='flex  justify-between text-black bg-gray-100 hover:bg-gray-400 p-1 cursor-pointer' onClick={() => {
                handleSetCollaborators([...project.collaborators, { id: user.id, displayName: user.displayName, email: user.email }]);
                setSearch(''); }}
              >
                <p className='w-1/2 truncate'>{user.displayName}</p>
                <p className='w-1/2 truncate text-sm'>{user.email}</p>
              </div>
          ))}
        </div>}
        <div>
          {project.collaborators.map((collaborator) => (
            <div key={collaborator.id} className='flex w-full justify-between py-2 px-5'>
              <p className='wrap-text text-sm'>{collaborator.displayName}</p>
              <button className='bg-red-500 text-white text-xs p-1 rounded-full w-5 max-h-5 border-none' onClick={() => {
                handleSetCollaborators(project.collaborators.filter((c) => c.id !== collaborator.id));
              }}>X</button>
            </div>
          ))}
        </div>
        <div className='flex justify-center items-center mt-5'>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <ConfirmButton label='Submit' onConfirm={
            (e: FormEvent<HTMLFormElement>) => handleSubmitConfirm(e)
          } />
        </div>
        
      </form>
    </section>
  );
}
