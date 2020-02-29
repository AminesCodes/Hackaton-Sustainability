import React from 'react'
import axios from 'axios'
import UsersProductCardComponent from './UsersProductCardComponent'

class UsersHome extends React.Component {
    constructor() {
        super()
        this.state = {
            brand_id: '0',
            material_id: '0',
            type_id: '0',
            brandOptions: [],
            materialOptions: [],
            typeOptions: [], 
            productsArr:[],
            currentProductIndex: 0,
        }
    }

    componentDidMount() {
        this.handleBrandOptions()
        this.handleTypeOfGarnment()
        this.handleAllMaterials()
        this.handleProductByFilter(this.state.brand_id, this.state.material_id, this.state.type_id)
        
    }

    handleBrandOptions = async () => {
        let allBrands = '/api/brands/'
        try {
            let { data } = await axios.get(allBrands)
            this.setState({
                brandOptions: data.payload
            })
        } catch (error) {
            console.log(error)
        }

    }

    handleTypeOfGarnment = async () => {
        let allTypes = '/api/types/all'
        try {
            let { data } = await axios.get(allTypes)
            this.setState({
                typeOptions: data.payload
            })
        } catch (error) {
            console.log(error)
        }
    }

    handleAllMaterials = async () => {
        let allMaterials = '/api/materials/all'
        try {
            let { data } = await axios.get(allMaterials)
            this.setState({
                materialOptions: data.payload
            })
        } catch (error) {
            console.log(error)
        }
    }

    handleInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })

        switch (event.target.name) {
            case 'brand_id':
                this.handleProductByFilter(event.target.value, this.state.material_id, this.state.type_id)
                
                break;
            case 'material_id':
                this.handleProductByFilter(this.state.brand_id, event.target.value, this.state.type_id)
                break;

            case 'type_id':
                this.handleProductByFilter(this.state.brand_id, this.state.material_id, event.target.value)
                break;
            default:
                break;
        }
    }


    handleProductByFilter = async (brand_id, material_id, type_id) => {
        let getProductsQuery = `/api/products/filters/${brand_id}/${type_id}/${material_id}`
        try {
            let productData = await axios.get(getProductsQuery)
            this.setState({
                productsArr: productData.data.payload
            })
        } catch (error) {
            console.log(error)
        }

    }
    
    // handleProductByBrand = async () => {
    //     const { brand_id } = this.state
    //     let brandId = Number(brand_id)
    //     let getProductsQuery = `/api/products/brand/${brandId}/all`

    //     try {
    //         let productData = await axios.get(getProductsQuery)
    //         console.log(productData)
    //     } catch (error) {
    //         console.log(error)
    //     }

    // }

    // handleProductByMaterial = async() => {
    //     const {material_id} = this.state
    //     let getProductByMaterialQuery = `/api/products/materials/${material_id}`
    //     try{
    //         let productInfo = await axios.get(getProductByMaterialQuery)
    //         console.log(productInfo)
    //     } catch(error){
    //         console.log(error)
    //     }

    // }

    // handleProductByType = async() =>{
    //     const {type_id} = this.state
    //     let getProductsByTypeQuery = `/api/products/type/${type_id}`
    //     try{
    //         let productByType = await axios.get(getProductsByTypeQuery)
    //         console.log(productByType)
    //     } catch(error){
    //         console.log(error)
    //     }
    // }


    handleSubmit = (event) => {
        event.preventDefault()
        const {brand_id, material_id, type_id} = this.state
        this.handleProductByFilter(brand_id, material_id, type_id)
    }

    handleVote = async (productId) =>{
        try{
            await axios.post('/api/votes/addVote', {user_id: this.props.loggedUser.id, product_id: productId});
            this.setState((state, props) => {
                return {currentProductIndex: state.currentProductIndex >= state.productsArr.length - 1
                    ? 0
                    : state.currentProductIndex + 1
                };
              });
        }
        catch(err){
            console.dir(err);
        }
    }

    handleAddToWishlist = async (productId) => { 
        try {
            await axios.post(`/api/wishlist/add/${productId}`, {user_id: this.props.loggedUser.id});
            this.setState((state, props) => {
                return {currentProductIndex: state.currentProductIndex >= state.productsArr.length - 1
                    ? 0
                    : state.currentProductIndex + 1
                };
            });
        }
        catch(err){
            console.dir(err);
        }
    } 

    handleIgnore = () =>{
        this.setState((state, props) => {
            return {currentProductIndex: state.currentProductIndex >= state.productsArr.length - 1
                ? 0
                : state.currentProductIndex + 1
            };
        });
    }


    render() {
        const { brandOptions, typeOptions, materialOptions } = this.state
        let brandName = brandOptions.map(el => (
            <option key={el.name} value={el.id}>{el.name}</option>

        ))

        let typeName = typeOptions.map(el => (
            <option key={el.name} value={el.id}>{el.name}</option>
        ))

        let materialName = materialOptions.map(el => (
            <option key={el.name} value={el.id}>{el.name}</option>
        ))

        return (
            <div className='container mt-5'>
                <form onSubmit={this.handleSubmit}>
                    <select name='brand_id' onChange={this.handleInput}>
                        <option value='0'>Select a brand</option>
                        {brandName}
                    </select>

                    <select name='type_id' onChange={this.handleInput}>
                        <option value='0'>Select a type</option>
                        {typeName}
                    </select>

                    <select name='material_id' onChange={this.handleInput}>
                        <option value='0'>Select a material</option>
                        {materialName}
                    </select>
                </form>

                <div className='card-holder'>
                    {
                        this.state.productsArr.length
                        ? <UsersProductCardComponent 
                                product={this.state.productsArr[this.state.currentProductIndex]}
                                // userId={this.props.loggedUser.id}
                                handleVote={this.handleVote}
                                handleAddToWishlist={this.handleAddToWishlist}
                                handleIgnore={this.handleIgnore}
                            />
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default UsersHome