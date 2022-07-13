import React from 'react';
import { useState } from "react";

export const AddWatch = (props) => {

const [name, setName] = useState('');
const [image, setImage] = useState('');
const [description, setDescription] = useState('');
const [price, setPrice] = useState('');


  return <div>
      <form>
  <div class="form-row">
    
  <input type="text" class="form-control" value={name}
           onChange={(e) => setName(e.target.value)} placeholder="name"/>

      <input type="text" class="form-control" value={image}
           onChange={(e) => setImage(e.target.value)} placeholder="image"/>
           
      <input type="text" class="form-control mt-2" value={description}
           onChange={(e) => setDescription(e.target.value)} placeholder="description"/>

      <input type="text" class="form-control mt-2" value={price}
           onChange={(e) => setPrice(e.target.value)} placeholder="price"/>

      <button type="button" onClick={()=>props.addWatch(name, image, description, price)} class="btn btn-primary mt-2">Add New Watch</button>
  </div>
</form>
  </div>;
};
