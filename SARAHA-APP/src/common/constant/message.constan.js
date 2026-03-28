const generateMessage=(entity)=>{
    return{
        alreadyExisst:`${entity} already Exist`,
        notFound:`${entity} Not Found`,
        created:`${entity} created Successfully`,
        updated:`${entity} updated Successfully`,
        deleted:`${entity} deleted Successfully`,
        failToCreate:`fail to Create ${entity}`,
        failToUpdate:`fail to Update ${entity}`,
        failToDelete:`fail to Delete ${entity}`,
    }
}
export const SYS_MESSAGE={
    users:generateMessage("User"),
    message:generateMessage("Message")
}