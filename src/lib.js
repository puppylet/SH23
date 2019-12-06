export const  getOptions = () => {
  const token = localStorage.getItem('token')
  return {headers: {Authorization: `Bearer ${token}`}}
}
