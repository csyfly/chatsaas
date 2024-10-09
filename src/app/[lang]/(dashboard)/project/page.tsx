'use client'
import ProjectTable from '@/components/project/ProjectTable';
// export const runtime = 'edge';

const ProjectPage: React.FC = () => {

  return (
    <div className='flex flex-col p-4'>
      <h1 className='text-2xl font-semibold '>Projects</h1>
      <ProjectTable />
    </div>
  );
};

export default ProjectPage;