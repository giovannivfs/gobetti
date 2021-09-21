import api from '../../services/api'
import IDivida from '../../types/IDivida'
const config = require('../../config.json')

const list = async (id: number | string = '' ): Promise<IDivida[]> =>{
  try{
    const response = await api.get(`/divida/${id}?uuid=${config.uuid}`)
    return response.data.result
  }catch(err){
    return []
  }
}

export default list