import { SELECCIONAR_CLIENTE, SELECCIONAR_PRODUCTO, CANTIDAD_PRODUCTOS, ACTULIZAR_TOTAL } from '../../types/page'


export default (state, action) => {
    switch(action.type){
       
        case SELECCIONAR_CLIENTE:
        return {
            ...state,
            cliente: action.payload
        }

        case SELECCIONAR_PRODUCTO:
            return {
                ...state,
                productos: action.payload
            }

        case CANTIDAD_PRODUCTOS:
            return{
                ...state,
                productos: state.productos.map(product => action.payload.id === product.id ? product = action.payload : product )


            }
        case ACTULIZAR_TOTAL: 

            return {
                ...state,
                total: state.productos.reduce((nuevoTotal, articulo)=> nuevoTotal+= articulo.cantidad * articulo.precio ,0)
            }
       
        default:
            return state
    }
}
