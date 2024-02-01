import config from "../config"
import { USER_ROLE } from "../modules/user/user.constant"
import { User } from "../modules/user/user.model"





const superAdmin = {
    id:'0001',
    email:'superAdmin@gmail.com',
    password:config.super_admin_password,
    needsPasswordChange:false,
    role:USER_ROLE.superAdmin,
    status:'in-progress',
    isDeleted:false
}

//protibar database connect hoar shomoy amra check korbo User collection e superAdmin role er kau ase ki na. takle ar create korbo na. r jodi super admin na take tokon amra uporar superAdmin r data deya new akta super admin create korbo. 
const seedSuperAdmin = async() =>{
    const isSuperAdminExists = await User.findOne({role:USER_ROLE.superAdmin});
    if(!isSuperAdminExists){
        await User.create(superAdmin)
    }
}

export default seedSuperAdmin;