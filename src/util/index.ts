export const maskReais = (val: number) => {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(val).replace('R$','')
}

export const formatDate = (dt: string, isTimestamp: true | false) => {
  return !isTimestamp ? new Date(dt).toLocaleDateString() : new Date(dt).toLocaleString()
}