import api from '../../services/api'
import IDivida from '../../types/IDivida'
const config = require('../../config.json')

const _delete = async (id: string | undefined ): Promise<any> => {
  try{
    const response = await api.delete(`/divida/${id}?uuid=${config.uuid}`)
    if(response.data.success){
      return {...response.data, message: `Dívida ${id} excluída com sucesso!`}
    }
    return response.data
  }catch(err){
    return {success: false, message: "Erro ao excluír divida, tente novamente."}
  }
}

export default _delete