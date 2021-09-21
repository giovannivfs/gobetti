import api from '../../services/api'
import IDivida from '../../types/IDivida'
const config = require('../../config.json')

const update = async (idUsuario: number, motivo: string, valor: number, id: string): Promise<any> =>{
  try{
    const response = await api.put(`/divida/${id}?uuid=${config.uuid}`,{
      idUsuario,
      motivo,
      valor
    })
    if(response.data.success){
      return {...response.data, message: `Dívida ${id} alterada com sucesso!`}
    }
    return response.data
  }catch(err){
    return {success: false, message: "Erro ao alterar dívida, tente novamente."}
  }
}

export default update