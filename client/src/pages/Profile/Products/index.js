import { Button, Table, message } from 'antd'
import React, { useEffect } from 'react'
import ProductsForm from './ProductsForm';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import { DeleteProduct, GetProducts } from '../../../apicalls/products';
import { SetLoader } from '../../../redux/loadersSlice';
import Bids from './Bids';

function Products() {
  const[showBids,setShowBids]=React.useState(false);
  const [selectedProduct,setSelectedProduct]=React.useState(null);
  const [showProductForm, setShowProductForm]=React.useState(false);
  const {user}=useSelector((state)=>state.users);
    // ------------add a products table-----------
    const [products,setProducts]=React.useState([]);
    
    const dispatch=useDispatch();

     const getData=async()=>{
      try{
        dispatch(SetLoader(true));
        const response=await GetProducts({
         //user see their own product
          seller:user._id,
 //-------------------------------
        });
        dispatch(SetLoader(false));
        if(response.success){
          setProducts(response.data)
        }
      }catch(error){
        dispatch(SetLoader(false));
        message.error(error.message)
      }
     }

     //write function to delete the product
     const deleteProduct=async(id)=>{
      try {
        dispatch(SetLoader(true));
        const response=await DeleteProduct(id);
        dispatch(SetLoader(false));
        if(response.success){
          message.success(response.message);
          getData();
        }else{
          message.error(response.message);
        }
        
      } catch (error) {
        dispatch(SetLoader(false));
        message.error(error.message);
        
      }
    }
    const columns=[
      {
        title:"Product",
        dataIndex:"image",
        render:(text,record)=>{
          return (<img src={record?.images?.length>0?record.images[0]:""} alt=""
          className="w-20 h-20 object-cover rounded-md"/>
          );
        }
      },
      {
        title:"Name",
        dataIndex:"name",
      },
      {
        title:"Price",
        dataIndex:"price",
      },
      {
        title:"Category",
        dataIndex:"category",
      },
      {
        title:"Age",
        dataIndex:"age",
      },
      {
        title:"Status",
        dataIndex:"status",
      },
      {
        title:"Added On",
        dataIndex:"createdAt",
        render:(text,record)=> moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
      },
      {
        title:"Action",
        dataIndex:"action",
        render:(text,record)=>{
          return <div className="flex gap-5 items-center">
             <i className="ri-delete-bin-line"
             onClick={()=>{
              deleteProduct(record._id);
             }}></i>
             <i className="ri-edit-line"
              onClick={()=>{
                setSelectedProduct(record);
                setShowProductForm(true);
              }}></i>
              <span className="underline cursor-pointer" onClick={()=>{
                setSelectedProduct(record);
                setShowBids(true);
              }}>
                Show Bids
              </span>
          </div>
        }
      },
    ];
   
    useEffect(()=>{
      getData();
    },[]);
  return (
    <div>
        <div className="flex justify-end mb-2">
            <Button type='default'
            onClick={()=> setShowProductForm(true)}>
                Add Product
            </Button>
        </div>

        <Table columns={columns} dataSource={products} />
        {showProductForm && (
          <ProductsForm 
          showProductForm={showProductForm} 
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
          />
        
        )}

        {showBids && (
          <Bids 
          showBidsModal={showBids} 
          setShowBidsModal={setShowBids}
          selectedProduct={selectedProduct}
          
          />
        
        )}

      </div>
  );
}

export default Products