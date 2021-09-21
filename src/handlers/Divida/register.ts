import api from '../../services/api'
import IDivida from '../../types/IDivida'
const config = require('../../config.json')

const register = async (idUsuario: number, motivo: string, valor: number): Promise<any> =>{
  try{
    const response = await api.post(`/divida/?uuid=${config.uuid}`,{
      idUsuario,
      motivo,
      valor
    })
    if(response.data.success){
      return {...response.data, message: `Dívida incluída com sucesso! | ID: ${response.data.result}`}
    }
    return response.data
  }catch(err){
    return {success: false, message: "Erro ao criar dívida, tente novamente."}
  }
}

export default register