import { Project } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
import { getProjectById } from "@/actions/project";
import { useEffect, useState } from "react";

// 定义表单验证模式
const formSchema = z.object({
  name: z.string().min(1, { message: "项目名称不能为空" }),
  description: z.string().optional(),
});

interface ProjectAddOrEditProps {
  projectId?: string | null;
  onSubmit: (data: Partial<Project>) => void;
}

const ProjectAddOrEdit: React.FC<ProjectAddOrEditProps> = ({ projectId, onSubmit }) => {
    const { user } = useUser();
    const [project, setProject] = useState<Project | null>(null);
    console.log("projectId:", projectId);

    useEffect(() => {
        async function fetchProject() {
            if (projectId) {
                const fetchedProject = await getProjectById(projectId);
                setProject(fetchedProject);
                console.log("fetchedProject:", fetchedProject);
            }
        }
        fetchProject();
    }, [projectId]);

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (project) {
            form.reset({
                name: project.name || "",
                description: project.description || "",
            });
        }
    }, [project, form]);

    // Handle form submission
    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const updatedProject: Partial<Project> = {
            ...project,
            name: values.name,
            description: values.description || null,
            creatorId: user?.id,
        };
        onSubmit(updatedProject);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter project name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter project description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                    {projectId ? "Update" : "Create"}
                </Button>
            </form>
        </Form>
    );
};

export default ProjectAddOrEdit;