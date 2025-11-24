import { 
    FiHome, 
    FiUser, 
    FiHeart, 
    FiFolder, 
    FiEdit3, 
    FiShield,
    FiImage,
    FiSettings,
    FiMail,
    FiUpload,
} from "react-icons/fi";

export interface AdminPageOptionType {
    title: string;
    description: string;
    icon: React.ElementType;
    href: string;
    color: string;
    bgGradient: string;
}


const adminOptions: AdminPageOptionType[] = [
    {
        title: "Home",
        description: "Manage homepage content, hero section, and featured projects",
        icon: FiHome,
        href: "/admin/home",
        color: "text-blue-600",
        bgGradient: "from-blue-500/10 to-blue-600/10"
    },
    {
        title: "About",
        description: "Edit about page, personal information, and bio content",
        icon: FiUser,
        href: "/admin/about",
        color: "text-green-600",
        bgGradient: "from-green-500/10 to-green-600/10"
    },
    {
        title: "My Life",
        description: "Share personal stories, experiences, and life journey",
        icon: FiHeart,
        href: "/admin/life",
        color: "text-pink-600",
        bgGradient: "from-pink-500/10 to-pink-600/10"
    },
    {
        title: "Projects",
        description: "Add, edit, and organize your development projects",
        icon: FiFolder,
        href: "/admin/projects",
        color: "text-purple-600",
        bgGradient: "from-purple-500/10 to-purple-600/10"
    },
    {
        title: "Blogs",
        description: "Create and manage blog posts, articles, and thoughts",
        icon: FiEdit3,
        href: "/admin/blogs",
        color: "text-orange-600",
        bgGradient: "from-orange-500/10 to-orange-600/10"
    },
    {
        title: "Gallery",
        description: "Upload and manage portfolio images and media",
        icon: FiImage,
        href: "/admin/gallery",
        color: "text-indigo-600",
        bgGradient: "from-indigo-500/10 to-indigo-600/10"
    },
    {
        title: "Shared Files",
        description: "Manage public file uploads from users",
        icon: FiUpload,
        href: "/admin/shared-files",
        color: "text-teal-600",
        bgGradient: "from-teal-500/10 to-teal-600/10"
    },
    {
        title: "Security",
        description: "Manage passwords, access controls, and site security",
        icon: FiShield,
        href: "/admin/security",
        color: "text-red-600",
        bgGradient: "from-red-500/10 to-red-600/10"
    },
    {
        title: "Settings",
        description: "Configure site settings, themes, and preferences",
        icon: FiSettings,
        href: "/admin/settings",
        color: "text-gray-600",
        bgGradient: "from-gray-500/10 to-gray-600/10"
    },
    {
        title: "Contact",
        description: "Review messages and manage contact form submissions",
        icon: FiMail,
        href: "/admin/contact",
        color: "text-cyan-600",
        bgGradient: "from-cyan-500/10 to-cyan-600/10"
    }
];

export default adminOptions;