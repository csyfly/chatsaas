'use client'

import React, { useState } from 'react'
import { Project } from '@prisma/client'
import { createProject, deleteProject, updateProject } from '@/actions/project'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import ProjectAddOrEdit from '@/components/project/ProjectAddOrEdit'
//import { useError } from '@/components/ErrorContext'
import { useUser } from "@clerk/nextjs";
import { getAllProjects } from "@/actions/project";
import { useEffect } from "react";

interface ProjectTableProps {
  
}

const ProjectTable: React.FC<ProjectTableProps> = ({  }) => {
  //const { showError } = useError()
  const { user } = useUser();
  
  const [data, setData] = useState<Project[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        console.log("user.id", user.id);
        const fetchedProjects = await getAllProjects(user.id);
        setData(fetchedProjects);
      }
    };
    fetchProjects();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (data.length <= 1) {
      //showError('不能删除最后一个项目。');
      return;
    }

    try {
      const result = await deleteProject(id);
      if (result.error) {
        //showError(result.error);
      } else {
        setData(data.filter(project => project.id !== id));
      }
    } catch (error) {
      //showError('删除项目时发生错误。');
    }
  }

  const handleCreate = async (newProject: Partial<Omit<Project, 'id'>>) => {
    if (newProject.name) {
      const createdProject = await createProject(newProject as Omit<Project, 'id'>);
      setData([...data, createdProject]);
      setIsCreateOpen(false);
    }
  };

  const handleEdit = async (editedProject: Partial<Project>) => {
    if (!editedProject.id) {
      //showError('Project ID is required for editing.');
      return;
    }
    const updatedProjectResult = await updateProject(editedProject.id, editedProject)
    setData(data.map(project => project.id === updatedProjectResult.id ? { ...project, ...updatedProjectResult } : project))
    setIsEditOpen(false)
    setEditingProjectId(null)
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.id}</TableCell>
              <TableCell 
                className="cursor-pointer hover:underline text-blue-500"
                onClick={() => {
                  setEditingProjectId(project.id)
                  setIsEditOpen(true)
                }}
              >
                {project.name}
              </TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  onClick={() => handleDelete(project.id)}
                  disabled={data.length <= 1}
                >
                  <Trash2 size={20} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="mr-1" size={20} />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Project</DialogTitle>
          <ProjectAddOrEdit 
            onSubmit={handleCreate} 
          /> 
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogTitle>Edit Project</DialogTitle>
          <ProjectAddOrEdit 
            onSubmit={handleEdit} 
            projectId={editingProjectId}
          /> 
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectTable
