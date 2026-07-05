import React,{useEffect,useState} from "react";
import axios from "axios";
import ReactDOM from "react-dom/client";
import Bill from "../customerviews/Bill";
//import "./ProductList.css";

function ProductList(props)
{
    const [itemcount,setItemCount] = useState(0);
    const [selitems,setSelItems] = useState([]);
    const [pcatglist,setPCatgList] = useState([]);
    const [plist,setPList] = useState([]);
    const [vlist,setVList] = useState([]);

    useEffect(() => {
        axios.get("https://project-backend-nka5.vercel.app/product/showproduct")
        .then((res) => setPList(res.data))
        .catch((err) => alert(err));

        axios.get("https://project-backend-nka5.vercel.app/productcatg/showproductcatg")
        .then((res) => setPCatgList(res.data))
        .catch((err) => alert(err));

        axios.get("https://project-backend-nka5.vercel.app/vender/getvendercount")
        .then((res) => setVList(res.data))
        .catch((err)=> alert(err));
    },[]);

    const handleActiveButton=(pid) => {
        axios.put("https://project-backend-nka5.vercel.app/product/updateproductstatus/"+pid+"/Active")
        .then(() => alert("Product Status Updated"))
        .catch((err) => alert(err));
    }

    const handleInactiveButton=(pid) =>{
        axios.put("https://project-backend-nka5.vercel.app/product/updateproductstatus/"+pid+"/Inactive")
        .then(() => alert("Product Status Updated"))
        .catch((err) => alert(err)); 
    }

    const handleCheckOutButton=()=>{
        if(selitems.length<=0)
        {
            alert("Please Buy Some Product");
        }
        else
        {
            const root=ReactDOM.createRoot(document.getElementById("root"));

            let ccid=props.data;
            let obj = {
                selitems:selitems,
                cid:ccid
            };

            root.render(<Bill data={obj}></Bill>)
        }
    }

    const handleSearch=(evt)=>{
        if(evt.target.value>0)
        {
            axios.get("https://project-backend-nka5.vercel.app/product/showproductbycatgid/"+evt.target.value)
            .then((res)=> setPList(res.data))
            .catch((err)=> alert(err));
        }
        else
        {
            axios.get("https://project-backend-nka5.vercel.app/product/showproduct")
            .then((res)=> setPList(res.data))
            .catch((err)=> alert(err));
        }
    }

    const handleSearchByVender=(evt) => {
        if(evt.target.value>0)
        {
            axios.get("https://project-backend-nka5.vercel.app/product/showproductbyvender/"+evt.target.value)
            .then((res) => setPList(res.data))
            .catch((err)=> alert(err));
        }
        else
        {
            axios.get("https://project-backend-nka5.vercel.app/product/showproduct")
            .then((res) => setPList(res.data))
            .catch((err)=> alert(err));
        }
    }

    const handleSearchByStatus=(evt) => {
        if(evt.target.value!=="0")
        { 
            axios.get("https://project-backend-nka5.vercel.app/product/showproductstatus/"+evt.target.value)
            .then((res) => setPList(res.data))
            .catch((err)=> alert(err));
        }
        else
        {
            axios.get("https://project-backend-nka5.vercel.app/product/showproduct")
            .then((res) => setPList(res.data))
            .catch((err)=> alert(err));
        }
    }

    return (
  <div className="product-page">
    <center>

      <h1 className="page-title">Search Products</h1>

      <div className="filters">

        <div className="filter-box">
          <label>Category</label>
          <select onChange={handleSearch}>
            <option value="0">All</option>
            {pcatglist.map((pcatgitem) => (
              <option key={pcatgitem.pcatgid} value={pcatgitem.pcatgid}>
                {pcatgitem.pcatgname}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <label>Vendor</label>
          <select onChange={handleSearchByVender}>
            <option value="0">All</option>
            {vlist.map((vitem) => (
              <option key={vitem.Vid} value={vitem.Vid}>
                {vitem.VenderName}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <label>Status</label>
          <select onChange={handleSearchByStatus}>
            <option value="0">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

      </div>

      <h2 className="table-title">Product List</h2>

      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Offer</th>
              <th>Category</th>
              <th>Image</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {plist.map((item) => {
              const cname = pcatglist.find(
                (c) => c.pcatgid === item.pcatgid
              )?.pcatgname;

              return (
                <tr key={item.pid}>
                  <td>{item.pid}</td>
                  <td>{item.pname}</td>
                  <td>₹{item.pprice}</td>
                  <td>₹{item.oprice}</td>
                  <td>{cname}</td>

                  <td>
                    <img
                      className="product-img"
                      src={item.ppicname || "https://via.placeholder.com/100"}
                      alt=""
                    />
                  </td>

                  <td>
                    <span className={`status ${item.status}`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="action-btns">
                    <button onClick={() => handleActiveButton(item.pid)}>
                      Active
                    </button>
                    <button onClick={() => handleInactiveButton(item.pid)}>
                      Inactive
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </center>
  </div>
);} export default ProductList;