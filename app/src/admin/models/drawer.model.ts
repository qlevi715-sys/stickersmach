export interface DrawerItemOption{
    name:string
    label:string
    icon:string
    subitems?:{
        name:string
        label:string
        icon:string
    }[]
}

export interface AdminProfile{
    name:string
    role:string
    avatarUrl:string
    version:string
}