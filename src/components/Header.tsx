import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu, Bell } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";
import { ChevronDown } from 'lucide-react';
import { useProjectStore } from "@/store/projectStore";
import Search from "./Search";

const Header = () => {
  const { projects, currentProject, fetchProjects, setCurrentProject } = useProjectStore();

    return (
      <header className="bg-white shadow-md h-16">
      <div className="flex items-center justify-between p-4">
      <button className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden">
          <Menu size={24} />
      </button>
      <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center p-0">
                          <span className="text-gray-600 pr-2">Project: </span>
                          {currentProject?.name}
                          <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                      {projects.map((project) => (
                          <DropdownMenuItem
                              key={project.id}
                              onClick={() => setCurrentProject(project)}
                          >
                              {project.name}
                          </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
              </DropdownMenu>
              <Search />
          </div>
          <div className="flex items-center">
              <button className="mr-4 text-gray-500 focus:outline-none focus:text-gray-700">
                  <Bell size={24} />
              </button>
              <UserButton></UserButton>
          </div>
      </div>
      </div>
  </header>
    )
}

export default Header;
