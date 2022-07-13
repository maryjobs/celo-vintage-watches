import React from 'react';
import { useState } from "react";

export const Watches = (props) => {

  const [newdescription, setDescription] = useState('');
  const [newprice, setPrice] = useState('');


  return <div className="card-container">

{props.watches.map((watch) =>(
    <div class="card">
    <img class="card-img-top" src={watch.image} alt="Card image cap" />
    <div class="card-body">
      <h5 class="card-title">{watch.name}</h5>
      <p class="card-text">{watch.description}</p>
      <h5 class="card-title">Price: {watch.price  / 1000000000000000000}cUSD</h5>

      { props.walletAddress !== watch.owner &&(
      <button type="button" onClick={()=>props.buyWatch(watch.index)} class="btn btn-primary mt-2">Buy Watch</button>
      )
}

{ props.walletAddress === watch.owner && (
     <form>
  <div class="form-r">
      <input type="text" class="form-control mt-4" value={newprice}
           onChange={(e) => setPrice(e.target.value)} placeholder="new price"/>
      <button type="button" onClick={()=>props.updatePrice(watch.index, newprice)} class="btn btn-primary mt-2">Update Price</button>
      
  </div>
</form>
)}

{ props.walletAddress === watch.owner && (
     <form>
  <div class="form-r">
      <input type="text" class="form-control mt-4" value={newdescription}
           onChange={(e) => setDescription(e.target.value)} placeholder="new description"/>
      <button type="button" onClick={()=>props.updateDescription(watch.index, newdescription)} class="btn btn-primary mt-2">Update Description</button>
      
  </div>
</form>
)}


      { props.walletAddress === watch.owner &&(
                    <button
                      type="submit"
                      onClick={() => props.removeWatch(watch.index)}
                      className="btn btn-primary m-3"
                    >
                      Remove Watch
                    </button>
                       )}
    </div>
  </div>
  ))}

</div>
};
