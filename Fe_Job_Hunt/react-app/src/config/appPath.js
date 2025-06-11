export const appPath = {
    notFound: "*",
    // auth
    login: "/login",
    register: "/register",
    
    //homepage
    home:"/blog/home",
    
    // role-based dashboards
    userDashboard: "/user/dashboard",
    adminDashboard: "/admin/dashboard",
    superAdminDashboard: "/super-admin/dashboard",
    
    // Admin management routes
    adminUsers: "/admin/users",
    adminDepartments: "/admin/departments",
    adminSubjects: "/admin/subjects",
    adminPosts: "/admin/posts",
    adminDocuments: "/admin/documents",
    adminSettings: "/admin/settings",
    
    // subjects
    subjects: "/subjects",
    subjectsByDepartment: (departmentId) => `/subjects/${departmentId}`
}