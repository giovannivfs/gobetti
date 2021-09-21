import apiUser from '../../services/api-user'
import ICliente from '../../types/ICliente'
const list = async (): Promise<ICliente[]> =>{
  try{
    const response = await apiUser.get('/users')
    return response.data
  }catch(err){
    return []
  }
}

export default list